<template>
  <div class="interviewplayer" :class="{ playing : isPlaying }" v-if="audioFile" @click="click">
    <div v-if="isPlaying">⏹️</div>
    <div v-else>▶️</div>
    <div>Date: {{ record.fields["Date of Interview"] }}</div>
    <div v-if="bureau_chief">Bureau Chief: {{ bureau_chief.fields["Name"] }}</div>
    <div v-if="interviewee">Interviewee: {{ interviewee.fields["Name"] }}</div>
    <div>Duration: {{ record.fields["Duration"] }}</div>
    <slot></slot>
  </div>
</template>

<script>

import {Howl, Howler} from 'howler';


export default {
  name: "InterviewPlayer",
  props: ['id'],
  data() {
    return {
      sound: undefined,
    };
  },
  mounted() {
    this.initAudio();
  },
  methods: {
    initAudio() {
      this.sound = new Howl({
        src: this.audioFile
      });
    },
    click() {
      console.log("so you clicked on me", this.audioFile)
      if(this.isPlaying) {
        this.sound.pause();
      } else {
        Howler.stop()
        this.sound.play();
      }
      console.log(this.$el)
      console.log(this.$el.top)
      console.log(this.$el.getBoundingClientRect().left)
      console.log(this.$el.getBoundingClientRect().top)
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

.interviewplayer {
  padding: 20px;
  background-color: #AFF;
  border-radius: 30px;
  cursor: pointer;

  &.playing {
    background-color: #AFA;
  }
}

</style>
