<template>
  <div id="debug">
    <select v-model="sky" >
      <option>day</option>
      <option>night</option>
    </select>
    <select v-model="fixedcanvas" >
      <option>fixed</option>
      <option>absolute</option>
    </select>
     <select v-model="viewdebug" >
      <option>showDebug</option>
      <option>hideDebug</option>
    </select>
        
  </div>
</template>

<script>



export default {
  name: "Debug",
  data() {
    return {
      fixedcanvas: "fixed",
      viewdebug: "showDebug",
  };
  },
  components: {
  },
  computed: {
    sky: {
      get() {
        return this.$store.state.sky;
      },
      set(value) {
        this.$store.commit("setSky", value);
      },
    }
  },
  methods: {
  },
  watch: {
    sky: function(val) {
      if(val === "night") {
//        this.$store.commit("setSky", night
      }
    },
    fixedcanvas: function(val) {
      if(val === "fixed") {
        document.getElementById("mapcontroller").style.position = "fixed";
      } else {
        document.getElementById("mapcontroller").style.position = "absolute";
      }
    },
    viewdebug: function(val) {
      if(val === 'showDebug') {
        document.body.classList.add("showdebug");
      } else {
        document.body.classList.remove("showdebug");
      }
    },

  }
};
</script>
<style scoped lang="scss">


#debug {
  position: fixed;
  bottom: 20px;
  left: 50vw;
  border: 1px solid red;
  height: 30px;
}


</style>

