<template>
  <div class="nav">
    <div id="nav-home" class="navbutton"  ><router-link :to="{ name: 'Landscape' }">Home</router-link></div>
    <div id="nav-index" class="navbutton" ><router-link :to="{ name: 'Index' }">Index</router-link></div>
    <Transcript />
  </div>
</template>

<script>

import Transcript from "@/components/Transcript.vue";
import "@fontsource/cormorant-garamond/500.css"

export default {
  name: "Nav",
  data() {
    return {};
  },
  components: {
    Transcript,
  },
  computed: {
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



</style>

