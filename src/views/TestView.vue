<template>
  <div class="landscape">
    hey a test

    {{ mapsvg }} 
    <object type="image/svg+xml" :data="mapsvg" />


  </div>
</template>

<script>

/*  eslint-disable */ 



export default {
  name: "TestView",
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
    parse: function() {

    },
  },
  mounted() {
    this.parse();
  },
};
</script>
<style scoped lang="scss">
</style>

