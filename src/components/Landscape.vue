<template>
  <div class="landscape" @mousemove="mousemove">

    <SoundPoint class="soundpoint" v-for="record in interviews" v-bind:key="record.id" :id="record.id" :style="positionStyle(record.id)" >
      <InterviewBlob :id="record.id"  />
    </SoundPoint>

    <button @click="test">stop</button>

  </div>
</template>

<script>

/*  eslint-disable */ 

import {Howler} from 'howler';
import InterviewBlob from "@/components/InterviewBlob.vue";
import SoundPoint from "@/components/SoundPoint.vue";
//import SoundPlayer from "@/components/SoundPlayer.js"

export default {
  name: "About",
  data() {
    return {
      interviewSounds: {},
      interviewLocations: {},
    };
  },
  components: {
    InterviewBlob,
    SoundPoint,
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
      let x = Math.round(e.pageX - this.gbcr.x);
      let y = Math.round(e.pageY - this.gbcr.y);
      console.log(x,y);
      Howler.pos(x, y, 0)
      console.log("setting pos to " , x, y, 0)
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

    initLocations() {
      //    this.soundPlayer = new SoundPlayer();
      var self = this;
      for(let id in this.interviews) {
        var x = Math.random() * 400;
        var y = Math.random() * 400;
        self.interviewLocations[id] = { x: x, y: y, z: 0 };
/*        this.interviewSounds[id] = new Howl({
          src: this.audioFileOf(id),
          pos: [x, y, 0],
        });  */
      }
        console.log(self.interviewLocations);

    },
  },
  mounted() {
    this.initLocations();
  },
};
</script>
<style scoped lang="scss">
.landscape {
  position: relative;
  height: 1000px;
  background-color: #AAB;
}

.soundpoint {
  width: 75px;
  position: absolute;
}



</style>

