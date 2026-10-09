import * as THREE from 'three';
import { Object } from "./object.js"

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

// Cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Floor
const floorLengthX = 50
const floorLengthZ = 50
const floorGeometry = new THREE.PlaneGeometry(floorLengthX, floorLengthZ);
const floorMaterial = new THREE.MeshBasicMaterial({color:0x00aa00});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor)

//Model loading
const trees = 20
for (let index = 0; index < trees; index++) {
    let x = (Math.random() * floorLengthX) - (floorLengthX / 2);
    let z = (Math.random() * floorLengthZ) - (floorLengthZ / 2);
    let tree = new Object(scene, "giant_low_poly_tree", [x, 0, z]);
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

    cube.rotation.y += 0.005;
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

animate();