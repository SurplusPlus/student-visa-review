<template>
  <div id="svgmapwrapper">
    <object id="texturesvg" type="image/svg+xml" :data="texturesvg" @load="svgloaded=true"/>
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
      texturesvg: require('@/assets/map/background_texture.svg'),
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
  display: none;
  z-index: 10;
  width: 5000px;
  height: 5000px;
  position: absolute;
}

#svgmapwrapper object {
  position: absolute;
  top: 0px;
  left: 0px;
}

#mapsvg:hover {
}


</style>

