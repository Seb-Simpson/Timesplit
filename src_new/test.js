import * as THREE from 'three';
import RAPIER from 'rapier';

async function main() {
  // Rapier must initialize before creating the physics world.
  await RAPIER.init();

  // ---------- THREE.JS ----------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202532);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(6, 6, 10);
  camera.lookAt(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.style.margin = '0';
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x555566, 2));

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 10, 5);
  scene.add(light);

  // ---------- RAPIER ----------
  const world = new RAPIER.World({
    x: 0,
    y: -9.81,
    z: 0
  });

  const eventQueue = new RAPIER.EventQueue(true);

  function createSphere({
    position,
    radius,
    color,
    mass = 1,
    fixed = false,
    restitution = 0.1, // Bounciness
    friction = 0.8
  }) {
    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
    mesh.position.set(...position);

    const bodyDesc = fixed
      ? RAPIER.RigidBodyDesc.fixed()
      : RAPIER.RigidBodyDesc.dynamic()
          .setCanSleep(false);

    bodyDesc.setTranslation(...position);

    const body = world.createRigidBody(bodyDesc);

    const colliderDesc = RAPIER.ColliderDesc
      .ball(radius)
      .setFriction(friction)
      .setRestitution(restitution);

    if (!fixed) {
      colliderDesc.setMass(mass);
      colliderDesc.setActiveEvents(
        RAPIER.ActiveEvents.COLLISION_EVENTS
      );
    }

    world.createCollider(colliderDesc, body);

    return { mesh, body };
  }

  function createBox({
    position,
    size,
    color,
    mass = 1,
    fixed = false,
    restitution = 0.1, // Bounciness
    friction = 0.8
  }) {
    const geometry = new THREE.BoxGeometry(...size);
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);
    mesh.position.set(...position);

    const bodyDesc = fixed
      ? RAPIER.RigidBodyDesc.fixed()
      : RAPIER.RigidBodyDesc.dynamic()
          .setCanSleep(false);

    bodyDesc.setTranslation(...position);

    const body = world.createRigidBody(bodyDesc);

    const colliderDesc = RAPIER.ColliderDesc
      .cuboid(size[0] / 2, size[1] / 2, size[2] / 2)
      .setFriction(friction)
      .setRestitution(restitution);

    if (!fixed) {
      colliderDesc.setMass(mass);
      colliderDesc.setActiveEvents(
        RAPIER.ActiveEvents.COLLISION_EVENTS
      );
    }

    world.createCollider(colliderDesc, body);

    return { mesh, body };
  }

  // Fixed floor: top surface is at y = 0.
  createBox({
    position: [0, -0.25, 0],
    size: [20, 0.5, 20],
    color: 0x626a78,
    fixed: true,
  });

  // Static wall to collide with.
  createBox({
    position: [0, 1.5, -3],
    size: [6, 3, 0.5],
    color: 0x8b91a0,
    fixed: true
  });

  // Dynamic player sphere.
  const player = createSphere({
    position: [0, 3, 0],
    radius: 1,
    color: 0x35a7ff,
    mass: 1,
    restitution: 0.5
  });

  // Another dynamic object.
  const crate = createBox({
    position: [2, 5, 0],
    size: [1.2, 1.2, 1.2],
    color: 0xffa43a,
    mass: 2,
    restitution: 0.35
  });

  // ---------- INPUT ----------
  const keys = new Set();

  window.addEventListener('keydown', (event) => {
    keys.add(event.code);
  });

  window.addEventListener('keyup', (event) => {
    keys.delete(event.code);
  });

  // ---------- GAME LOOP ----------
  const clock = new THREE.Clock();
  const fixedStep = 1 / 60;
  let accumulator = 0;

  function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.1);
    accumulator += delta;

    // Apply impulses to the dynamic player body.
    // Rapier calculates the resulting motion and collisions.
    const move = { x: 0, z: 0 };

    if (keys.has('KeyW')) move.z -= 1;
    if (keys.has('KeyS')) move.z += 1;
    if (keys.has('KeyA')) move.x -= 1;
    if (keys.has('KeyD')) move.x += 1;

    const length = Math.hypot(move.x, move.z);

    if (length > 0) {
      player.body.applyImpulse(
        {
          x: (move.x / length) * 0.5,
          y: 0,
          z: (move.z / length) * 0.5,
        },
        true
      );
    }

    // Step physics at a fixed timestep.
    while (accumulator >= fixedStep) {
      world.timestep = fixedStep;
      world.step(eventQueue);
      accumulator -= fixedStep;
    }

    // Handle collision start/end events.
    eventQueue.drainCollisionEvents(
      (handle1, handle2, started) => {
        const a = world.getCollider(handle1);
        const b = world.getCollider(handle2);

        if (started) {
          console.log('Collision started:', handle1, handle2);
        } else {
          console.log('Collision ended:', handle1, handle2);
        }
      }
    );

    // Physics -> rendering: never manually move these meshes.
    for (const object of [player, crate]) {
      const p = object.body.translation();
      const q = object.body.rotation();

      object.mesh.position.set(p.x, p.y, p.z);
      object.mesh.quaternion.set(q.x, q.y, q.z, q.w);
    }

    renderer.render(scene, camera);
  }

  // Handle browser resizing.
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}

main().catch(console.error);