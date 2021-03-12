<template>
  <div id="backgroundsky">
  </div>
</template>

<script>
export default {
  name: "BackgroundSky",
  props: ['id'],
  data() {
    return {
    };
  },
  computed: {
  },
};


</script>

<style scoped>

#backgroundsky {
  z-index: -100;
  pointer-events: none;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;

  background: rgb(191,212,244);
  background: linear-gradient(180deg, rgba(191,212,244,1) 0%, rgba(235,227,220,1) 100%); 
  /* TODO: make this programmatic */
}

</style>
