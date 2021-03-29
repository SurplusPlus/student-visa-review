<template>
  <div id="backgroundsky" class="day">
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

<style scoped lang="scss">

#backgroundsky {
  z-index: -100;
  pointer-events: none;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  /* TODO: make this programmatic */
}

.day {
  background: linear-gradient(180deg, rgba(191,212,244,1) 0%, rgba(235,227,220,1) 100%); 
  transition: background 5s;
}

.night {
  background: linear-gradient(180deg, #3D5D7A 0%, #755454 100%);
  transition: background 5s;
}

// @keyframes sunset {
//   0% { background: linear-gradient(180deg, rgba(191,212,244,1) 0%, rgba(235,227,220,1) 100%);}
//   50% { background: linear-gradient(180deg, #3D5D7A 0%, #755454 100%);}
//   100% {background: linear-gradient(180deg, rgba(191,212,244,1) 0%, rgba(235,227,220,1) 100%); }
// }

</style>
