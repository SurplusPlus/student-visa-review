<template>
  <div class="interviewblob">
    <slot></slot>
      <svg @click="onclick" width="200" height="200" viewBox="0 0 200 200">
        <g>
          <path class="blobpath"  :d="points" ></path>
        </g>
      </svg>
  </div>
</template>

<script>
export default {
  name: "InterviewBlob",
  props: ['id'],
  data() {
    return {
    };
  },
  methods: {
    onclick: function() {
      // clicking on a blob means playing it!
      this.$store.commit("setPlayingPathId", this.id);
      console.log('setPlayingPathId', this.id);
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
      let blob = createBlob({ 
        numPoints: 12,
        minRadius: 50,
        maxRadius: 100,
        centerX: 100,
        centerY: 100
      });

      return cardinal(blob.points, true, 1);

    }
  },
};

/** BELOW FROM https://codepen.io/osublake/pen/vdzjyg */ 
var createBlob = function(options) {
   
  var points = [];  

  var slice = (Math.PI * 2) / options.numPoints;
  var startAngle = random(Math.PI * 2);
  
  
  for (let i = 0; i < options.numPoints; i++) {
    
    let angle = startAngle + i * slice;
    let radius = random(options.minRadius, options.maxRadius);
    
    let point = {
      x: options.centerX + Math.cos(angle) * radius,
      y: options.centerY + Math.sin(angle) * radius,
    };   
    
    points.push(point);
  }
  
  options.points = points;

  return options;
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
