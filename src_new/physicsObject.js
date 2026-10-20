import RAPIER from "rapier";
import * as THREE from "three";

export class PhysicsObject {
    constructor(scene, world, mesh, colliderDesc, position, rotation, scale, mass, fixed, restitution, friction, locked=false) {
        this.scene = scene;
        this.world = world;
        this.mesh = mesh;

        this.mesh.position.set(...position);
        this.mesh.rotation.set(...rotation);
        this.mesh.scale.set(...scale);

        const bodyDesc = fixed ? RAPIER.RigidBodyDesc.fixed() : RAPIER.RigidBodyDesc.dynamic().setCanSleep(false);
        if (locked) bodyDesc.enabledRotations(false, true, false);
        bodyDesc.setTranslation(...position);

        this.body = world.createRigidBody(bodyDesc);

        this.colliderDesc = colliderDesc;
        this.colliderDesc.setFriction(friction);
        this.colliderDesc.setRestitution(restitution); // Bounciness
        
        if (!fixed) {
            colliderDesc.setMass(mass);
            colliderDesc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        }

        this.hitbox = new THREE.Box3()

        this.scene.add(this.mesh)
        this.world.createCollider(this.colliderDesc, this.body);
    }

    get onGround() {
        return this.#isOnGround();
    }

    update(dt) {
        const p = this.body.translation();
        const q = this.body.rotation();

        this.mesh.position.set(p.x, p.y, p.z);
        this.mesh.quaternion.set(q.x, q.y, q.z, q.w);

        this.hitbox.setFromObject(this.mesh);

        this.#updatePlus(dt);
    }

    #updatePlus(dt) {}

    #isOnGround() {
        const p = this.body.translation();

        const ray = new RAPIER.Ray(
            { x: p.x, y: p.y, z: p.z },
            { x: 0, y: -1, z: 0}
        );

        const maxDistance = ((this.hitbox.max.y - this.hitbox.min.y) / 2) + 0.1;

        const hit = this.world.castRay(ray, maxDistance, true, undefined, undefined, undefined, this.body);

        return hit !== null;
    }
}