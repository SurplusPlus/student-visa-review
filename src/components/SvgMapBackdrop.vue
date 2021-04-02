<template>
  <div id="svgmapwrapper">
    <object id="mapsvg" type="image/svg+xml" :data="mapsvg" @load="svgloaded=true"/>
  </div>
</template>

<script>

/*  eslint-disable */ 


export default {
  name: "Map",
  data() {
    return {
      mapsvg: require('@/assets/map/working/pathmap.svg'),
    };
  },
  components: {
  },
  computed: {
  },
  methods: {
  },
  mounted() {
  },
  created() {
  },
  updated() {
  },
  watch: {
  },


};


</script>
<style scoped lang="scss">


#svgmapwrapper {
  z-index: 10;
  width: 5000px;
  height: 5000px;
}

#mapsvg:hover {
}


</style>

