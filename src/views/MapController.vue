<template>
  <div class="mapcontroller">

    <div id="windowcenter"></div>

    <Map scale="1"></Map>

    <BackgroundSky />

  </div>
</template>

<script>

/*  eslint-disable */ 


import BackgroundSky from "@/components/BackgroundSky.vue";
import Map from "@/components/Map.vue";

export default {
  name: "MapController",
  data() {
    return {
    };
  },
  components: {
    Map,
    BackgroundSky,
  },
  computed: {
    interviews() {
      return this.$store.getters.interviews;
    },
    allFields() {
      try { 
        return Object.keys(this.interviews[0].fields)
      } catch {
        return []
      }
    },
    stateLoaded() {
      return this.$store.getters.hasLoaded;
    },
  },
  methods: {
  },
  mounted() {
  },
};
</script>
<style scoped lang="scss">

.mapcontroller {
  position: fixed;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;

}

#windowcenter {
  width: 10px;
  height: 10px;
  position: fixed;
  top: calc(50% - 5px);
  left: calc(50% - 5px);
  background-color: red;
  z-index: 1000;
}


</style>

