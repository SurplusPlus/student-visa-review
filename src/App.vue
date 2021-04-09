<template>
  <div id="app">
      <router-view name="overlay" />
      <transition name="fade">
        <router-view name="index" />
      </transition>
      <router-view name="map" />
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
  metaInfo: {
    title: 'Student Visa Review',
    meta: [
      { charset: 'utf-8' },
    ]
  },
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



.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>
