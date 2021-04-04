<template>
  <div id="backgroundsky" :class="sky">
    <div id="daybg" class="bgsky"></div>
    <div id="nightbg" class="bgsky"></div>
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
    sky() {
      return this.$store.state.sky;
    },
  },
};


</script>

<style scoped lang="scss">

#backgroundsky {
  z-index: -100;
  pointer-events: none;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: hidden;
}

.bgsky {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  transition: opacity 10s ease-in-out; 
}


#daybg {
  background: linear-gradient(180deg, rgba(191,212,244,1) 0%, rgba(235,227,220,1) 100%); 
  z-index: 1;
}

#nightbg {
  z-index: 2;
  background: linear-gradient(180deg, #3D5D7A 0%, #755454 100%);
  opacity: 1;
}

#backgroundsky.night #nightbg {
  opacity: 1;
}
#backgroundsky.day #nightbg{
  opacity: 0;
}


// @keyframes sunset {
//   0% { background: linear-gradient(180deg, rgba(191,212,244,1) 0%, rgba(235,227,220,1) 100%);}
//   50% { background: linear-gradient(180deg, #3D5D7A 0%, #755454 100%);}
//   100% {background: linear-gradient(180deg, rgba(191,212,244,1) 0%, rgba(235,227,220,1) 100%); }
// }

</style>
