// Imports
import * as THREE from 'three';
import * as CONSTANTS from "./settings.js"
import { Model } from "./model.js";
import { Block } from "./block.js";
import { randfloat, randint } from "./helper.js"
import { Player } from './player.js';
import { Controls } from './controls.js';

// Scene
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientlight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientlight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(10,10,10);
scene.add(dirLight)

// Background
scene.background = new THREE.Color(0x87CEEB)

// World
const colours = [0x14900f, 0x3cb338, 0x06be00]
const lengthX = CONSTANTS.mapLengthX / CONSTANTS.blockSize;
const lengthZ = CONSTANTS.mapLengthZ / CONSTANTS.blockSize;
for (let gridX = 0; gridX < lengthX; gridX++) {
    for (let gridZ = 0; gridZ < lengthZ; gridZ++) {
        let x = gridX * CONSTANTS.blockSize;
        let z = gridZ * CONSTANTS.blockSize;
        new Block(scene, [x, -(CONSTANTS.blockSize / 2), z], colours[randint(0, 3)])
    }
}

// Model loading
const trees = 7
for (let index = 0; index < trees; index++) {
    const x = randint(0, CONSTANTS.mapLengthX);
    const z = randint(0, CONSTANTS.mapLengthZ);
    const angle = randfloat(0, 2 * Math.PI);
    const scale = randfloat(1, 1.5);
    new Model(scene, "giant_low_poly_tree", [x, 0, z], [0, angle, 0], scale);
}

// Camera
const camera = new THREE.PerspectiveCamera(
    60, // field of view
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Player
const player = new Player(scene, camera);
const x = CONSTANTS.mapLengthX / 2;
const z = CONSTANTS.mapLengthZ / 2;
player.object3D.position.set(x, 0, z);

// Controls
const controls = new Controls(player, renderer);

// Clock for dt (delta time)
const clock = new THREE.Clock();

// Game Loop
function animate() {
    requestAnimationFrame(animate);

    const dt = Math.min(clock.getDelta(), 0.05);

    controls.update();
    player.update(dt);

    renderer.render(scene, camera);
}

animate();