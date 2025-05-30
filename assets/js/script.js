// gsap.registerPlugin(Draggable, SplitText, MotionPathPlugin);
gsap.registerPlugin(Draggable,InertiaPlugin);

// Collect all the relevant HTML elements
// Containers for the loom
const loom = document.querySelector('.loom');


// The warp and weft form elements
const numWeft = document.querySelector('#num-weft');
const numWarp = document.querySelector('#num-warp');

// The warp and weft colours
const primaryWeftColour = document.querySelector('#primary-weft-col');
const secondaryWeftColour = document.querySelector('#secondary-weft-col');
const primaryWarpColour = document.querySelector('#primary-warp-col');
const secondaryWarpColour = document.querySelector('#secondary-warp-col');

// The buttons for generating the loom and weaving
const generateLoomButton = document.querySelector('#btn-gen-loom');
const weaveButton = document.querySelector('#btn-weave');

const spacing = 40;
const wrapOffset = 48;

// Create the loom
generateLoomButton.addEventListener('click', () => {
    // Clear existing threads    
    loom.innerHTML = '';

    // Get the number of weft and warp threads
    const numWeftThreads = gsap.utils.clamp(1, 23)(parseInt(numWeft.value, 10));
    const numWarpThreads = gsap.utils.clamp(1, 23)(parseInt(numWarp.value, 10));

    
    // Add weft threads
    for (let i = 0; i < numWeftThreads; i++) {
        addHTMLThread(i,'weft',loom);
    }

    // Add warp threads
    for (let i = 0; i < numWarpThreads; i++) {
        addHTMLThread(i, 'warp', loom);
    }

    weaveButton.disabled = false;
});

// Weave the fabric
weaveButton.addEventListener('click', () => {
    // weaveThreadsCurtain();
    weaveThreads();

    weaveButton.disabled = true;
});


// Create the loom
function addHTMLThread(i,type, threadContainer) {

    // Create the wrapper for the thread - used to drag each thread
    let threadWrapper = document.createElement('div');
    threadWrapper.classList.add('thread-wrapper');

    let thread = document.createElement('div');
    thread.classList.add(type);

    threadWrapper.appendChild(thread);
    threadContainer.appendChild(threadWrapper);


    // Set wrapper as absolute so we can move it
    threadWrapper.style.position = "absolute";

    if (type === 'warp') {
        if ((i % 8) < 5) {
            thread.classList.add(primaryWeftColour.value);
            thread.classList.add("primary");
        } else {
            thread.classList.add(secondaryWeftColour.value);
            thread.classList.add("secondary");
        }

        thread.innerHTML = `
            <span class="dragger"></span>
            <span>සුළෙඟ් මෘදු ලෙස නටන වී කරල් දෙස මම බලා සිටින විට, ටෝටෝ මල් පොහොට්ටු මට ආපහු එන්න කතා කරයි.</span>
        `;

        
        threadWrapper.style.left = `${i * spacing+wrapOffset}px`;

        requestAnimationFrame(() => {
            const containerHeight = threadContainer.getBoundingClientRect().height;
            const wrapperHeight = threadWrapper.getBoundingClientRect().height;

            // We want the thread to *start* fully at the top (0), and drag *downward*
            const startY = 12;
            const maxY = containerHeight - wrapperHeight;
            const minY = 0;

            gsap.set(threadWrapper, {
                y: startY
            });

            Draggable.create(threadWrapper, {
                type: "y",
                intertia: true,
                bounds: { minY, maxY }
            });
        });
    }
    else if (type === 'weft') {

        if ((i%8) < 5) {
            thread.classList.add(primaryWarpColour.value);
            thread.classList.add("primary");
        } else {
            thread.classList.add(secondaryWarpColour.value);
            thread.classList.add("secondary");
        }

        thread.innerHTML = `
            <span class="dragger"></span>
            <span>As I watch the panicles of rice gently dance in the wind, flowers of Toetoe call me back.</span>
        `;

        // thread.style.left = "0px";
        threadWrapper.style.top = `${i*spacing+wrapOffset}px`;

        requestAnimationFrame(() => {
            const containerWidth = threadContainer.getBoundingClientRect().width;
            const threadWrapperWidth = thread.getBoundingClientRect().width;

            const startX = containerWidth-12;
            const minX = 24;
            const maxX = -containerWidth+12;

            console.log(`containerWidth: ${containerWidth}, threadWidth: ${threadWrapperWidth}; difference: ${containerWidth-threadWrapperWidth}, maxX: ${maxX}, minX: ${minX}`);

            gsap.set(thread, {
                x: startX
            });

            Draggable.create(threadWrapper, {
                type: "x",
                inertia: true,
                bounds: {minX:0, maxX:maxX}
            });
        });
    }
}


// Functions to weave threads
// Weave alternate threads together
function weaveThreads() {

  const weftThreads = Array.from(document.querySelectorAll('.thread-wrapper .weft'));
  const warpThreads = Array.from(document.querySelectorAll('.thread-wrapper .warp'));

  const minLength = Math.min(weftThreads.length, warpThreads.length);
  const combined = [];

  for (let i = 0; i < minLength; i++) {
    combined.push(weftThreads[i]);
    combined.push(warpThreads[i]);
  }

  // If one set is longer, append the remaining
  if (weftThreads.length > minLength) {
    combined.push(...weftThreads.slice(minLength));
  } else if (warpThreads.length > minLength) {
    combined.push(...warpThreads.slice(minLength));
  }

  gsap.to(combined, {
    duration: 3,
    y: (i, target) => target.classList.contains('warp') ? 1014 : "+=0", // warp moves, weft stays
    x: (i, target) => target.classList.contains('weft') ? -12 : "+=0", // weft moves, warp stays
    ease: "sine.inOut",
    stagger: {
      each: 0.05
    }
  });

}

// Weave threads like a curtain
function weaveThreadsCurtain() {
    //Get all the threads
    const weftThreads = document.querySelectorAll(".weft");
    const warpThreads = document.querySelectorAll(".warp");

    gsap.to(weftThreads, {
        duration: 3,
        y: 1024,
        ease: "sine.inOut",
        stagger: {
            each: 0.05,
            from: "left"
        }
    });

    gsap.to(warpThreads, {
        duration: 3,
        x: 0,
        ease: "sine.inOut",
        stagger: {
            each: 0.05,
            from: "top"
        }
    });
}