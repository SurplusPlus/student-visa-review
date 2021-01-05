<template>
  <div class="about">

    <div class="entries">
      <div class="entry" v-for="record in records" v-bind:key="record.id">
        <InterviewBlob :id="record.id" >
          <InterviewPlayer :id="record.id" />
        </InterviewBlob>
      </div>
    </div>

  </div>
</template>

<script>

import InterviewBlob from "@/components/InterviewBlob.vue";
import InterviewPlayer from "@/components/InterviewPlayer.vue";

export default {
  name: "About",
  data() {
    return {};
  },
  components: {
    InterviewBlob,
    InterviewPlayer,
  },
  computed: {
    records() {
      return this.$store.state.records;
    },
    allFields() {
      try { 
        return Object.keys(this.records[0].fields)
      } catch {
        return []
      }
    },
  },
  methods: {
  }
};
</script>
<style scoped lang="scss">
.about {
  display: flex;
  min-height: 100vh;
  align-items: stretch;
  flex-direction: row;
  margin: 10vh 10vw;
}

</style>

