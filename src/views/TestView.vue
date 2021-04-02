<template>
  <div class="landscape">
    hey a test

    {{ mapsvg }} 
    <object type="image/svg+xml" :data="mapsvg" />


  </div>
</template>

<script>

/*  eslint-disable */ 

function loadAudiopathDataFromSvg(svgpath, callback) {
  const parser = new DOMParser(); 
  fetch(svgpath)
    .then(function (response) {
      return response.text();
    })
    .then(function(text) {
      const svgDoc = parser.parseFromString(text, 'image/svg+xml');
      let pathData = Array.from(svgDoc.querySelectorAll('path')).map(function(x) { return { rawid: x.getAttribute("id"), d: x.getAttribute("d") }  })

      var audiopathData = pathData.filter(function(d) {
          return d.rawid.includes( "PATH-");
      });

      audiopathData.forEach(function(d) {
        d.id = d.rawid.replace("PATH-", "");
      });

      callback(audiopathData);
    });
}


export default {
  name: "TestView",
  data() {
    return {
      mapsvg: require('@/assets/map/working/pathmap.svg'),
    };
  },
  components: {
  },
  computed: {
  },
  methods: {
    parse: function() {

      loadAudiopathDataFromSvg(this.mapsvg, function(audiopathData) {

        
        console.log("got data", audiopathData);
      });

    },
  },
  mounted() {
    this.parse();
  },
};
</script>
<style scoped lang="scss">
</style>

