const images = [
  "img1.jpg","img2.jpg","img3.jpg","img4.jpg",
  "img5.jpg","img6.jpg","img7.jpg","img8.jpg"
];

let current = 0;
let next = 1;

const leftImg = document.getElementById("leftImg");
const rightImg = document.getElementById("rightImg");

// initial load
leftImg.src = images[current];
rightImg.src = images[next];

setInterval(() => {
  // STEP 1: current plain → tilted left
  rightImg.classList.add("move-left");
  leftImg.classList.remove("tilted");

  // STEP 2: after animation, swap roles
  setTimeout(() => {
    current = next;
    next = (next + 1) % images.length;

    leftImg.src = images[current];
    rightImg.src = images[next];

    // reset classes
    leftImg.className = "img tilted";
    rightImg.className = "img plain";

  }, 1200);

}, 3000);
