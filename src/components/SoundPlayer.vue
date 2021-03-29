<template>
  <div class="soundplayer debug" :class="{ playing : isPlaying }">
   soundplayer debug 
    {{ playingInterviewId }}
    {{ audioFile }} 

  </div>
</template>

<script>
/*  eslint-disable */ 

import {Howl, Howler} from 'howler';

export default {
  name: "SoundPlayer",
  data() {
    return {
      interviewSound: undefined,
      ambientSound: undefined,
      isPlaying: false,
      status: "stopped",
    };
  },
  mounted() {
  },
  methods: {
    initAmbientSound() { // TODO : currently not working 
      this.ambientSound = new Howl({
        src: [ '@/assets/ambient_crickets.webm' ],
        html5: true,
        autoplay: true,
        loop: true,
      });
      this.ambientSound.play();
      window.as = this.ambientSound;
    },
    playInterviewById(id) {

      if(this.ambientSound === undefined) {
        console.log("triggering");
        this.initAmbientSound();
      }

      console.log('wooo', this.audioFile);
      try { 
        this.interviewSound.stop();
        this.interviewSound.unload();
      } catch {}
      this.interviewSound = new Howl({
        src: [this.audioFile],
        autoplay: false,
        loop: false,
      });
      this.interviewSound.play();
    },
  },
  computed: {
    playingInterviewId() {
      return this.$store.getters.playingInterviewId;
    },
    interviews() {
      return this.$store.getters.interviews;
    },
    record() {
      if(this.playingInterviewId in this.interviews) {
        return this.interviews[this.playingInterviewId];
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
    playingInterviewId: function(newId, oldId) {
      this.playInterviewById(newId);
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
