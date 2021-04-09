<template>
  <div id="transcript" :class="status">
    <div class="content">
      <div class="header">Transcript</div>

      <template v-if="status=='playing'">
        <span class="play play-status"><img class="icon" src="@/assets/interface/volume_up.svg"/>PLAYING</span>
      </template>
      <template v-if="status=='stopped'">
        <span class="stop play-status"><img class="icon" src="@/assets/interface/volume_off.svg"/>STOPPED</span>
      </template>

      <div class="transcript">
        <div v-for="(turn, idx) in processedTranscript" :key="idx"> 
          <span class="person">{{ turn.name }}:</span>
          <p v-for="phrase in turn.phrases" :key="phrase.time">
            <span class="time">{{ phrase.time }}</span> {{ phrase.text }} 
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@fontsource/cormorant-garamond/500.css"
import "@fontsource/space-mono/700.css"


export default {
  name: "Transcript",
  data() {
    return {};
  },
  components: {
  },
  computed: {
    interviews() {
      return this.$store.getters.interviews;
    },
    playingPathId() {
      return this.$store.getters.playingPathId;
    },
    audiopathData() {
      return this.$store.getters.audiopathData;
    },
    status() {
      return this.$store.state.status;
    },
    transcript() {
      try { 
        return this.audiopathData[this.playingPathId]['Transcript'];
      } catch {
        return "";
      }
    },
    processedTranscript() {
      try {

        var turns = this.transcript.trim().split(/(?=\[.*\])/)
        turns = turns.map(function(x) { 
            var res = x.trim().split(/\[(.*)\]/).slice(1); 
            
            var phrases = res[1].trim().split(/(?=\(\d*:\d*\))/).map(function(p) {
              try {
                var newp = p.split(/\((\d*:\d*)\)/).slice(1);
                return { time: newp[0].trim(), text: newp[1].trim() }
              } catch {
                // newp might be badly formatted.. failback to just displaying text 
                return { time: null, text: p };
              }

            })

            return { name: res[0], phrases: phrases}; 
        })
        return turns;
      } catch { 
        return []; 
      }
    },
  },
  methods: {
  }
};
</script>
<style scoped lang="scss">


#transcript {
  font-family: 'Space Mono', serif;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 1000;
  bottom: 0px;
  left: 0px;
  width: 28vw;
  max-height: 60vh;
}

.content {
  overflow: auto;
  margin-top: -10px;
  padding: 35px;
  background-color: #f5f5f5;
  font-size: .8em;
  box-shadow: -2px 6px 40px rgba(245, 245, 245, .8), 0px 0px 1.5px #212121;
  mix-blend-mode: hard-light;
  border-radius: 50px 50px 0 0;
  line-height: 200%;
  margin: 0 0 0 20px;
  scrollbar-width: none;
}

.content::-webkit-scrollbar {
  display: none;
}



.person {
  display: block;
  margin-top: 25px;
  font-weight: 700;
}

.time {
  opacity: 0.5;
  font-size: 0.8em;
  display: block;
}

.header {
  font-weight: 400;
  font-size: 1.3em;
  padding-bottom: 20px;
  font-family: 'Space Mono', serif;

}

.title {
  font-style: italic;
  color: #5b5b5b;
}

.date {
  font-style: italic;
  color: #5b5b5b;
}

.icon {
  display: inline;
  vertical-align: middle;
  margin-right: 8px;
  width: 16px;
}

.play-status {
 padding: 8px 16px 8px 12px;
 border-radius: 20px;
 display: inline;
 font-size: .825em;
}

.stop {
  box-shadow: 0px 0px 1.5px #212121;
  color: rgba(91, 91, 91, .8);
  margin-bottom: 20px;
}

.play {
  color: #212121; 
  box-shadow: 0px 0px 20px rgba(110, 167, 252, .5), 0px 0px 1.5px #212121;
}

</style>

