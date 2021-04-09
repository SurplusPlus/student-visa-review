<template>
  <transition name="fade">
    <div id="aboutwrapper" v-if="show">
      <div id="aboutbackdrop" @click="close"></div>
      <div id="about" >

        <h3>The Student Visa Review</h3><p> was co-curated by <b>Jess Myers</b> (Assistant Professor, RISD) and <b>Lev Bratishenko</b> (Curator Public, CCA), </p><p>with SURPLUS+ <br />(<b>Shea Fitzpatrick</b>, <b>Lucy Liu</b>, and <b>Dan Taeyoung</b>) </p><p>and produced by RISD graduate assistants <b>Michael Garel-Martorana</b>, <b>Sanjana Govind Masurkar</b>, and <b>Remi (Wenyue) Qiu.</b></p>

        <p>The Bureau Chiefs: <br />
        <b>Abena Acheampong Danquah</b> (Ghana),<br />
        <b>Anastasia Fedotova</b> (Russia), <br />
        <b>Amber Han</b> (China), <br />
        <b>Oromia Jula </b>(Ethiopia), <br />
        <b>Brad Lei </b>(China), <br />
        <b>Mackenzie Luke</b> (Barbados), <br />
        <b>Minho Kwon</b> (Korea), and <br />
        <b>Kaijie (Kevin) Huang</b> (China).</p>

    <div class="logos">
        <img class="logo" src="@/assets/logos/risd.png"/>
        <img class="logo" src="@/assets/logos/cca.png"/>
        <img class="logo" src="@/assets/logos/plus.png"/>
    </div>
        

      </div>

    </div>
  </transition>
</template>

<script>
import "@fontsource/cormorant-garamond/500.css"
import "@fontsource/space-mono/700.css"


export default {
  name: "About",
  props: ['show'],
  data() {
    return {};
  },
  components: {
  },
  computed: {
  },
  methods: {
    close() {
      this.$emit('close');
    },
  }
};
</script>
<style scoped lang="scss">


#aboutwrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20000;
}

#aboutbackdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgb(50,50,50);
  opacity: 0.8;
  z-index: 0;
}

#about {
  z-index: 1;
  pointer-events: auto;
  font-family: 'Space Mono', serif;
  background: linear-gradient(180deg, rgba(191,212,244,1) 0%, rgba(235,227,220,1) 100%); 
  border-radius: 50px;
  width: 400px;
  min-height: 55vh;
  padding: 50px;
  font-size: .8em;
  // animation: floating 5s infinite;
  // animation-timing-function: ease;
  box-shadow: -2px 6px 50px rgba(110, 167, 252, .5), 0px 0px 1.5px #212121;
}

p b {
   white-space: nowrap;
 }

.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@keyframes floating {
  0%   {transform: translatey(-8px);}
  50%  {transform: translatey(0px);}
  100% {transform: translatey(-8px);}
}

.logos {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.logo {
  max-width: 75px;
  margin: 0 1em;
  height: auto;
  margin-left: 1.25em;
}

</style>

