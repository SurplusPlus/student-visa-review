<template>
  <div class="soundplayer debug" :class="{ playing : isPlaying }">
   soundplayer debug 
    {{ playingPathId }}
    {{ audioFile }} 

    {{ ambientSrc}} 

  </div>
</template>

<script>
/*  eslint-disable */ 

import {Howl, Howler} from 'howler';

export default {
  name: "SoundPlayer",
  data() {
    return {
      audioHowl: undefined,
      ambientSrc: [require('@/assets/sounds/ambient_crickets.webm' )],
      ambientHowl: undefined,
      isPlaying: false,
      status: "stopped",
      audioFile: "",
    };
  },
  mounted() {
  },
  methods: {
    initAmbientHowl() { 
      this.ambientHowl = new Howl({
        src: this.ambientSrc,
        html5: true,
        autoplay: true,
        loop: true,
      });
      this.ambientHowl.play();
      console.log("playing ambient howl")
    },
    fadeOutAudio() {
      var self = this;
      var fadeoutdur = 1500;
      try { 
        this.audioHowl.fade(1, 0, fadeoutdur);
        setTimeout(function() {
          self.audioHowl.stop();
          self.audioHowl.unload();
        }, fadeoutdur)
      } catch {}
    },
    playPathById(id) {
 
      if(this.audioHowl !== undefined) {
        this.audioHowl.stop();
        this.audioHowl.unload();
      }

      console.log("playpathbyid", id)

      if(this.ambientHowl === undefined) {
        console.log("triggering");
        this.initAmbientHowl();
      } 

      try { 
        let thisdata = this.audiopathData.filter(function(d) {
          return d.id === id
        })[0]

        this.audioFile = thisdata['Audio File'].url; 
        console.log('wooo', this.audioFile);

        this.audioHowl = new Howl({
          src: [this.audioFile],
          autoplay: false,
          loop: false,
        });
        this.audioHowl.play();
      } catch {
      }
    },
  },
  computed: {
    playingPathId() {
      return this.$store.getters.playingPathId;
    },
    nextPlayingPathId() {
      return this.$store.getters.nextPlayingPathId;
    },
    interviews() {
      return this.$store.getters.interviews;
    },
    audiopathData() {
      return this.$store.getters.audiopathData;
    },
  },
  watch: {
    nextPlayingPathId: function(newId, oldId) {
      this.fadeOutAudio();
    },
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
