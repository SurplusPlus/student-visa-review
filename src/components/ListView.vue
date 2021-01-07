<template>
  <div class="hello">
    <div class="bc-list" v-for="(bc, bcid) in interviewsByBureauChief" v-bind:key = "bcid">
      <div class="bc-name">{{ bc.fields["Name"] }}</div>
      <div class="interview" v-for="interview in bc.interviews" :key="interview.id">
        <InterviewBlob :id="interview.id" />
        <div class="interview-name">{{ interview.fields["Name"] }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import InterviewBlob from "@/components/InterviewBlob.vue";

export default {
  name: "ListView",
  data() {
    return {};
  },
  components: {
    InterviewBlob,
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


.bc-name {
  font-size: 2em;
}

.interview {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.interviewblob {
  width: 50px;
}

</style>
