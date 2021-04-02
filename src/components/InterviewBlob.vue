<template>
  <div class="interviewblob">
    <slot></slot>
      <svg @click="onclick" width="200" height="200" viewBox="0 0 200 200">
        <g>
          <path class="blobpath" :d="points" ></path>
        </g>
      </svg>
  </div>
</template>

<script>
/*  eslint-disable */ 
import { gsap } from "gsap";

export default {
  name: "InterviewBlob",
  props: ['id'],
  data() {
    return {
      blob: null,
      numPoints: 10,
      minRadius: 80,
      maxRadius: 100,
      centerX: 100,
      centerY: 100,
      minDuration: 2,
      maxDuration: 3,
      rawpoints: [],
      tl: null
    };
  },
  methods: {
    onclick: function() {
      // clicking on a blob means playing it!
      this.$store.commit("setNextPlayingPathId", this.id);
      console.log('setNextPlayingPathId', this.id);
      // this is handled by MapController
    }
  },
  computed: {
    interviews() {
      return this.$store.getters.interviews;
    },
    record() {
      if(this.id in this.interviews) {
        return this.interviews[this.id];
      } else {
        return undefined;
      }
    },
    points() {
      try {
        return cardinal(this.rawpoints, true, 1);
      } catch {
        return []
      }
    },
    playingPathId() {
      return this.$store.getters.playingPathId;
    },
    areWePlaying() {
      return this.playingPathId === this.id;
    },
  },
  mounted() {
    this.blob = createBlob({
      this: this
    });
  },
  watch: {
    areWePlaying (newv, oldv) {
      console.log(newv, oldv);
      if(newv) {
        this.minDuration= 0.5;
        this.maxDuration= 1;
        console.log(this.tl.duration())
        // TODO make this work 
      }
    }
  },
};

/** BELOW FROM https://codepen.io/osublake/pen/vdzjyg */ 
var createBlob = function(options) {
  var self = options.this;
   
  var points = [];  
  
  var slice = (Math.PI * 2) / self.numPoints;
  var startAngle = random(Math.PI * 2);
  
  var tl = gsap.timeline({
  });   

  for (let i = 0; i < self.numPoints; i++) {
    
    let angle = startAngle + i * slice;
    let radius = random(self.minRadius, self.maxRadius);
    var duration = random(self.minDuration, self.maxDuration);
    
    
    let point = {
      x: self.centerX + Math.cos(angle) * radius,
      y: self.centerY + Math.sin(angle) * radius,
    };   

    tl.to(point, duration, {
      x: self.centerX + Math.cos(angle) * self.maxRadius,
      y: self.centerY + Math.sin(angle) * self.maxRadius,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: -random(duration)
    });
   
    points.push(point);
  }
  
  self.rawpoints = points;
  self.tl = tl;

  
}



// Cardinal spline - a uniform Catmull-Rom spline with a tension option
function cardinal(data, closed, tension) {
  
  if (data.length < 1) return "M0 0";
  if (tension == null) tension = 1;
  
  var size = data.length - (closed ? 0 : 1);
  var path = "M" + data[0].x + " " + data[0].y + " C";
  
  for (var i = 0; i < size; i++) {
    
    var p0, p1, p2, p3;
    
    if (closed) {
      p0 = data[(i - 1 + size) % size];
      p1 = data[i];
      p2 = data[(i + 1) % size];
      p3 = data[(i + 2) % size];
      
    } else {
      p0 = i == 0 ? data[0] : data[i - 1];
      p1 = data[i];
      p2 = data[i + 1];
      p3 = i == size - 1 ? p2 : data[i + 2];
    }
        
    var x1 = p1.x + (p2.x - p0.x) / 6 * tension;
    var y1 = p1.y + (p2.y - p0.y) / 6 * tension;

    var x2 = p2.x - (p3.x - p1.x) / 6 * tension;
    var y2 = p2.y - (p3.y - p1.y) / 6 * tension;
    
    path += " " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + p2.x + " " + p2.y;
  }
  
  return closed ? path + "z" : path;
}


function random(min, max) {
  if (max == null) { max = min; min = 0; }
  if (min > max) { var tmp = min; min = max; max = tmp; }
  return min + (max - min) * Math.random();
}







</script>

<style scoped>

.interviewblob {
}
svg {
  width: 100%;
  height: auto;
}

</style>
