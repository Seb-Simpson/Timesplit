import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';

let onground= true

//Constants
const mouse={};
const keys={};
let velocityY = 0;
let yaw = 0;
let pitch = 0;

window.addEventListener("keydown", function(event) {
    keys[event.key] =true
});

window.addEventListener("keyup", function(event) {
    keys[event.key] =false
});

// World
const scene = new THREE.Scene();
const loader = new GLTFLoader();

//Model loading
loader.load(
    'giant_low_poly_tree.glb',
    function(gltf){
        const model = gltf.scene;
        model.position.set(5,0,10)
        model.scale.set(2,2,2);
        model.traverse((child)=> {
        if (child.isMesh) {
            child.material.color.set(0xff0000);
        };
        scene.add(gltf.scene);
        console.log(gltf);
    });
    }
)

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
    console.log(player.position, camera.position);
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
const floorGeometry = new THREE.PlaneGeometry(100,100);
const floorMaterial = new THREE.MeshBasicMaterial({color:0x00aa00});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1; 
scene.add(floor)   

// Game Loop
function animate() {
    let forwardX = -Math.sin(yaw);
    let forwardZ = -Math.cos(yaw); // What's this used for @Seb???
        
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