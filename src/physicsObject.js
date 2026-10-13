import * as THREE from "three";
import * as CONSTANTS from "./settings.js"

const groundY = 1;

export class PhysicsObject {
    constructor(scene, object3D) {
        this.scene = scene;
        this.object3D = object3D;

        this.velocity = new THREE.Vector3();

        this.onGround = false;
        
        this.scene.add(this.object3D);
    }

    update(dt) {
        this.velocity.y -= CONSTANTS.gravity * dt;

        this.object3D.position.addScaledVector(this.velocity, dt);

        if (this.object3D.position.y <= groundY) {
            this.object3D.position.y = groundY;

            this.velocity.y = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
    }
}