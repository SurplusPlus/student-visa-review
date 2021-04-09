<template>
  <div id="intromessage" v-show="show">
    <transition name="fade" mode="out-in">
      <div id="message" class="message" @click="nextMessageStep" v-if="message != '' && show" v-html="message">
      </div>
    </transition>
  </div>
</template>

<script>
import "@fontsource/space-mono/700.css"

var messages = [
  'Hello.',
  'Please turn up your speakers.',
  'Click to journey.',
  'Runtime 8 minutes to 4 hours.',
  'Welcome to the <i>Student Visa Review</i>.'
  ]

export default {
  name: "About",
  props: ['show'],
  data() {
    return {
      messageCounter: 0,
      message: messages[0],
      ambientPlaying: false,
    };
  },
  components: {
  },
  computed: {
    playedIntro() {
      return this.$store.state.playedIntro;
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
    nextMessageStep() {
      if(!this.ambientPlaying && !this.playedIntro) {
        this.ambientPlaying = true;
        this.$root.$emit('SoundPlayer_playAmbient', 'airport-arrival-hall')
      }

      this.messageCounter += 1;
      if(this.messageCounter < messages.length) {
        this.message = messages[this.messageCounter];
      } else {
        this.message = "";
      }

      if(this.messageCounter == 2) {
        console.log("ZOOMOUT")
        this.$root.$emit('MapController_introZoomOut')
      }

      if(this.messageCounter == 5) {
        console.log("fade ambient audio, fadeout text, fadein blob text, start anim")
        this.$root.$emit('SoundPlayer_fadeOutAmbient',  5000);
        this.$store.commit("setAudioBlobDisplayText", true)
        this.$root.$emit('MapController_introStartJourney');
      }
    },
    startIntro() {
      this.messageCounter= 0;
      this.message= messages[0];
      this.ambientPlaying = false;
      this.$store.commit("setAudioBlobDisplayText", false)
      this.$store.commit("setPlayedIntro", false)

      console.log("STARTINGTINFKDLSAJ");
    },
    exitIntro() {
      this.$root.$emit('SoundPlayer_fadeOutAmbient',  3000);
      this.$store.commit("setAudioBlobDisplayText", true)
    },
  },
  mounted() {
   this.$root.$on('Intro_startIntro', () => {
     this.startIntro();
   })
   this.$root.$on('Intro_introMessage', (msg) => {
     this.message = msg;
   })
  },
  watch: {
    show(newval, oldval) {
      if(oldval && !newval) {
        this.exitIntro();
      }
    },
  }
};
</script>
<style scoped lang="scss">

#intromessage {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  pointer-events: none;
}

.message {
  pointer-events: all;
  cursor: pointer;
  background-color: #f5f5f5;
  padding: 16px 24px;  border-radius: 50px;
  box-shadow: 0px 0px 40px rgba(110, 167, 252, .5), 0px 0px 1.5px #212121;
  mix-blend-mode: hard-light;
  margin: 25px 20px 0 0;
  animation: floating 5s infinite;
  animation-timing-function: ease;
  transition: background-color 2s ease;
  font-size: 2em;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 3s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}


</style>

