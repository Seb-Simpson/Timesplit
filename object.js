import { GLTFLoader } from 'https://unpkg.com/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export class Object {
    constructor(scene, fileName, position = [0, 0, 0], rotation = [0, 0, 0]) {
        this.scene = scene;

        loader.load(
            `${fileName}.glb`,
            (gltf) => {
                this.model = gltf.scene;
                this.model.position.set(...position)
                this.model.rotation.set(...rotation)
                this.scene.add(this.model);
            }
        );
    }

    setPosition(x = null, y = null, z = null) {
        if (!this.model) return;

        if (x === null) x = this.model.position.x;
        if (y === null) y = this.model.position.y;
        if (z === null) z = this.model.position.z;

        this.model.rotation.set(x, y, z);
    }

    move(x = 0, y = 0, z = 0) {
        if (!this.model) return;

        this.model.position.x += x
        this.model.position.y += y
        this.model.position.z += z
    }

    setRotation(x = null, y = null, z = null) {
        if (!this.model) return;

        if (x === null) x = this.model.rotation.x;
        if (y === null) y = this.model.rotation.y;
        if (z === null) z = this.model.rotation.z;

        this.model.rotation.set(x, y, z);
    }

    rotate(x = 0, y = 0, z = 0) {
        if (!this.model) return;

        this.model.rotation.x += x
        this.model.rotation.y += y
        this.model.rotation.z += z
    }
}