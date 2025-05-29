gsap.registerPlugin(Draggable, SplitText, MotionPathPlugin);

const dragger = document.querySelector("#drag1");
let draggerWidth = dragger.getBoundingClientRect().width;
const curve = document.querySelector("#curve");
let clamp = gsap.utils.clamp(0,1);
let prevProgress = 0;

let bounds = curve.getBBox();

let tl = gsap.timeline({paused:true})
     .to(dragger, {motionPath: {
          path: curve,
          align: curve,
          alignOrigin: [0, 0]
     }, 
     immediateRender: true,
     ease: "none"
     });

tl.progress(0);
let minX = dragger.getBoundingClientRect().x;


tl.progress(1);

let maxX = dragger.getBoundingClientRect().x;

tl.progress(0);



Draggable.create(dragger, {
     type: "x",
     onDrag: function() {
          let rawX = dragger.getBoundingClientRect().x;

          let progress = clamp((rawX - minX)/ (maxX - minX));
          console.log({
               rawX: rawX,
               minX: minX,
               maxX: maxX,
               progress: progress
          });

          // console.log(`progress: ${progress}, this.x: ${this.x}, this.x+draggerWidth: ${this.x+draggerWidth}`);
          if (progress !== prevProgress) {
               // console.log(`progress diff: ${progress - prevProgress}`);
               tl.progress(progress);
               prevProgress = progress;
          } else {
               return false;
          }
     }
});

function animateWords() {
     gsap.fromTo(split.words, {
          y:-10,
          opacity: 0
     }, {
          y:0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.3,
          ease: "power2.out"
     });
}