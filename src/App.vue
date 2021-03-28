<template>
  <div id="app">
      <router-view name="overlay" />
      <router-view name="underlay" />
  </div>
</template>

<script>


/* eslint-disable */

const process_api_key = process.env.VUE_APP_AIRTABLE_API_KEY;
const airtable_table = process.env.VUE_APP_AIRTABLE_TABLE;
const airtable_base = process.env.VUE_APP_AIRTABLE_BASE;
const airtable_view = process.env.VUE_APP_AIRTABLE_VIEW ;

console.log(process_api_key)

export default {
  name: "App",
  components: {
  },
  data() {
    return {
    };
  },
  created() {
    this.$store.dispatch("fetchData");
  },
  methods: {
  }
};
</script>

<style>



body {
  background: no-repeat center center fixed;
  background-color: #ADCEFF;
}

#app {
  color: #212121;
  margin-top: 60px;
  padding: 1em;
}


</style>
