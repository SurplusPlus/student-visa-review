<template>
  <div class="soundplayer" :class="{ playing : isPlaying }">
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
      audioSeekTimer: null,
      ambientSrc: {
        'ambient_crickets': require('@/assets/sounds/ambient_crickets.webm'),
        'airport-arrival-hall': require('@/assets/sounds/airport-arrival-hall.mp3'),
        'bing-bong-chime': require('@/assets/sounds/bing-bong-chime.mp3'),
        'ambient-wave-59': require('@/assets/sounds/ambient-wave-59.mp3'),
      },
      ambientHowl: undefined,
      isPlaying: false,
      audioFile: "",
    };
  },
  mounted() {
    var self = this;
    this.$root.$on('SoundPlayer_fadeOut', () => {
      self.fadeOutAudio();
    });
    this.$root.$on('SoundPlayer_playAmbient', (id) => {
      console.log(id)
      self.playAmbient(id);
    });
    this.$root.$on('SoundPlayer_fadeOutAmbient', (dur) => {
      self.fadeOutAmbient(dur, function() {
      })
    });
  },
  methods: {
    playAmbient(id) { 
      var fadeindur = 3000;
      console.log(this.ambientSrc[id]);
      this.ambientHowl = new Howl({
        src: [this.ambientSrc[id]],
        html5: true,
        autoplay: true,
        loop: true,
      });
      this.ambientHowl.fade(0, 1, fadeindur)
      this.ambientHowl.play();
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
    fadeToAmbient(from, to, fadeoutdur) {
      var self = this;
      try { 
        this.ambientHowl.fade(from, to, fadeoutdur);
        setTimeout(function() {
        }, fadeoutdur)
      } catch {}
    },

    fadeOutAmbient(fadeoutdur, callback) {
      var self = this;
      try { 
        this.ambientHowl.fade(1, 0, fadeoutdur);
        setTimeout(function() {
          self.ambientHowl.stop();
          self.ambientHowl.unload();
          callback();
        }, fadeoutdur)
      } catch {}
    },
    setPlayingPathDuration(dur) {
      this.$store.commit("setPlayingPathDuration", dur);
    },
    playPathById(id) {
      var self = this;
 
      if(this.audioHowl !== undefined) {
        this.audioHowl.stop();
        this.audioHowl.unload();
      }

      if(this.ambientHowl === undefined) {
//        this.initAmbientHowl();
      } 

      try { 
        let thisdata = this.audiopathData[id]

        this.audioFile = thisdata['Audio File'].url; 

        this.audioHowl = new Howl({
          src: [this.audioFile],
          html5: true,
          autoplay: false,
          loop: false,
          onload: function() {
            self.setPlayingPathDuration(self.audioHowl.duration())
            console.log(self.audioHowl.duration())
          },
          onplay: function() {
            self.startUpdateSeek();
            self.$store.commit("setStatus", "playing");
          },
          onstop: function() {
            self.stopUpdateSeek();
            self.$store.commit("setStatus", "stopped");
          },
          onpause: function() {
            self.stopUpdateSeek();
            self.stopUpdateSeek();
          },
        });

        this.audioHowl.play();
      } catch {
      }
    },
    startUpdateSeek() {
      var self = this;
      this.audioSeekTimer = setInterval(function() {
        self.updateSeek();
      }, 1000);
    },
    stopUpdateSeek() {
      clearInterval(this.audioSeekTimer);
    },
    updateSeek(callback) {
      try {
        this.$store.commit("setAudioSeek", this.audioHowl.seek())
      } catch {
        console.log("can't setAudioSeek");
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
    playedIntro() {
      return this.$store.state.playedIntro;
    },
    status() {
      return this.$store.state.status;
    },
  },
  watch: {
    nextPlayingPathId: function(newId, oldId) {
      this.fadeOutAudio();
    },
    playingPathId: function(newId, oldId) {
      this.playPathById(newId);
    },
    playedIntro(newval, oldval) {
      if(newval == true && oldval == false) {
        this.fadeOutAudio();
      }
    },
    status(newval, oldval) {
      if(newval == "paused" && oldval == "playing") {
        this.audioHowl.pause();
      }
      if(newval == "playing" && oldval == "paused") {
        this.audioHowl.play();
      }
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
