import * as THREE from 'three';
import { PhysicsObject } from "./physicsObject.js"

export class Player extends PhysicsObject{
    constructor(scene, camera) {
        const playerObject = new THREE.Object3D();

        super(scene, playerObject);

        this.camera = camera;
        this.object3D.add(camera);

        this.jumpStrength = 8;
        this.speed = 5;
        this.sprintBonus = 1; // Decimal percentage of this.speed

        this.object3D.position.y = 1;
        this.camera.position.y = 0;

        this.pitch = 0;
        this.yaw = 0;
    }

    jump() {
        if (!this.onGround) return;

        this.velocity.y = this.jumpStrength;
        this.onground = false;
    }

    move(forwardInput, strafeInput, sprint = false) {
        if (!this.onGround) return; // Prevents midair movement, can be removed

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

        this.velocity.x = direction.x * this.speed;
        this.velocity.z = direction.z * this.speed;
    }

    look(movementX, movementY) {
        this.yaw -= movementX;
        this.pitch -= movementY;

        this.pitch = THREE.MathUtils.clamp(this.pitch, -Math.PI / 2 + 0.01, Math.PI / 2 + 0.01);

        this.object3D.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
    }
}