<template>
  <div class="nav">

    <template v-if="route.name == 'Landscape'">
      <div id="nav-home" class="navbutton"  ><router-link :to="{ name: 'Landscape' }">Home</router-link></div>
      <div id="nav-index" class="navbutton" ><router-link :to="{ name: 'Index' }">Index</router-link></div>

      <SoundPlayer />
      <Transcript />
    </template>

    <template v-else>
      <div id="indexnav">
        <router-link class="returnbutton" :to="{ name: 'Landscape' }">
          <div class="buttontext">Return</div>
          <img class="returnbutton" src="@/assets/return.svg"/>
        </router-link>
      </div>
    </template>

  </div>
</template>

<script>

import Transcript from "@/components/Transcript.vue";
import SoundPlayer from "@/components/SoundPlayer.vue";
import "@fontsource/cormorant-garamond/500.css"
import "@fontsource/space-mono/400.css"


export default {
  name: "Overlay",
  data() {
    return {};
  },
  components: {
    Transcript,
    SoundPlayer,
  },
  computed: {
    route() {
      return this.$store.state.route;
    }
  },
  methods: {
  }
};
</script>
<style scoped lang="scss">


.nav {
  pointer-events: none;
  font-family: 'Space Mono', serif;
  position: fixed;
  z-index: 1000;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  
}

.nav > * {
  pointer-events: all;
}

.navbutton {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: fixed;
  z-index: 1000;
  font-size: 1.3em;
}

a {
  color: black;
  text-decoration: none;
}

#nav-home {
  left: 0px;
  top: 0px;
  background-color: #f5f5f5;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  box-shadow: -2px 6px 40px #F5f5f5;
  mix-blend-mode: hard-light;
}

#nav-index {
  right: 0px;
  top: 0px;
  background-color: #f5f5f5;
  width: 100px;
  height: 100px;
  border-radius: 50px;
  box-shadow: -2px 6px 40px #f5f5f5;
  mix-blend-mode: hard-light;
}


#indexnav {
  pointer-events: none;
  font-family: 'Space Mono', serif;
  position: fixed;
  z-index: 1000;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
}

#indexnav > * {
  pointer-events: all;
}

.returnbutton {
  display: inline-block;
  position: relative;
  text-align: center;
  color: black;
}


.buttontext {
  position: absolute;
  top: 30px;
  left: 30px;
  color: black;
  font-size: 1.3em;
  z-index: 10001;
}

</style>

