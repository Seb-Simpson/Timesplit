import * as THREE from 'three';
import * as CONSTANTS from "./settings.js"
import { Model } from "./model.js";
import { Block } from "./block.js";
import { randfloat, randint } from "./helper.js"

let onground= true

//Constants
const mouse={};
const keys={};
let velocityY = 0;
let yaw = 0;
let pitch = 0;

window.addEventListener("keydown", function(event) {
    keys[event.key] = true
});

window.addEventListener("keyup", function(event) {
    keys[event.key] = false
});

// World
const scene = new THREE.Scene();

//lighting
const ambientlight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientlight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(10,10,10);
scene.add(dirLight)

// Camera
const player = new THREE.Object3D();
scene.add(player);
const camera = new THREE.PerspectiveCamera(
    60, // field of view
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

player.add(camera)

document.addEventListener("click", function() {
    document.body.requestPointerLock();
})

window.addEventListener("mousemove",function(event) {
    yaw -= event.movementX *0.001;
    pitch -= event.movementY *0.001;
    pitch = Math.max( -Math.PI / 2, Math.min(Math.PI / 2, pitch));
    camera.rotation.x = pitch;
    player.rotation.y = yaw;
});

// Move camera back so we can see things
player.position.z = 5;

//Camera direction for movement - Function for movement

function move(speed) {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0
    direction.normalize();
    player.position.add(
        direction.multiplyScalar(speed)
    );
}

//Move left or right
function strafe(speed) {
    const direction= new THREE.Vector3();
    const right = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    right.crossVectors(direction, new THREE.Vector3(0,1,0));
    player.position.add(
        right.multiplyScalar(speed)
    );
}

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Background

// Map
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

//Model loading
const trees = 7
for (let index = 0; index < trees; index++) {
    const x = randint(0, CONSTANTS.mapLengthX);
    const z = randint(0, CONSTANTS.mapLengthZ);
    const angle = randfloat(0, 2 * Math.PI);
    const scale = randfloat(0.4, 0.7);
    new Model(scene, "giant_low_poly_tree", [x, 0, z], [0, angle, 0], scale);
}

// Game Loop
function animate() {
    let forwardX = -Math.sin(yaw);
    let forwardZ = -Math.cos(yaw);
        
    // Mouse movement
    if (keys["w"]) {
        move(0.1)
    }
    if (keys["s"]) {
        move(-0.1);
    }
    if (keys["a"]) {
        strafe(-0.1)
    }
    if (keys["d"]) {
        strafe(0.1)
    }
    if (keys[" "] && onground) {
        velocityY=0.2
        onground=false
    }

    velocityY -=0.01;
    camera.position.y += velocityY;

    if (camera.position.y < 1) {
        camera.position.y = 1;
        velocityY = 0
        onground=true
    }

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();