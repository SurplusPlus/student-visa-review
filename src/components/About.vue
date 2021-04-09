<template>
  <transition name="fade">
    <div id="aboutwrapper" v-if="show">
      <div id="about" @click="close">

        <p>The Student Visa Review was co-curated by Jess Myers (Assistant Professor, RISD) and Lev Bratishenko (Curator Public, CCA), with SURPLUS+ (Shea Fitzpatrick, Lucy Liu, and Dan Taeyoung) and produced by RISD graduate assistants Michael Garel-Martorana, Sanjana Govind Masurkar, and Remi (Wenyue) Qiu.</p>

        <p>The Bureau Chiefs: Abena Acheampong Danquah (Ghana), Anastasia Fedotova (Russia), Amber Han (China), Oromia Jula (Ethiopia), Brad Lei (China), Mackenzie Luke (Barbados), Minho Kwon (Korea), and Kaijie (Kevin) Huang (China).</p>

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
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10005;
}

#about {
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease-in-out;
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

