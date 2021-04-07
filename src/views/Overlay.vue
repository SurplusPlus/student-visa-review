<template>
  <div class="nav">

    <template v-if="route.name == 'Landscape'">
        <div id="nav-home" class="navbutton"  ><router-link :to="{ name: 'Landscape' }">Home</router-link></div>
        <div id="nav-index" class="navbutton" ><router-link :to="{ name: 'Index' }">Index</router-link></div>

        <transition name="fade">
          <Transcript />
        </transition>
        <Debug />

        <About show="true"/>


    </template>

    <template v-else>
      <div id="indexnav">
        <router-link :to="{ name: 'Landscape' }">
          <div class="buttontext returnbutton">Return</div>
          <!-- <img class="returnbutton" src="@/assets/return.svg"/> -->
        </router-link>
      </div>
    </template>

    <SoundPlayer />

  </div>
</template>

<script>

import Transcript from "@/components/Transcript.vue";
import About from "@/components/About.vue";
import Debug from "@/components/Debug.vue";
import SoundPlayer from "@/components/SoundPlayer.vue";
import "@fontsource/cormorant-garamond/500.css"
import "@fontsource/space-mono/400.css"


export default {
  name: "Overlay",
  data() {
    return {};
  },
  components: {
    Debug,
    About,
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
  z-index: 100000;
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
  z-index: 100000;
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
  padding: 25px;
  border-radius: 50px;
  box-shadow: -2px 6px 40px rgba(245, 245, 245, .8), 0px 0px 1.5px #212121;
  mix-blend-mode: hard-light;
  margin: 25px 0 0 20px;
  animation: floating 5s infinite;
  animation-timing-function: ease;
}

#nav-index {
  right: 0px;
  top: 0px;
  background-color: #f5f5f5;
  padding: 25px;
  border-radius: 50px;
  box-shadow: -2px 6px 40px rgba(245, 245, 245, .8), 0px 0px 1.5px #212121;
  mix-blend-mode: hard-light;
  margin: 25px 20px 0 0;
  animation: floating 5s infinite;
  animation-timing-function: ease;
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
  color: #212121;
  background: #f5f5f5;
  padding: 25px;
  border-radius: 50px;
  box-shadow: -2px 6px 40px rgba(245, 245, 245, .8), 0px 0px 1.5px #212121;
  mix-blend-mode: hard-light;
  font-size: 1.3em;
  margin: 25px 0 0 20px;
  transition: background-color 2s ease;
  animation: floating 5s infinite;
  animation-timing-function: ease;
}

.returnbutton:hover {
    background-color: rgba(235, 227, 220, .8);
}


@keyframes floating {
  0%   {transform: translatey(-8px);}
  50%  {transform: translatey(0px);}
  100% {transform: translatey(-8px);}
}

// .buttontext {
//   position: absolute;
//   top: 30px;
//   left: 30px;
//   color: black;
//   font-size: 1.3em;
//   z-index: 10001;
// }


.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

</style>

