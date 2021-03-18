<template>
  <div class="indexview">
    <div class="bureauchief" v-for="(bc, bcid) in interviewsByBureauChief" v-bind:key = "bcid">
      <div class="bc-info">
        <div class="bc-name">{{ bc.fields["Name"] }}</div>
        <div class="bc-location">{{ bc.fields["Location"] }}</div>
      </div>
      <div class="interviews">
        <div class="interview" v-for="interview in bc.interviews" :key="interview.id">
          <InterviewBlob :id="interview.id" />
          <div class="interview-name">{{ interview.fields["Name"] }}</div>
        </div>
      </div>
    </div>

    <BackgroundSky />
  </div>
</template>

<script>
import InterviewBlob from "@/components/InterviewBlob.vue";
import BackgroundSky from "@/components/BackgroundSky.vue";

import "@fontsource/space-mono/400.css"

export default {
  name: "ListView",
  data() {
    return {};
  },
  components: {
    InterviewBlob,
    BackgroundSky,
  },
  methods: {
    bureau_chief_of(id) {
      try { return this.people[this.interviews[id].fields["Bureau Chief"]];   } 
      catch { return undefined;  }
    },
    interviewee(id) {
      try { return this.people[this.interviews[id].fields["Interviewee"]];   } 
      catch { return undefined;  }
    },

  },
  computed: {
    people() {
      return this.$store.getters.people;
    },
    interviews() {
      return this.$store.getters.interviews;
    },
    interviewsByBureauChief() {
      return Object.values(this.interviews).reduce((map, obj) => {
        let bc = this.bureau_chief_of(obj.id);
        if(bc && bc.id) {
          if(!(bc.id in map)) { 
            map[bc.id] = this.people[bc.id];
            map[bc.id].interviews = [];
          }
          map[bc.id].interviews.push(obj);
        return map;
        }
      }, {});
    },
    allFields() {
      try { 
        return Object.keys(this.records[0].fields)
      } catch {
        return []
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.indexview {
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
  box-shadow: -1px 1px 0px #5b5b5b, ;
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
  background-color: #F5F5F5;
}


.interview {
  font-size: 0.9em;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: .5px solid #CCC;
  padding: 5px 10px;
  height: 40px;
  transition: background .2s ease;
  transition: color .2s ease;
}

.interview:hover {
  cursor: pointer;
  background: #212121;
  color: #f5f5f5;
 }

.interviewblob {
  width: 30px;
  margin-right: 10px;
}

</style>
