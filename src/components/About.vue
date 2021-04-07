<template>
  <transition name="fade">
    <div id="aboutwrapper" v-if="show">
      <div id="about" @click="close">

        <p>The Student Visa Review was co-curated by Jess Myers (Assistant Professor, RISD) and Lev Bratishenko (Curator Public, CCA), with SURPLUS+ (Shea Fitzpatrick, Lucy Liu, and Dan Taeyoung) and produced by RISD graduate assistants Michael Garel-Martorana, Sanjana Govind Masurkar, and Remi (Wenyue) Qiu.</p>

        <p>The Bureau Chiefs: Abena Acheampong Danquah (Ghana), Anastasia Fedotova (Russia), Amber Han (China), Oromia Jula (Ethiopia), Brad Lei (China), Mackenzie Luke (Barbados), Minho Kwon (Korea), and Kaijie (Kevin) Huang (China).</p>
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
}

#about {
  pointer-events: auto;
  font-family: 'Space Mono', serif;
  background-color: green;
  width: 50vw;
  height: 70vh;
  padding: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>

