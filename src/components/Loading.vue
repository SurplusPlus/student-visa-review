<template>
  <transition name="fade">
    <div id="aboutwrapper" v-if="show">
      <div id="aboutbackdrop"></div>
      <div id="about" >

        <h2>Loading....</h2>

      </div>

    </div>
  </transition>
</template>

<script>
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
  opacity: 1;
  z-index: 0;
}

#about {
  color: white;
  z-index: 1;
  pointer-events: auto;
  font-family: 'Space Mono', serif;
  border-radius: 50px;
  padding: 50px;
  font-size: .8em;
  text-shadow: 0px 0px 15px rgba(110, 167, 252);
  box-shadow: -2px 6px 50px rgba(110, 167, 252, .5), 0px 0px 1.5px #212121;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 4s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}


</style>

