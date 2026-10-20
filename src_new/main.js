import * as THREE from "three";
import RAPIER from "rapier";
import * as CONSTANTS from "./settings.js";
import { Player } from "./player.js";
import { Controls } from "./controls.js";
import { PhysicsObject } from "./physicsObject.js";

async function main() {
    await RAPIER.init();

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

    // Collision objects
    let objects = [];

    const world = new RAPIER.World({
        x: 0,
        y: -CONSTANTS.gravity,
        z: 0
    });

    const eventQueue = new RAPIER.EventQueue(true);

    // Camera
    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    // Player
    const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    const player = new Player(scene, world, playerMesh, camera);
    
    // Controls
    const controls = new Controls(player, renderer);

    // Block
    const blockGeometry = new THREE.BoxGeometry(10, 1, 10);
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const blockMesh = new THREE.Mesh(blockGeometry, blockMaterial);
    const blockColliderDesc = RAPIER.ColliderDesc.cuboid(5, 0.5, 5);
    const block = new PhysicsObject(scene, world, blockMesh, blockColliderDesc, [0, 0, 0], [0, 0, 0], [1, 1, 1], 1, true, 0, 0.8);

    // Block
    const blockGeometry2 = new THREE.BoxGeometry(1, 1, 1);
    const blockMaterial2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const blockMesh2 = new THREE.Mesh(blockGeometry2, blockMaterial2);
    const blockColliderDesc2 = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    const block2 = new PhysicsObject(scene, world, blockMesh2, blockColliderDesc2, [2, 3, -2], [0, 0, 0], [1, 1, 1], 1, false, 0, 0.8);

    // Clock for dt (delta time)
    const clock = new THREE.Clock();
    const fixedStep = 1 / 60;
    let accumulator = 0;

    function animate() {
        requestAnimationFrame(animate);

        const dt = Math.min(clock.getDelta(), 0.1);
        accumulator += dt;

        // Step physics at a fixed timestep.
        while (accumulator >= fixedStep) {
            world.timestep = fixedStep;
            world.step(eventQueue);
            accumulator -= fixedStep;
        }

        // Handle collision start/end events.
        eventQueue.drainCollisionEvents((handle1, handle2) => {
            world.getCollider(handle1);
            world.getCollider(handle2);
        });

        block.update(dt)
        block2.update(dt)

        controls.update()
        player.update(dt)

        renderer.render(scene, camera);
        console.log(scene.children);
    }

    animate()
}

main()