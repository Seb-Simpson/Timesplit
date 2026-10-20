import * as THREE from "three";
import RAPIER from "rapier";
import { PhysicsObject } from "./physicsObject.js";

export class Player extends PhysicsObject {
    constructor(scene, world, mesh, camera) {
        const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 1, 0.5);
        super(scene, world, mesh, colliderDesc, [0, 1, 0], [0, 0, 0], [1, 1, 1], 1, false, 0, 0.8, true);

        this.camera = camera;
        this.mesh.add(camera);

        this.jumpStrength = 2;
        this.speed = 5;
        this.sprintBonus = 1; // Decimal percentage of this.speed

        this.pitch = 0;
        this.yaw = 0;
    }

    jump() {
        if (!this.onGround) return;

        this.body.applyImpulse(
            { x: 0, y: this.jumpStrength, z: 0 }
        );
    }

    move(forwardInput, strafeInput, sprint = false) {
        if (!this.onGround) return; // Prevents midair movement, can be removed

        const currentVel = this.body.linvel();

        const forward = new THREE.Vector3();
        const right = new THREE.Vector3();
        const direction = new THREE.Vector3();

        this.camera.getWorldDirection(forward);

        forward.y = 0;
        forward.normalize();

        right.crossVectors(
            forward,
            new THREE.Vector3(0, 1, 0)
        );

        forward.multiplyScalar(forwardInput);
        right.multiplyScalar(strafeInput);

        direction.addVectors(forward, right);

        if (direction.lengthSq() > 1) {
            direction.normalize();
        }

        if (sprint) {
            direction.addScaledVector(forward, this.sprintBonus);
        }

        this.body.setLinvel({
            x: direction.x * this.speed,
            y: currentVel.y,
            z: direction.z * this.speed
        });
    }

    look(movementX, movementY) {
        this.yaw -= movementX;
        this.pitch -= movementY;

        this.pitch = THREE.MathUtils.clamp(this.pitch, -Math.PI / 2 + 0.01, Math.PI / 2 + 0.01);

        const q = new THREE.Quaternion()
        q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw)

        this.body.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w });
        this.camera.rotation.x = this.pitch;
    }
}