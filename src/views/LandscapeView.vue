<template>
  <div class="landscape" @mousemove="mousemove">

    <div>[LANDSCAPE / MAIN PAGE TO GO HERE]</div>

    <SoundPoint class="soundpoint" v-for="record in interviews" v-bind:key="record.id" :id="record.id" :style="positionStyle(record.id)" >
      <InterviewBlob :id="record.id"  />
    </SoundPoint>

    <Listener :x="mouseX" :y="mouseY" />

    <button @click="test">stop</button>

    <BackgroundSky />

  </div>
</template>

<script>

/*  eslint-disable */ 


import BackgroundSky from "@/components/BackgroundSky.vue";
import {Howler} from 'howler';
import InterviewBlob from "@/components/InterviewBlob.vue";
import SoundPoint from "@/components/SoundPoint.vue";
import Listener from "@/components/Listener.vue";
//import SoundPlayer from "@/components/SoundPlayer.js"

export default {
  name: "About",
  data() {
    return {
      interviewSounds: {},
      mouseX: null,
      mouseY: null,
    };
  },
  components: {
    InterviewBlob,
    SoundPoint,
    Listener,
    BackgroundSky,
  },
  computed: {
    interviews() {
      return this.$store.getters.interviews;
    },
    allFields() {
      try { 
        return Object.keys(this.interviews[0].fields)
      } catch {
        return []
      }
    },
    gbcr() {
      return this.$el.getBoundingClientRect();
    }
  },
  methods: {
    mousemove(e) {
      this.mouseX = Math.round(e.pageX - this.gbcr.x);
      this.mouseY = Math.round(e.pageY - this.gbcr.y);
    },
    positionStyle(id) {
      return { 
        top: this.interviews[id].fields["x"] + "px",
        left: this.interviews[id].fields["y"] + "px"
      };
    },
    test() {
        Howler.stop()
    },
    audioFileOf(interviewid) {
      try {
        return this.interviews[interviewid].fields["Audio File"][0]["url"];
      } catch {
        return "";
      }
    },
  },
  mounted() {
  },
};
</script>
<style scoped lang="scss">
.landscape {
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;

}

.soundpoint {
  width: 75px;
  position: absolute;
}



</style>

