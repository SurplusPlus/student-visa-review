<template>
  <div class="interviewplayer" v-if="audioFile" @click="click">
    <div v-if="playing">⏹️</div>
    <div v-else>▶️</div>
    <div>{{ seekpos }} </div>
    <div>{{ record.fields["Date of Interview"] }}</div>
    <div>{{ record.fields["Interviewee"] }}</div>
    <div>{{ record.fields["Bureau Chief"] }}</div>
    <div>{{ record.fields["Duration"] }}</div>
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
      if(this.playing) {
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
    playing() {
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
    records() {
      return this.$store.state.records;
    },
    record() {
      try {
        return this.records.filter(r => { return r.id == this.id })[0];
      } catch {
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

<style scoped>

.interviewplayer {
  background-color: red;
  cursor: pointer;
}

</style>
