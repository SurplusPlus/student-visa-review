<template>
  <div id="backgroundsky" :class="sky">
    <div id="daybg" class="bgsky"></div>
    <div id="nightbg" class="bgsky"></div>
    <div id="sunsetbg" class="bgsky"></div>
    <div id="sunrisebg" class="bgsky"></div>
  </div>
</template>

<script>
export default {
  name: "BackgroundSky",
  props: ['id'],
  data() {
    return {
      skyIndex: 0,
      skies: ['night', 'sunrise', 'day', 'sunset' ],
    };
  },
  computed: {
    sky() {
      return this.$store.state.sky;
    },
  },
  methods: {
    skyChange() {
      this.skyIndex = (this.skyIndex + 1) % this.skies.length;
      var currentSky = this.skies[this.skyIndex];
      console.log(currentSky);
      this.$store.commit("setSky", currentSky)
    },
  },
  mounted() {
   this.$root.$on('BackgroundSky_skyChange', () => {
     console.log("change sky");
     this.skyChange()
   })
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

#sunsetbg {
  z-index: 3;
  background: linear-gradient(180deg, #5891FF 0%, #FF8179 100%);
  opacity: 1;
}

#sunrisebg {
  z-index: 4;
  background: linear-gradient(180deg, #8AD5FF 0%, #FFEE96 100%);
  opacity: 1;
}

#backgroundsky.day {
  & #daybg { opacity: 1; }
  & #nightbg { opacity: 0; }
  & #sunsetbg { opacity: 0; }
  & #sunrisebg { opacity: 0; }
}

#backgroundsky.night {
  & #daybg { opacity: 0; }
  & #nightbg { opacity: 1; }
  & #sunsetbg { opacity: 0; }
  & #sunrisebg { opacity: 0; }
}

#backgroundsky.sunset {
  & #daybg { opacity: 0; }
  & #nightbg { opacity: 0; }
  & #sunsetbg { opacity: 1; }
  & #sunrisebg { opacity: 0; }
}

#backgroundsky.sunrise {
  & #daybg { opacity: 0; }
  & #nightbg { opacity: 0; }
  & #sunsetbg { opacity: 0; }
  & #sunrisebg { opacity: 1; }
}




// @keyframes sunset {
//   0% { background: linear-gradient(180deg, rgba(191,212,244,1) 0%, rgba(235,227,220,1) 100%);}
//   50% { background: linear-gradient(180deg, #3D5D7A 0%, #755454 100%);}
//   100% {background: linear-gradient(180deg, rgba(191,212,244,1) 0%, rgba(235,227,220,1) 100%); }
// }

</style>
