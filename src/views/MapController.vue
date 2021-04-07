<template>
  <div id="mapcontroller">
    <div class="debug">{{ playingPathDuration }}
      </div>
{{ startLocation }} 
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
var startScale = 3;

var startId = 'TRANSITjlintro'

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
    };
  },
  components: {
    AudioPath,
    SvgMapBackdrop,
    BackgroundSky,
  },
  computed: {
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
        var startpath = this.audiopathData[startId]
        var startpoint = SVG(startpath.elem).pointAt(0)
        console.log(startpoint);
        this.mcX = startpoint.x;
        this.mcY = startpoint.y;
        this.scale = startScale ;

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
    }
  },
  methods: {
    stopFollowingExistingJourney() {
      // audio fadeout is handled by SoundPlayer.vue's watch function
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

      var otherelem, otherid;

      if(thisdata.type === "transit") {

        if(thisdata.id.includes("-B")) { 
          otherid = thisdata.id.replace("-B", "-A");
        } else { 
          otherid = thisdata.id.replace("-A", "-B")
        }
        var otherelem = document.getElementById("mapblob-" + otherid);
        console.log(otherid, otherelem)

      }


      this.gsapMapcanvas = gsap.to("#mapblob-" + newid, {
        motionPath: {
          path: thisdata.d,
          start: start,
          end: end,
        },
        transformOrigin: "50% 50%",
        force3D: false,
        duration: 500, //placeholder; this is changed when audio duration is updated
        ease: "sine.out",
        onUpdate: function() {
          if(self.cameraFocusedOnId === newid) { // this is so blobs keep on animating and we can just change the camera focus
            self.mcX = gsap.getProperty(this.targets()[0], "x");
            self.mcY = gsap.getProperty(this.targets()[0], "y");
          }
        },
        onStart: function() {
          if(otherelem) { 
            console.log("trying to hide other");
            console.log(otherid);
            otherelem.style.display = 'none';
          }
        },
        onComplete: function() {
          if(otherelem) { 
            otherelem.style.display = 'block'; 
            this.pause(0);
          } else {
            self.cameraFocusedOnId = null;
            this.reverse();
          }
          self.$store.commit("setPlayingPathId", null);
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
            if(newid === startId) {
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
        self.startNewJourney(newid);
      });

    },

  },
  watch: {
    nextPlayingPathId(newid, oldid) {
      this.scheduleNewJourney(newid, oldid);
    },
    playingPathDuration(newdur) {
      try {
        console.log(this.gsapMapcanvas.duration())
        this.gsapMapcanvas.duration(newdur)
       } catch {}
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

