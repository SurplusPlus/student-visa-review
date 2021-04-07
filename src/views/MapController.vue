<template>
  <div id="mapcontroller">

    {{ stateLoaded}} 
    <div id="windowcenter">{{ playingPathId }}</div>


    <div id="mapcanvas">

      <AudioPath v-for="d in audiopathData" :key="d.id" :id="d.id"></AudioPath>

      <SvgMapBackdrop scale="1"></SvgMapBackdrop>

    </div>

    <BackgroundSky class="fixed" />

  </div>
</template>

<script>

/*  eslint-disable */ 


import BackgroundSky from "@/components/BackgroundSky.vue";
import AudioPath from "@/components/AudioPath.vue";
import SvgMapBackdrop from "@/components/SvgMapBackdrop.vue";

import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";
gsap.registerPlugin(MotionPathPlugin);

export default {
  name: "MapController",
  data() {
    return {
      gsapMapcanvas: null,
    };
  },
  components: {
    AudioPath,
    SvgMapBackdrop,
    BackgroundSky,
  },
  computed: {
    interviews() {
      return this.$store.getters.interviews;
    },
    audiopathData() {
      return this.$store.getters.audiopathData;
    },
    allFields() {
      try { 
        return Object.keys(this.interviews[0].fields)
      } catch {
        return []
      }
    },
    stateLoaded() {
      return this.$store.getters.hasLoaded;
    },
    playingPathId() {
      return this.$store.getters.playingPathId;
    },
    nextPlayingPathId() {
      return this.$store.getters.nextPlayingPathId;
    },
  },
  methods: {
    stopExistingJourney() {
      // audio fadeout is handled by SoundPlayer.vue's watch function

    },
    focusOnNewBlob() {
    },
    startNewJourney(newid) {
      this.$store.commit("setPlayingPathId", newid);

      console.log(newid, this.audiopathData, this.audiopathData[newid])

      this.gsapMapcanvas = gsap.to("#mapcanvas", {
        motionPath: {
            path:[{x:2500, y:2500}, {x:2800, y:2800}, {x:3000, y:3000}, {x:1000, y:3000}],
        },
        transformOrigin: "50% 50%",
        force3D: false,
        duration: 2,
        ease: "power2.inOut"
      });
    },
    scheduleNewJourney(newid, oldid) {
      var self = this;

      // stop existing animation
      this.stopExistingJourney();

      // requeuing animation, as focus of camera goes to new blob
      this.focusOnNewBlob();

      // when animation is done, start new animation
      setTimeout(function() {
        self.startNewJourney(newid);
      }, 2000);
    },

  },
  watch: {
    nextPlayingPathId(newid, oldid) {
      this.scheduleNewJourney(newid, oldid);

    },
  },
  mounted() {
    window.gsap = gsap;
  },
};
</script>
<style scoped lang="scss">
#mapcontroller {
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
}

#mapcontroller > * {
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
}

#mapcanvas {
  margin: 0px;
  padding: 0px;
  z-index: 1;
}
.fixed {
  position: fixed !important;
}




#windowcenter {
  width: 6px;
  height: 6px;
  position: fixed;
  top: calc(50% - 3px);
  left: calc(50% - 3px);
  background-color: black;
  border-radius: 5px;
  z-index: 1000;
}


</style>

