<template>
  <div id="mapwrapper">
    <object id="mapsvg" type="image/svg+xml" :data="mapsvg" @load="svgloaded=true"/>
    <slot></slot>
  </div>
</template>

<script>

/*  eslint-disable */ 

import Map from "@/components/Map.vue";
import Panzoom from '@panzoom/panzoom'
import { SVG } from '@svgdotjs/svg.js'
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";

gsap.registerPlugin(MotionPathPlugin);

export default {
  name: "Map",
  data() {
    return {
      mapsvg: require('@/assets/map/working/map.svg'),
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
    Map,
  },
  computed: {
    getSVGElementsWithId() {
      try {
        let elems  = Array.from(document.getElementById("mapsvg").contentDocument.getElementsByTagName("svg")[0].childNodes)
        .filter(function(m) {
         return m.id !== undefined;
        })
      return elems;
      } catch {
        return null;
      }
    },
    sortedMapElements() {

      // svg elements are named BLOB-test1 ... 
      // occasionally SVG fills or textures may be called BLOB-test1_1, etc
      // we want svgs split by a '-' without any underscores
      let d = {};
      this.getSVGElementsWithId
        .filter(function(elem) {
          return (!elem.id.includes("_"));
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
    hasLoaded() {
      return this.$store.getters.hasLoaded;
    },
    interviewsById() {
      return this.$store.getters.interviewsById;
    }
  },
  methods: {
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
      function delay(t){
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
        self.panTo(p.x, p.y, true);
        callback(p.x, p.y);
      }
     
    },


    /////////////////////////////

    placeBlobs() {
      var self = this;
      console.log(this.sortedMapElements);
      // scan along paths

      for (let id in this.sortedMapElements) {
        if(id in this.interviewsById) {
          // id is in both svg map and in airtable
          console.log("yo", id );

          let rec = this.sortedMapElements[id];
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

            svgblob.click(function() {
              console.log("clicked", svgpath.id());
              self.panAlongPath(svgpath.id(), duration, 50, function(x, y) {
                svgblob.animate({ duration: 50 }).ease('-').center(x, y);
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

};


window.SVG = SVG;

</script>
<style scoped lang="scss">


#mapwrapper {
  z-index: 10;
  width: 5000px;
  height: 5000px;
}

.clickable {
  background-color: blue;
}

#mapsvg:hover {
  background-color: pink;

}


</style>

