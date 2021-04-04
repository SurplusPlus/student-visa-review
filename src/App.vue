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



body, html {
  margin: 0px;
  padding: 0px;
}

#app {
  color: #212121;
}


</style>
