<template>
  <div class="nav">

    <template v-if="route.name == 'Landscape'">
      <div id="nav-home" class="navbutton"  ><router-link :to="{ name: 'Landscape' }">Home</router-link></div>
      <div id="nav-index" class="navbutton" ><router-link :to="{ name: 'Index' }">Index</router-link></div>

      <Transcript />
    </template>

    <template v-else>
      <div id="indexnav">
        <router-link class="returnbutton" :to="{ name: 'Landscape' }">
          <div class="buttontext">Return</div>
          <img src="@/assets/return.svg"/>
        </router-link>
      </div>
    </template>

  </div>
</template>

<script>

import Transcript from "@/components/Transcript.vue";
import "@fontsource/cormorant-garamond/500.css"
import "@fontsource/space-mono/400.css"

export default {
  name: "Overlay",
  data() {
    return {};
  },
  components: {
    Transcript,
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
  font-family: 'Cormorant Garamond', serif;
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
  font-size: 1.5em;
}

a {
  color: black;
  text-decoration: none;
}

#nav-home {
  left: 0px;
  top: 0px;
  background-color: #EBE3DC;
  width: 100px;
  height: 100px;
  border-radius: 50px;
}

#nav-index {
  right: 0px;
  top: 0px;
  background-color: #EBE3DC;
  width: 100px;
  height: 100px;
  border-radius: 50px;
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
}

.buttontext {
  position: absolute;
  top: 30px;
  left: 30px;
  color: black;
  font-size: 1.5em;
}

</style>

