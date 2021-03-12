<template>
  <div class="soundpoint" :class="{ playing : isPlaying }" v-if="audioFile" @click="click">
    <slot></slot>
  </div>
</template>

<script>

import {Howl, Howler} from 'howler';


export default {
  name: "SoundPoint",
  props: ['id'],
  data() {
    return {
      sound: undefined,
      playnext: false,
      status: "stopped",
    };
  },
  mounted() {
    this.initAudio();
  },
  methods: {
    initAudio() {
      if(this.sound) { return; }
      this.sound = new Howl({
        src: this.audioFile,
        pos: [this.record.fields["x"] / 10, this.record.fields["y"] / 10, 0],
        html5: true,
        autoplay: false,
        loop: true,
      });
    },
    click() {
      console.log("so you clicked on me", this.audioFile)
      if(this.isPlaying) {
        this.sound.pause();
        Howler.stop() 
      } else {
        this.sound.play();
      }
    },
  },
  computed: {
    isPlaying() {
      try { 
        return this.sound.playing();
      } catch {
        return false;
      }
    },
    seekpos() {
      try { 
        return this.sound.seek();
      } catch {
        return 0;
      }
    },
    interviews() {
      return this.$store.getters.interviews;
    },
    people() {
      return this.$store.getters.people;
    },
    bureau_chief() {
      try { return this.people[this.record.fields["Bureau Chief"]];   } 
      catch { return undefined;  }
    },
    interviewee() {
      try { return this.people[this.record.fields["Interviewee"]];   } 
      catch { return undefined;  }
    },
    record() {
      if(this.id in this.interviews) {
        return this.interviews[this.id];
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
};



</script>

<style lang="scss" scoped>

.soundpoint {
  cursor: pointer;

  &.playing {
    background-color: #AFA;
  }
}

</style>
