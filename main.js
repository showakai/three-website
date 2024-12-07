import "./style.css";
import * as THREE from "three";
import bg from "./public/bg.jpg";

const canvas = document.querySelector("#webgl");

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load("/bg.jpg");

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.1,
  1000
);

scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(window.devicePixelRatio);

const material = new THREE.MeshNormalMaterial();

const box = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5, 10), material);
const donut = new THREE.Mesh(new THREE.TorusGeometry(8, 2, 16, 100), material);
donut.position.set(0, 1, 10);

box.position.set(0, 0.5, -15);
box.rotation.set(1, 1, 0);
scene.add(box, donut);

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();

  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

//線形補完なめらかにする
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
  return (scrollPercent - start) / (end - start);
}

const animationScripts = [];
animationScripts.push({
  start: 0,
  end: 40,
  play() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2, scalePercent(0, 40));
    donut.position.z = lerp(10, -20, scalePercent(0, 40));
  },
});
animationScripts.push({
  start: 40,
  end: 60,
  play() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60));
  },
});
animationScripts.push({
  start: 60,
  end: 80,
  play() {
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scalePercent(60, 80));
  },
});
animationScripts.push({
  start: 60,
  end: 80,
  play() {
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scalePercent(60, 80));
    camera.position.y = lerp(1, 15, scalePercent(60, 80));
    camera.position.z = lerp(10, 25, scalePercent(60, 80));
  },
});
animationScripts.push({
  start: 80,
  end: 10,
  play() {
    camera.lookAt(box.position);
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
  },
});
function playScrollAnimation() {
  animationScripts.forEach((a) => {
    if (scrollPercent >= a.start && scrollPercent <= a.end) {
      a.play();
    }
  });
}

let scrollPercent = 0;
document.body.onscroll = () => {
  scrollPercent =
    (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight -
        document.documentElement.clientHeight)) *
    100;
};

const tick = () => {
  playScrollAnimation();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
