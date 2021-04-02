<template>
  <div id="audiopath">
    <div class="mapblob" v-for="p in pathPoints"  :key="p.x + p.y" :style="{ top: p.y - blobRadius + 'px', left: p.x - blobRadius + 'px'}">
      <InterviewBlob :id="thisData.id"  />
    </div>
  </div>
</template>

<script>

/*  eslint-disable */ 

import InterviewBlob from "@/components/InterviewBlob.vue";

import { SVG } from '@svgdotjs/svg.js'

export default {
  name: "AudioPath",
  props: ['id'],
  data() {
    return {
      blobRadius: 100,
    };
  },
  components: {
    InterviewBlob
  },
  computed: {
    audiopathData() {
      return this.$store.getters.audiopathData;
    },
    thisData() {
      var self = this;
      return this.audiopathData.filter(function(d) { return d.id === self.id; })[0]
    },
    svgElem() {
      return SVG(this.thisData.elem);
    },
    pathPoints() {
      var points = [];
      points.push( this.svgElem.pointAt(0) );
      if(this.thisData.type === "transit") {
        points.push( this.svgElem.pointAt(this.svgElem.length()) );
      }
      return points;
    },
  },
  methods: {
    onclick(e) {
      console.log("ya clicked me", e);
    }
  },
  mounted() {
  },
};
</script>
<style scoped lang="scss">
.mapblob{
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  z-index: 10000;
  width: 200px;

}


</style>


