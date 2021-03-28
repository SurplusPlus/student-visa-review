<template>
  <div class="soundplayer debug" :class="{ playing : isPlaying }">
    hello
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
      isPlaying: false,
      status: "stopped",
    };
  },
  mounted() {
//    this.initAudio();
  },
  methods: {
    playInterviewById(id) {
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
    /*click() {
      console.log("so you clicked on me", this.audioFile)
      if(this.isPlaying) {
        this.sound.pause();
        Howler.stop() 
      } else {
        this.sound.play();
      }
    },*/
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
  position: fixed;
  top: 30px;
  left: 30px;
  border: 2px solid red;
  z-index: 100000;
}

</style>
