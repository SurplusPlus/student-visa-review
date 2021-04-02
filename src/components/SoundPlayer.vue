<template>
  <div class="soundplayer debug" :class="{ playing : isPlaying }">
   soundplayer debug 
    {{ playingPathId }}
    {{ audioFile }} 

  </div>
</template>

<script>
/*  eslint-disable */ 

import {Howl, Howler} from 'howler';

export default {
  name: "PathPlayer",
  data() {
    return {
      interviewPath: undefined,
      ambientPath: undefined,
      isPlaying: false,
      status: "stopped",
    };
  },
  mounted() {
  },
  methods: {
    initAmbientPath() { // TODO : currently not working 
      this.ambientPath = new Howl({
        src: [ '@/assets/ambient_crickets.webm' ],
        html5: true,
        autoplay: true,
        loop: true,
      });
      this.ambientPath.play();
      window.as = this.ambientPath;
    },
    playPathById(id) {

      if(this.ambientPath === undefined) {
        console.log("triggering");
        this.initAmbientPath();
      }

      console.log('wooo', this.audioFile);
      try { 
        this.interviewPath.stop();
        this.interviewPath.unload();
      } catch {}
      this.interviewPath = new Howl({
        src: [this.audioFile],
        autoplay: false,
        loop: false,
      });
      this.interviewPath.play();
    },
  },
  computed: {
    playingPathId() {
      return this.$store.getters.playingPathId;
    },
    interviews() {
      return this.$store.getters.interviews;
    },
    record() {
      if(this.playingPathId in this.interviews) {
        return this.interviews[this.playingPathId];
      } else {
        return undefined;
      }
    },
    audioFile() {
      try {
        return this.record.fields["Audio File"][0]["url"];
      } catch {
        return "";
      }
    },
  },
  watch: {
    playingPathId: function(newId, oldId) {
      this.playPathById(newId);
    },

  },
};



</script>

<style lang="scss" scoped>

.debug {
  font-size: 0.7em;
  position: fixed;
  bottom: 0px;
  right: 0px;
  border: 2px solid red;
  z-index: 100000;
}

</style>
