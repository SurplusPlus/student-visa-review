<template>
  <div class="landscape" @mousemove="mousemove">
    hey a test

    <object type="image/svg+xml" :data="mapsvg" />


  </div>
</template>

<script>

/*  eslint-disable */ 


export default {
  name: "TestView",
  data() {
    return {
      mapsvg: require('@/assets/map.svg'),
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
};
</script>
<style scoped lang="scss">
</style>

