<template>
  <div id="mapcontroller">
    <div id="windowcenter"></div>


    <div id="gsapdummy"></div>
    <div id="gsapdummy2"></div>
    <div id="mapcanvas" :style="translateStyle">

      <AudioPath v-for="d in audiopathData" :key="d.id" :id="d.id"></AudioPath>

      <SvgMapBackdrop scale="1"></SvgMapBackdrop>

    </div>

    <BackgroundSky class="fixed" />

  </div>
</template>

<script>

/*  eslint-disable */ 


import BackgroundSky from "@/components/BackgroundSky.vue";
import AudioPath from "@/components/AudioPath.vue";
import SvgMapBackdrop from "@/components/SvgMapBackdrop.vue";

import { SVG } from '@svgdotjs/svg.js'
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";
gsap.registerPlugin(MotionPathPlugin);


var transitionTime= 2; 
var startScale = 6;

var introId = 'TRANSITjlintro'

export default {
  name: "MapController",
  data() {
    return {
      gsapMapcanvas: null,
      gsapIntroScale: null,
      cameraFocusedOnId: null,
      windowHeight: 0,
      windowWidth: 0,
      mcX: 2500,
      mcY: 2500,
      scale: startScale,
      introLocationSet: false,
    };
  },
  components: {
    AudioPath,
    SvgMapBackdrop,
    BackgroundSky,
  },
  computed: {
    slug() {
      return this.$route.params.slug;
    },
    interviews() {
      return this.$store.getters.interviews;
    },
    audiopathData() {
      return this.$store.getters.audiopathData;
    },
    allFields() {
      try { 
        return Object.keys(this.interviews[0].fields)
      } catch {
        return []
      }
    },
    stateLoaded() {
      return this.$store.getters.hasLoaded;
    },
    startLocation() {
      try {
        var intropath = this.audiopathData[introId]
        var startpoint = SVG(intropath.elem).pointAt(0)
        return startpoint;
      } catch { console.log("uhoh"); return null; }
    },
    homeLocation() {
      try {
        var intropath = this.audiopathData[introId]
        var introSVG = SVG(intropath.elem);
        var endpoint = introSVG.pointAt(introSVG.length())
        return endpoint;

      } catch { return null; }
    },
    playingPathId() {
      return this.$store.getters.playingPathId;
    },
    nextPlayingPathId() {
      return this.$store.getters.nextPlayingPathId;
    },
    playingPathDuration() {
      return this.$store.state.playingPathDuration;
    },
    translateStyle() {
      return  { transform: 'translate(' + (-this.mcX + this.windowWidth / 2) * this.scale + 'px, ' + (-this.mcY + this.windowHeight / 2) * this.scale + 'px) scale(' + this.scale + ')' };
      //TODO to figure out centering on window
    },
    playedIntro() {
      return this.$store.state.playedIntro;
    },
    status() {
      return this.$store.state.status;
    },
  },
  methods: {
    startCoordsFromSlug(slug) {
      try {
        var pathdata = Object.values(this.audiopathData).filter(function(d) { 
          return d['Slug'] === slug;
        })[0]
        var startpoint = SVG(pathdata.elem).pointAt(0)
        return startpoint;
      } catch {
        return null;
      }
    },
    stopFollowingExistingJourney() {
      var self = this;
      // audio fadeout is handled by SoundPlayer.vue's watch function
      if(this.cameraFocusedOnId === introId) {
        this.$store.commit("setPlayedIntro", true);
      }
      this.cameraFocusedOnId = null;
      if(this.gsapMapcanvas) { this.gsapMapcanvas.reverse(); }




    },
    focusOnNewBlob(newid, callback) {
      var self = this;
      var thisx = this.mcX;
      var thisy = this.mcY;
      let thisdata = this.audiopathData[newid];
      let newsvgpath = SVG(thisdata.elem);
      let newsvgpathpoint = newsvgpath.pointAt(0);

      // HANDLE transit directions
      var startpos, endpos;
      if(newid.includes("-B")) {
        startpos = { x: newsvgpathpoint.x, y: newsvgpathpoint.y };
        endpos = { x: thisx, y: thisy };
      } else { 
        startpos = { x: thisx, y: thisy };
        endpos = { x: newsvgpathpoint.x, y: newsvgpathpoint.y };
      }

      if(!this.playingPathId) {
        // this is our first play!
        console.log("first click!");
      }

      gsap.fromTo("#gsapdummy", {
        x: startpos.x,
        y: startpos.y,
      },
      {
        x: endpos.x,
        y: endpos.y,
        transformOrigin: "50% 50%",
        force3D: false,
        duration: transitionTime,
        ease: "sine.inOut",
        onUpdate: function() {
          self.mcX = gsap.getProperty(this.targets()[0], "x");
          self.mcY = gsap.getProperty(this.targets()[0], "y");
        },
        onComplete: function() {
          callback();
        },
      }); 

    },
    startNewJourney(newid) {
      var self = this;
      let thisdata = this.audiopathData[newid];
 
      this.$store.commit("setPlayingPathId", newid);


      self.cameraFocusedOnId = newid;

      // HANDLE transit directions
      var start = 0;
      var end = 1;
      if(newid.includes("-B")) {
        start = 1;
        end = 0;
      }

      /* sky transition logic

        if this is an intro file, do one transition at the halfway mark.
        if this is an interview file, do two transitions.
        if this is a start file, do three transitions.
      */

      var numTransitions = 1;
      if(thisdata.type === 'intro') { numTransitions = 1; }
      if(thisdata.type === 'interview') { numTransitions = 2; }
      if(thisdata.type === 'start') { numTransitions = 3; }

      var transitionTimes = [];
      for(let i = 0; i < numTransitions; i++) {
        transitionTimes.push(1 / (numTransitions + 1) * (i + 1));
      }

      console.log(transitionTimes);

      this.gsapMapcanvas = gsap.to("#mapblob-" + newid, {
        motionPath: {
          path: thisdata.d,
          start: start,
          end: end,
        },
        transformOrigin: "50% 50%",
        force3D: false,
        duration: 500, //placeholder; this is changed when audio duration is updated
        ease: "power2.out",
        onUpdate: function() {
          if(self.cameraFocusedOnId === newid) { // this is so blobs keep on animating and we can just change the camera focus
            self.mcX = gsap.getProperty(this.targets()[0], "x");
            self.mcY = gsap.getProperty(this.targets()[0], "y");
            if(transitionTimes.length > 0 && this.progress() > transitionTimes[0]) {
              transitionTimes.shift()
              self.$root.$emit('BackgroundSky_skyChange') //backgroundsky.vue handles this
            }
          }
        },
        onStart: function() {
        },
        onComplete: function() {
          self.cameraFocusedOnId = null;
          this.reverse();
          this.timeScale(3);
          self.$store.commit("setPlayingPathId", null);
          if(newid === introId) {
            self.$store.commit("setPlayedIntro", true);
          }
        },
      });

      this.gsapIntroScale = gsap.fromTo("#gsapdummy2", {
        scale: self.scale
      },
      {
        scale: 1,
        duration: 300, //placeholder; this is changed when audio duration is updated
        ease: "power4.out",
        onUpdate: function() {
          if(self.cameraFocusedOnId === newid) { // this is so blobs keep on animating and we can just change the camera focus
            if(newid === introId) {
              self.scale = gsap.getProperty(this.targets()[0], "scale");
            }

          }
        },
      });




    },
    scheduleNewJourney(newid, oldid) {
      var self = this;

      console.log("scheduling new journey")
      // stop existing animation
      this.stopFollowingExistingJourney();

      // requeuing animation, as focus of camera goes to new blob
      this.focusOnNewBlob(newid, function() {
        var newslug = self.audiopathData[newid]['Slug']
        if(self.slug !== newslug) {
          self.$router.push({ params: {slug: newslug} })
        }
        self.startNewJourney(newid);
      });

    },
    goHome() {
      var self = this;

      console.log("skipping intro");
      // stop existing animation
      this.stopFollowingExistingJourney();

      console.log(this.homeLocation);

      gsap.fromTo("#gsapdummy", {
        x: this.mcX,
        y: this.mcY,
        scale: self.scale,
      },
      {
        x: this.homeLocation.x,
        y: this.homeLocation.y,
          scale: 1,
        transformOrigin: "50% 50%",
        force3D: false,
        duration: 5,
        ease: "power3.inOut",
        onUpdate: function() {
          self.mcX = gsap.getProperty(this.targets()[0], "x");
          self.mcY = gsap.getProperty(this.targets()[0], "y");
          self.scale = gsap.getProperty(this.targets()[0], "scale");
        },
        onComplete: function() {
        },
      }); 

    },
    onMapLoad() {
      // essentially, when page loads
      var slugCoords = this.startCoordsFromSlug(this.slug)
      if(this.slug && slugCoords) {
         console.log("slug", this.slug);
        this.mcX = slugCoords.x;
        this.mcY = slugCoords.y;
        this.scale = 1;
        this.introLocationSet = true;
        this.$store.commit("setPlayedIntro", true);
      } else {
        this.mcX = this.startLocation.x;
        this.mcY = this.startLocation.y;
        this.scale = startScale;
        this.introLocationSet = true;
      }
    },
  },
  watch: {
    nextPlayingPathId(newid, oldid) {
      this.scheduleNewJourney(newid, oldid);
    },
    playingPathDuration(newdur, olddur) {
      try {
        console.log(newdur, olddur)
        console.log(this.gsapMapcanvas.duration())
        this.gsapMapcanvas.duration(newdur)
       } catch {}
    },
    playedIntro(newval, oldval) {
      if(newval == true && oldval == false && !this.slug) { this.goHome(); }
    },
    status(newval, oldval) {
      if(newval == "paused" && oldval == "playing") {
        this.gsapMapcanvas.pause();
      }
      if(newval == "playing" && oldval == "paused") {
        this.gsapMapcanvas.resume();
      }
    },
  },
  mounted() {
    window.gsap = gsap;

    this.windowHeight = window.innerHeight
    this.windowWidth= window.innerWidth
    window.addEventListener('resize', () => {
      this.windowHeight = window.innerHeight
      this.windowWidth= window.innerWidth
    })
    this.$root.$on('MapController_goHome', () => {
      this.goHome();
      this.$root.$emit('SoundPlayer_fadeOut')
    })
  },
  updated() {
    if(this.startLocation && !this.introLocationSet) {
      this.onMapLoad();
    }
  },
};
</script>
<style scoped lang="scss">
#mapcontroller {
  position: fixed; 
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
}

#mapcontroller > * {
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
}

#mapcanvas {
  margin: 0px;
  padding: 0px;
  z-index: 1;
}
.fixed {
  position: fixed !important;
}

#gsapdummy, #gsapdummy2 {
  display: none;
}


#windowcenter {
  display: none;
  width: 6px;
  height: 6px;
  position: fixed;
  top: calc(50% - 3px);
  left: calc(50% - 3px);
  background-color: black;
  border-radius: 5px;
  z-index: 1000;
}

.debug { display: none; }
.showdebug .debug { display: block; }

</style>

