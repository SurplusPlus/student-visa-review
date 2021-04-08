<template>
  <div id="index">
    <div class="bureauchief" v-for="(bc, bcid) in interviewsByBureauChief" v-bind:key = "bcid">
      <div class="bc-info">
        <div class="bc-name">{{ bc.fields["Name"] }}</div>
        <div class="bc-location">{{ bc.fields["Location"] }}</div>
      </div>
      <div class="interviews">
        <div class="interview" v-for="interview in validAudiopaths(bc.interviews)" @click="onclick(interview.id)" :key="interview.id"  :class="interviewClass(interview.id)" >
          <div class="interview-icon">

            <AudioBlob :id="audiopathDataFromAirtableId(interview.id).id" 
            :ref="'audioBlob-' + audiopathDataFromAirtableId(interview.id).id" viewmode="indexview" />
          </div>
          <div class="interview-name">{{ interview.fields["Name"] }}</div>
        </div>
      </div>
    </div>

    <BackgroundSky />
  </div>
</template>

<script>
/*  eslint-disable */ 
import AudioBlob from "@/components/AudioBlob.vue";
import BackgroundSky from "@/components/BackgroundSky.vue";

import "@fontsource/space-mono/400.css"

export default {
  name: "ListView",
  data() {
    return {};
  },
  components: {
    AudioBlob,
    BackgroundSky,
  },
  methods: {
    onclick(iid) {
      try {
        var aid = this.audiopathDataFromAirtableId(iid).id
        this.$refs['audioBlob-' + aid][0].onclick();
      } catch { }
    },
    bureau_chief_of(id) {
      try { return this.people[this.interviews[id].fields["Bureau Chief"]];   } 
      catch { return undefined;  }
    },
    interviewee(id) {
      try { return this.people[this.interviews[id].fields["Interviewee"]];   } 
      catch { return undefined;  }
    },
    audiopathDataFromAirtableId(airtableid) {
        console.log("looking for", airtableid);
      try {
        return Object.values(this.audiopathData).filter(function(d) {
          return d.airtableid === airtableid;
        })[0];
      } catch {
        console.log("nope, doesn't exist");
        return null;
      }
    },
    interviewClass(iid) {
      try {
        return { 
          playing: this.playingPathId === this.audiopathDataFromAirtableId(iid).id, 
          nextPlaying: this.nextPlayingPathId === this.audiopathDataFromAirtableId(iid).id && this.playingPathId !== this.audiopathDataFromAirtableId(iid).id, 
        }
      } catch {
        return {};
      }
    },
    validAudiopaths(data) {
      var self = this;
      return data.filter(function(interview) {
        try { return interview.fields['SVGID'] in self.audiopathData; }
        catch { return false; }
      });
    }

  },
  computed: {
    people() {
      return this.$store.getters.people;
    },
    interviews() {
      return this.$store.getters.interviews;
    },
    interviewsByBureauChief() {
      return this.$store.getters.interviewsByBureauChief;
    },
    audiopathData() {
      return this.$store.getters.audiopathData;
    },
    allFields() {
      try { 
        return Object.keys(this.records[0].fields)
      } catch {
        return []
      }
    },
    playingPathId() {
      return this.$store.getters.playingPathId;
    },
    nextPlayingPathId() {
      return this.$store.getters.nextPlayingPathId;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

#index {
  z-index: 2000;
  font-family: 'Space Mono', serif;
  position: absolute;
  right: 0px;
  top: 0px;
  width: 75vw;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.bureauchief {
  width: 325px;    
  box-shadow: -.5px .5px 0px #212121;
  background: rgba(201, 215, 239, .3);
}

.bc-info {
  padding: 20px;
  height: 80px; 
}


.bc-name {
  font-size: 1.3em;
  margin-bottom: 5px;
}

.bc-location {
  font-size: 0.85em;
  opacity: 0.9;
}

.interviews {
  color: #5B5B5B;
  background-color: rgba(245, 245, 245, .7);
}


.interview {
  font-size: 0.9em;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: .5px solid rgb(172, 172, 172);
  padding: 5px 10px;
  height: 40px;
  transition: background .2s ease;
  transition: color .2s ease;
}

.interview:hover {
  cursor: pointer;
  background-color: rgba(235, 227, 220, .8);
}

.interview.playing {
  background-color: rgba(110, 167, 252, .5);
  color: #212121;
}

.interview.nextPlaying {
   color: #212121;
    animation-name: nextPlayingAnimation;
    animation-duration: 1s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;    
}

@keyframes nextPlayingAnimation {
    0%     { background-color:rgba(110, 167, 252, .1); }
    50.0%  { background-color:rgba(110, 167, 252, .5); }
    100.0%  { background-color:rgba(110, 165, 252, .1); }
}

.interviewblob {
  width: 30px;
  margin-right: 10px;
}

.interview-icon {
  flex-shrink: 0;
  width: 50px;
}

</style>
