<template>
  <div id="mapcontroller">

    <div id="windowcenter"></div>

    <AudioPath v-for="d in audiopathData" :key="d.id" :id="d.id"></AudioPath>

    <!--    <Map scale="1"></Map> -->
    <SvgMapBackdrop scale="1"></SvgMapBackdrop>

    <BackgroundSky class="fixed" />

  </div>
</template>

<script>

/*  eslint-disable */ 


import BackgroundSky from "@/components/BackgroundSky.vue";
import Map from "@/components/Map.vue";
import AudioPath from "@/components/AudioPath.vue";
import SvgMapBackdrop from "@/components/SvgMapBackdrop.vue";


export default {
  name: "MapController",
  data() {
    return {
    };
  },
  components: {
    Map,
    AudioPath,
    SvgMapBackdrop,
    BackgroundSky,
  },
  computed: {
    interviews() {
      return this.$store.getters.interviews;
    },
    audiopathData() {
      return this.$store.getters.audiopathData;
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
#mapcontroller {
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
}

#mapcontroller > * {
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
}

.fixed {
  position: fixed !important;
}




#windowcenter {
  width: 6px;
  height: 6px;
  position: fixed;
  top: calc(50% - 3px);
  left: calc(50% - 3px);
  background-color: red;
  border-radius: 5px;
  z-index: 1000;
}


</style>

