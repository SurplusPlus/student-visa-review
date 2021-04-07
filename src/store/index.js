/* eslint-disable */

require('dotenv').config();

const process_api_key = process.env.VUE_APP_AIRTABLE_API_KEY;
const airtable_base = process.env.VUE_APP_AIRTABLE_BASE;
const airtable_interviews_table = process.env.VUE_APP_AIRTABLE_INTERVIEWS_TABLE;
const airtable_interviews_view = process.env.VUE_APP_AIRTABLE_INTERVIEWS_VIEW;
const airtable_people_table = process.env.VUE_APP_AIRTABLE_PEOPLE_TABLE;
const airtable_people_view = process.env.VUE_APP_AIRTABLE_PEOPLE_VIEW;

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

function loadAirtableData(options, callback) {
  var Airtable = require("airtable");
  var base = new Airtable({ apiKey: options.apikey }).base(options.base);
  let interviews = [];

  base(options.table)
    .select({
      view: options.view 
    })
    .eachPage(
      function page(partialInterviews, fetchNextPage) {
        interviews = [...interviews, ...partialInterviews];
        fetchNextPage();
      },
      function done(err) {
//        console.log("Fetched Interviews", interviews);
        if (err) {
          console.error(err);
          return;
        }
        console.log(interviews);
        callback(interviews);
      }
    );
}


function loadAudiopathDataFromSvg(svgpath, callback) {
  const parser = new DOMParser(); 
  fetch(svgpath)
    .then(function (response) {
      return response.text();
    })
    .then(function(text) {
      const svgDoc = parser.parseFromString(text, 'image/svg+xml');
      let pathData = Array.from(svgDoc.querySelectorAll('path'))
        .map(function(x) { 
          return { rawid: x.getAttribute("id"), d: x.getAttribute("d"), elem: x }  
        })

      var audiopathData = pathData;

      audiopathData.forEach(function(d) {
        d.id = d.rawid;
      });

/*      var audiopathData = pathData.filter(function(d) {
          return d.rawid.includes( "PATH-");
      });

      audiopathData.forEach(function(d) {
        d.id = d.rawid.replace("PATH-", "");

        if(d.rawid.includes("TRANSIT")) {
          d.type = "transit";
        } else if(d.rawid.includes("intro")) {
          d.type = "intro";
        } else {
          d.type = "interview";
        }
      }); */

      callback(audiopathData);
    });
}





export default new Vuex.Store({
  state: {
    mapsvg: require('@/assets/map/working/pathmap.svg'),
    interviews: [],
    people: [],
    _rawAudiopathData: [],
    audiopathData: [],
    loadedNum: 0,
    hasLoaded: false,
    mapScale: 1,

    playingPathId: null,
    nextPlayingPathId: null,
    playingPathDuration: null,
    status: "stopped", // stopped, playing, requeuing (aka moving to a new queue)
    playedIntro: false,
    sky: "day",

    
  },
  getters: {
    interviews(state) {
      return state.interviews;
    },
    hasLoaded(state) {
      return state.hasLoaded;
    },
    interviewsById(state) {
      return Object.values(state.interviews).reduce(function(a, b) { 
        if("SVGID" in b.fields) { 
          a[b.fields["SVGID"]] = b;
        }
        return a;
      }, {});
    },
    interviewsByBureauChief(state) {

      return Object.values(state.interviews).reduce((map, obj) => {

        let bc;
        try {
          bc = state.people[state.interviews[obj.id].fields["Bureau Chief"]];
        } catch {
          bc = undefined;
        }

        if(bc && bc.id) {
          if(!(bc.id in map)) { 
            map[bc.id] = state.people[bc.id];
            map[bc.id].interviews = [];
          }
          map[bc.id].interviews.push(obj);
        }
        return map;
      }, {});
    },
    people(state) {
      return state.people;
    },
    playingPathId(state) {
      return state.playingPathId;
    },
    nextPlayingPathId(state) {
      return state.nextPlayingPathId;
    },
    audiopathData(state) {
      return state.audiopathData;
    },
    playingPathData(state) {
      try {
        let thisdata = state.audiopathData.filter(function(d) {
          return d.id === state.playingPathId;
        })[0];
        return thisdata;
      } catch {
        return null;
      }
    },
  },
  mutations: {
		setInterviews(state, r) {
			state.interviews = r;
		},
		setPeople(state, r) {
			state.people = r;
		},
    setLoaded(state) {
			state.hasLoaded = true;
		},
    setPlayingPathId(state, id) {
			state.playingPathId = id;
		},
    setNextPlayingPathId(state, id) {
			state.nextPlayingPathId = id;
		},
    setPlayingPathDuration(state, dur) {
			state.playingPathDuration = dur;
		},
    setStatus(state, status) {
      state.status = status;
    },
    setPlayedIntro(state, pi) {
      state.playedIntro = pi;
    },
    setAudiopathData(state, apd) {
      state.audiopathData = apd;
    },
    setRawAudiopathData(state, apd) {
      state._rawAudiopathData = apd;
    },
    setSky(state, sky) {
      state.sky = sky;
    },
  },
  actions: {
    fetchData(context) {
      if (!context.state.hasLoaded) {
        context.dispatch("fetchInterviews");
        context.dispatch("fetchPeople");
        context.dispatch("fetchAudiopathData");
      }
    },
    fetchInterviews(context) {
      loadAirtableData({
        apikey: process_api_key,
        base: airtable_base,
        table: airtable_interviews_table,
        view: airtable_interviews_view,
      },
        function(interviewsRaw) {
        var interviewsRaw = interviewsRaw.filter(w => w.fields["Name"]);
        var interviews = interviewsRaw.reduce((map, obj) => {
          map[obj.id] = obj;
          return map;
        }, {});
        context.commit("setInterviews", interviews);
        if(++context.state.loadedNum == 3) { context.dispatch("postFetch") }
      });
    },
    fetchPeople(context) {
      loadAirtableData({
        apikey: process_api_key,
        base: airtable_base,
        table: airtable_people_table,
        view: airtable_people_view,
      },
        function(peopleRaw) {
        var peopleRaw = peopleRaw.filter(w => w.fields["Name"]);
        var people = peopleRaw.reduce((map, obj) => {
          map[obj.id] = obj;
          return map;
        }, {});
        context.commit("setPeople", people);
        if(++context.state.loadedNum == 3) { context.dispatch("postFetch") }
      });
    },
    fetchAudiopathData(context) {
      loadAudiopathDataFromSvg(context.state.mapsvg, function(audiopathData) {
        context.commit("setRawAudiopathData", audiopathData);
        if(++context.state.loadedNum == 3) { context.dispatch("postFetch") }
      });
    },
    postFetch(context) {

      let interviewsByAirtableSVGIDs = Object.values(context.state.interviews)
        .filter(function(d) { return d.fields['SVGID'] !== undefined })
        .reduce(function(a,d) { 
          a[d.fields['SVGID']] = d.fields;
          a[d.fields['SVGID']].airtableid = d.id;
          return a;
        }, {})

      console.log(interviewsByAirtableSVGIDs);
      window.interviewsByAirtableSVGIDs = interviewsByAirtableSVGIDs;
      console.log(context.state._rawAudiopathData);

      let validAudiopathData = context.state._rawAudiopathData.filter(function(audiopath) {
        return audiopath.id in interviewsByAirtableSVGIDs;
      });

      validAudiopathData.forEach(function(audiopath) {
        audiopath['airtableid'] = interviewsByAirtableSVGIDs[audiopath.id]['airtableid']
        audiopath.type = interviewsByAirtableSVGIDs[audiopath.id]['Type']
        audiopath['Transcript'] = interviewsByAirtableSVGIDs[audiopath.id]['Transcript']
        audiopath['Duration'] = interviewsByAirtableSVGIDs[audiopath.id]['Duration']
        audiopath['Name'] = interviewsByAirtableSVGIDs[audiopath.id]['Name']
        audiopath['SVGTexture'] = interviewsByAirtableSVGIDs[audiopath.id]['SVGTexture']
        try {
          audiopath['Audio File'] = interviewsByAirtableSVGIDs[audiopath.id]['Audio File'][0]
        } catch { 
        }
      });

      let dictAudiopathData = validAudiopathData.reduce(function(d, audiopath) {
        if(audiopath.type === "transit") {
          let thisid = audiopath.id;
          d[thisid + "-A"] = audiopath;
          d[thisid + "-A"].id = thisid + "-A";
          d[thisid + "-B"] = Object.assign({}, audiopath);
          d[thisid + "-B"].id = thisid + "-B";
        } else { // HACKY BUT WORKS
          d[audiopath.id] = audiopath;
        }
        return d;
      }, {});

      console.log(dictAudiopathData);
      context.commit("setAudiopathData", dictAudiopathData);

      window.dictAudiopathData = dictAudiopathData;

      context.commit("setLoaded");
    },
    playPath(context, id) {
      context.commit("setPlayingPathId", id);
    },
  }
});
