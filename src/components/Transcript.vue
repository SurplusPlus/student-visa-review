<template>
  <div id="transcript">
    <div class="upperborder">
      <img src="@/assets/interface/transcript_upperborder.svg" style="width: 25vw"/>
    </div>
    <div class="content">
      <div class="header">Transcript</div>
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
    playingInterviewId() {
      return this.$store.getters.playingInterviewId;
    },
    playingRecord() {
      if(this.playingInterviewId in this.interviews) {
        return this.interviews[this.playingInterviewId];
      } else {
        return undefined;
      }
    },
    transcript() {
      try { 
        return this.playingRecord.fields['Transcript'];
      } catch {
        return "";
      }
    },
    processedTranscript() {
      if(this.transcript === "") { return []; }
        var turns = this.transcript.split(/(?=\[.*\])/)
        turns = turns.map(function(x) { 
            var res = x.trim().split(/\[(.*)\]/).slice(1); 
            
            var phrases = res[1].trim().split(/(?=\(\d*:\d*\))/).map(function(p) {
              console.log("p", p);
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
  width: 25vw;
  max-height: 400px;
}

.upperborder {
  width: 25vw;
}


.content {
  overflow: auto;
  margin-top: -10px;
  padding: 20px;
  background-color: #f5f5f5;
  font-size: .9em;
}

.person {
  font-weight: 700;
}

.time {
  opacity: 0.5;
  font-size: 0.8em;
  display: block;
}

.header {
  font-weight: 700;
  font-size: 1.3em;
  padding-bottom: 20px;
}

.title {
  font-style: italic;
  color: #5b5b5b;
}

.date {
  font-style: italic;
  color: #5b5b5b;
}

</style>

