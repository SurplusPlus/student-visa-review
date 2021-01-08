<template>
  <div class="listener" :style="`top: ${y}px; left: ${x}px;`">
    {{x }} {{y}}
    <slot></slot>
  </div>
</template>

<script>

/*  eslint-disable */ 
import {Howl, Howler} from 'howler';


export default {
  name: "Listener",
  props: ['x', 'y'],
  data() {
    return {
      sound: undefined,
      playnext: false,
      status: "stopped",
    };
  },
  updated() {
    Howler.pos(this.x  / 10, this.y / 10, 0)
  },
  methods: {
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

.listener {
  position: absolute;
  cursor: pointer;

  &.playing {
    background-color: #AFA;
  }

}

</style>

