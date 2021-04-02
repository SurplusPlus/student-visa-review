<template>
  <div id="mapwrapper">
    <object id="mapsvg" type="image/svg+xml" :data="mapsvg" @load="svgloaded=true"/>
    <slot></slot>
    <div id="debug">
      heyyyy
      {{ sortMapElements() }} 
      {{ interviewsInMap }} 
    </div>
  </div>
</template>

<script>

/*  eslint-disable */ 

/******** MAP LOGIC ***********/
/*

Map is 5000 x 5000px, absolutely positioned.
Map background and data is driven by map.svg.
Blobs are svg blobs created by the InterviewBlob component.

When site is loaded..

1.
Airtable is processed for interview data. 
Airtable data has ids (e.g. 'mlbl', 'transit.mkad')


2. SVG map is processed for movement paths with the same ID 
SVG map layers are named with BLOB-mlbl, PATH-transit.mkd, etc to notate blob or path shapes.

Rules - paths and their directions note the movement of blobs on the page
TODO: for now, the blobs in illustrator are ignored.

3. Site scans for airtable data that is also in svg map as a path.

4. InterviewBlobs are placed at: 

if a transit blob, then either end of a transit path
else on the closed loop of a path

5. When InterviewBlobs are clicked:
- existing audio is paused
- existing animation is stopped / handled TODO
- new audio is loaded and played
- new animation is created

===

An animation consists of:
- the 
MapController handles

*/



import Map from "@/components/Map.vue";
import InterviewBlob from "@/components/InterviewBlob.vue";

import Panzoom from '@panzoom/panzoom'
import { SVG } from '@svgdotjs/svg.js'
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";

gsap.registerPlugin(MotionPathPlugin);

export default {
  name: "Map",
  data() {
    return {
      mapsvg: require('@/assets/map/map_orig.svg'),
      loaded: false,
      svgloaded: false,
      dim: 5000,
      panzoom: null,
      x: 2500, 
      y: 2500,
    };
  },
  props: ["scale"],
  components: {
    InterviewBlob,
    Map,
  },
  computed: {
    hasLoaded() {
      return this.$store.getters.hasLoaded;
    },
    interviewsById() {
      return this.$store.getters.interviewsById;
    },
    interviewsInMap() {
      return "yo";
//      return this.sortedMapElements.filter(function(id) {
//        return id in this.interviewsById;
//      });
    },

  },
  methods: {
    getSVGElementsWithId() {
      try {
        let elems  = Array.from(document.getElementById("mapsvg").contentDocument.getElementsByTagName("svg")[0].childNodes)
        .filter(function(m) {
         return m.id !== undefined && m.id !== "";
        })
        return elems;
      } catch {
        return [];
      }
    },
    sortMapElements() {
      // svg elements are named BLOB-test1 ... 
      // occasionally SVG fills or textures may be called BLOB-test1_1, etc
      // we want svgs split by a '-' without any underscores
      let d = {};
      this.getSVGElementsWithId()
        .filter(function(elem) {
//          return (!elem.id.includes("_"));
          return true;
        })
        .forEach(function(elem) {
          try {
            let [typ, id] = elem.id.split("-");
            if(!(id in d) && id !== undefined) { d[id] = {}; }
            d[id][typ] = elem; 
          } catch {
            // elem doesn't have a dash in it
          }
        });
      return d;

    },
    getSVGID(id) {
      return document.getElementById("mapsvg").contentDocument.getElementById(id);
    },
    panTo(x, y, animate = true) {
      this.x = x;
      this.y = y;
      let s = this.scale;
      this.panzoom.pan(
        (1 - 1/s) * this.dim / 2 + (window.innerWidth / 2 / s ) - (x), 
        (1 - 1/s) * this.dim / 2  + (window.innerHeight / 2 / s ) - (y), {animate: animate})
    },
    getXYofID(id) {
      try {
        var bbox = this.getSVGID(id).getBBox();
        return {x: bbox.x + (bbox.width / 2), y: bbox.y + (bbox.height / 2) };
      } catch {
        return null;
      }
    },
    panToID(id, animate = true) {
      let xy = this.getXYofID(id);
      console.log(xy);
      this.panTo(xy.x, xy.y, animate);
    },
    getPathPoints(id, steps) {
      var svg = this.getSVGID(id);
      console.log(svg);
      var rawPath = MotionPathPlugin.getRawPath(svg);
      MotionPathPlugin.cacheRawPathMeasurements(rawPath);
      let points = [];
      for(let i = 0; i <= 1; i+= 1 / (steps + 1)) {
        points.push(MotionPathPlugin.getPositionOnPath(rawPath, i, true))
      }
      return points;
    },
    async panAlongPath(id, durationms, stepinterval, callback) {
      function delay(t) {
        return new Promise((resolve,reject)=>{
          setTimeout(()=>{
            resolve();
          },t)
        })
      }
      var self = this;
      let steps = durationms / stepinterval;
      let pathpoints = getPathPoints(id, steps);

      console.log(steps)
      console.log(pathpoints)

      for(let p of pathpoints) {
        await delay(stepinterval);
        self.panTo(p.x, p.y, false);
        callback(p.x, p.y);
      }
     
    },

    async animatedemo() {
      function delay(t) {
        return new Promise((resolve,reject)=>{
          setTimeout(()=>{
            resolve();
          },t)
        })
      }
      var self = this;
      let steps = 1000

      console.log(steps)

      for(let x = 0; x < 4; x+= 0.01) {
        await delay(5);
        self.panTo(2500 + Math.sin(x) * 1000, 2500 + Math.cos(x) * 1000, false)
      }
     
    },



    /////////////////////////////

    placeBlobs() {
      var self = this;
      console.log(this.sortMapElements());
      // scan along paths

      for (let id in this.sortMapElements()) {
        if(id in this.interviewsById) {
          // id is in both svg map and in airtable
          console.log("yo", id );

          let rec = this.sortMapElements()[id];
          let audiofile = null;
          try { 
            thisfile = this.interviewsById[id].fields["Audio File"][0];
          } catch {
          }

          /*
          get blob

          if blob has path
            move blob to start and end of path
          else
            don't... do anything
          */

         
          if("PATH" in rec) {

            console.log("rec has path");
            console.log(rec["PATH"]);

            let svgblob = SVG(rec["BLOB"]);
            let svgpath = SVG(rec["PATH"]);
            let start = svgpath.pointAt(0);
            let end = svgpath.pointAt(svgpath.length());

            console.log(start, end);

            svgblob.center(start.x, start.y);



            // duration setup
            let duration;
            try { 
              duration = this.interviewsById[id].fields['Duration'] * 1000;
            } catch {
              duration = 5000;
            }

            console.log("Setting a click");
            svgblob.click(function() {
              console.log("clicked", svgpath.id());
              self.panAlongPath(svgpath.id(), duration, 20, function(x, y) {
                svgblob.animate({ duration: 20 }).ease('-').center(x, y);
              });
              self.$store.dispatch('playInterview', self.interviewsById[id].id);

            });

            svgblob.addClass("clickable"); // TODO - figure out how to tyle svg



            if(start.x !== end.x || start.y !== end.y) { 
              // open loop
              svgblob.center(end.x, end.y) // TODO - this needs some work
            }

          } 



          // TODO - given this invormation, move the blobs to the right spot 
          console.log("ok");

        }
      }

    },


    initPanZoom() {

      this.panzoom = Panzoom(document.getElementById("mapwrapper"), {
        startScale: this.scale
      }); 

      var self = this;

      setTimeout(() => { 
        let s = this.getSVGID("START")
        if(!s) {
          console.log("PROBLEM! START is not defined in SVG");
        } else {
          this.panToID("START", false);
        }
      }, 10) // not sure why this works but it does


      window.addEventListener('resize', function() {
        self.panTo(self.x, self.y, false);
      });

      // for debug
      window.panzoom = this.panzoom;
      window.panTo = this.panTo;
      window.panToID = this.panToID;
      window.getPathPoints =  this.getPathPoints;
      window.panAlongPath =  this.panAlongPath; 
      window.getSVGID = this.getSVGID;
      window.sortMapElements = this.sortMapElements;
      window.getSVGElementsWithId = this.getSVGElementsWithId;
      window.initMap = this.initMap;
      window.animatedemo = this.animatedemo;
    },


    ///////////////////

    initMap() {
      this.initPanZoom();
      this.placeBlobs();
    },


    listenForOnload() {
      if(this.hasLoaded && this.svgloaded) {
        console.log("MAP LOADED");
        this.loaded = true;
        this.initMap();
      } else {
        setTimeout(this.listenForOnload, 500);
      }
    },


  },
  mounted() {
    this.listenForOnload();
  },
  created() {
  },
  updated() {
  },
  watch: {
    svgLoaded: function() {
      console.log("OK svgloaded");
    },
  },


};


window.SVG = SVG;

</script>
<style scoped lang="scss">


#debug {
  position: absolute;
  top: 2411px;
  left: 545px;
  z-index: 100000;
  border: 2px solid pink;
  width: 100px;
  height: 100px;
}

#mapwrapper {
  z-index: 10;
  width: 5000px;
  height: 5000px;
}


.clickable {
  background-color: blue;
}

#mapsvg:hover {
}


</style>

