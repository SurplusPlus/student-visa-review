<template>
  <div id="index">
    <div class="bureauchief" v-for="(bc, bcid) in interviewsByBureauChief" v-bind:key = "bcid">
      <div class="bc-info">
        <div class="bc-name">{{ bc.fields["Name"] }}</div>
        <div class="bc-location">{{ bc.fields["Location"] }}</div>
      </div>
      <div class="interviews">
        <div class="interview" v-for="interview in bc.interviews" @click="onclick(interview.id)" :key="interview.id" :class="{ playing: playingPathId === audiopathDataFromAirtableId(interview.id).id }" >
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
      var aid = this.audiopathDataFromAirtableId(iid).id
      this.$refs['audioBlob-' + aid][0].onclick();
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
      try {
        return Object.values(this.audiopathData).filter(function(d) {
          return d.airtableid === airtableid;
        })[0];
      } catch {
        return null;
      }
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
  background-color: black;
  color: rgba(245, 245, 245, .7);
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
