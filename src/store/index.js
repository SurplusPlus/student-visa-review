/* eslint-disable */

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
        callback(interviews);
      }
    );
}


export default new Vuex.Store({
  state: {
    interviews: [],
    people: [],
    hasLoaded: false,
  },
  getters: {
    interviews(state) {
      return state.interviews;
    },
    people(state) {
      return state.people;
    },
  },
  mutations: {
		setInterviews(state, r) {
			state.interviews = r;
		},
		setPeople(state, r) {
			state.people = r;
		},
  },
  actions: {
    fetchData(context) {
      if (!context.state.hasLoaded) {
        context.dispatch("fetchInterviews");
        context.dispatch("fetchPeople");
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
      });
    },
  }
});
