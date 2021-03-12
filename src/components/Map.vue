<template>
  <div id="mapwrapper">
    {{ scale }} 
    <object id="mapsvg" type="image/svg+xml" :data="mapsvg" />
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
      mapsvg: require('@/assets/map.svg'),
      svgloaded: false,
      dim: 5000,
      panzoom: null,
      x: 3737,
      y: 1213,
    };
  },
  props: ["scale"],
  components: {
    Map,
  },
  computed: {
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
      var bbox = this.getSVGID(id).getBBox();
      return {x: bbox.x + (bbox.width / 2), y: bbox.y + (bbox.height / 2) };
    },
    panToID(id, animate = true) {
      let xy = this.getXYofID(id);
      panTo(xy.x, xy.y, animate);
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
    async panAlongPath(id, durationms) {
      function delay(t){
        return new Promise((resolve,reject)=>{
          setTimeout(()=>{
            resolve();
          },t)
        })
      }
      var self = this;
      let stepinterval = 200;
      let steps = durationms / stepinterval;
      let pathpoints = getPathPoints(id, steps);

      console.log(steps)
      console.log(pathpoints)

      for(let p of pathpoints) {
        await delay(stepinterval);
        self.panTo(p.x, p.y, true);
      }
     
    },
    onsvgload() {
      var self = this;
      self.getSVGID("OJ-october").addEventListener('click', function(e) {
        self.panAlongPath("OJ-october-path", 5000);
      })
      self.getSVGID("KH-october").addEventListener('click', function(e) {
        self.panAlongPath("KH-october-path", 5000);
      })
    }
  },
  mounted() {
    var self = this;
    this.panzoom = Panzoom(document.getElementById("mapwrapper"), {
      startScale: this.scale,
      startX: this.x,
      startY: this.y,
    }); 
    this.panTo(this.x, this.y);

    window.addEventListener('resize', function() {
      console.log("resized");
      this.panTo(self.x, self.y, false);
    });

    window.panzoom = this.panzoom;
    window.panTo = this.panTo;
    window.panToID = this.panToID;
    window.getPathPoints =  this.getPathPoints;
    window.panAlongPath =  this.panAlongPath;



  },
  created() {
  },
  updated() {
    if(document.getElementById("mapsvg") !== null && !this.svgloaded) { 
      this.svgloaded = true;
      this.onsvgload();
    }
    this.panzoom.zoom(this.scale);
    this.panTo(this.x, this.y);
  },

};



</script>
<style scoped lang="scss">


#mapwrapper {
  z-index: 10;
  width: 5000px;
  height: 5000px;
}


</style>

