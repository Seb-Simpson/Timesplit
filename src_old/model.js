import { GLTFLoader } from 'https://unpkg.com/three@0.170.0/examples/jsm/loaders/GLTFLoader.js';
import { Object } from "./object.js"

const loader = new GLTFLoader();

export class Model extends Object {
    constructor(scene, fileName, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1) {
        super(scene);

        loader.load(
            `public/assets/models/${fileName}.glb`,
            (gltf) => {
                let model = gltf.scene;
                model.scale.set(scale, scale, scale)
                this.setUp(model, position, rotation)
            }
        );
    }
}