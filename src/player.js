import * as THREE from 'three';
import { PhysicsObject } from "./physicsObject.js"

export class Player extends PhysicsObject{
    constructor(scene, camera) {
        const playerObject = new THREE.Object3D();

        super(scene, playerObject);

        this.camera = camera;
        this.object3D.add(camera);

        this.jumpStrength = 10;
        this.speed = 10;

        this.object3D.position.y = 1;
        this.camera.position.y = 0;
    }

    jump() {
        if (!this.onGround) return;

        this.velocity.y = this.jumpStrength;
        this.onground = false;
    }

    move(forwardInput, strafeInput) {
        if (!this.onGround) return; // prevents midair movement, can be removed

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

        direction.addScaledVector(forward, forwardInput);
        direction.addScaledVector(right, strafeInput);

        if (direction.lengthSq() > 1) {
            direction.normalize();
        }

        this.velocity.x = direction.x * this.speed;
        this.velocity.z = direction.z * this.speed;
    }
}