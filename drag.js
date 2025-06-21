const fillies = document.querySelectorAll(".fill");
const empties = document.querySelectorAll(".empty");
const rotateR = document.querySelector(".rotate-r");
const rotateL = document.querySelector(".rotate-l");
let fill = [];

//Fill Listeners
for (const fill of fillies) {
  fill.addEventListener("dragstart", dragStart);
  fill.addEventListener("dragend", dragEnd);
}

rotateL.addEventListener("click", rotateClickL);
rotateR.addEventListener("click", rotateClickR);

//Loop through empties and call drag events
for (const empty of empties) {
  empty.addEventListener("dragover", dragOver);
  empty.addEventListener("dragenter", dragEnter);
  empty.addEventListener("dragleave", dragLeave);
  empty.addEventListener("drop", dragDrop);
}

//Rotate Button functions
function rotateClickR() {
  const firstEmpty = document.querySelector(".empty");
  firstEmpty.parentNode.appendChild(firstEmpty);
}

function rotateClickL() {
  const firstEmpty = document.querySelector(".empty");
  let lastEmpty = document.querySelectorAll(".empty");
  lastEmpty = lastEmpty[lastEmpty.length - 1];
  firstEmpty.parentNode.insertBefore(lastEmpty, firstEmpty);
}

//Drag Functions
function dragStart(ev) {
  event.dataTransfer.effectAllowed = "copyMove";
  if (event.shiftKey) {
    this.className += " hold";
    setTimeout(() => (this.className = "invisible"), 0);
  } else {
    fill = [];
    let seenThis = false;
    for (const f of this.parentNode.querySelectorAll(".fill")) {
      if (f == this || seenThis) {
        fill.push(f);
        seenThis = true;
      }
    }
    let folder = document.createElement("div");
    folder.id = "folder";
    this.parentNode.appendChild(folder);
    for (const f of fill) {
      folder.appendChild(f);
    }
    for (const f of fill) {
      f.className += " hold";
      setTimeout(() => (f.className = "invisible"), 0);
    }
    // Ha, I guess Chrome fixed itself and this isn't needed anymore!
    //const mult = offsetMultiplier();
    const mult = 1;
    ev.dataTransfer.setDragImage(folder, ev.offsetX * mult, ev.offsetY * mult);
  }
}

function dragEnd(ev) {
  if (ev.shiftKey) {
    this.className = "fill";
  } else {
    for (const f of fill) {
      f.className = "fill";
    }
  }
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.className += " hovered";
}

function dragLeave() {
  this.className = "empty";
}

function dragDrop(ev) {
  if (ev.shiftKey) {
    this.className = "empty";
    this.append(fill);
  } else {
    for (const f of fill) {
      this.appendChild(f);
      f.className = "empty";
    }
  }
}

// -----------------------------------------------------------------------------
// NOT NEEDED ANYMORE
// This might be Chrome's fault but to make this work right on a retina display
// on Chrome, we had to multiply the offsets when dragging by 2. But that seemed
// to make things glitchy on non-retina displays or on Firefox. So this function
// tries to dynamically figure out that multiplier (either 1 or 2).
// Tested on the following combinations so far:
// 1. Chrome with retina display
// 2. Chrome without retina display
// 3. Firefox with retina display
// 4. Firefox without retina display
// 5. Safari with retina display
// 6. Safari without retina display
function offsetMultiplier() {
  //const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  const isChrome = !!window.chrome;
  const isRetina = ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
  return isChrome && isRetina ? 2 : 1
}