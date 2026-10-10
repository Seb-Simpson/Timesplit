import * as THREE from 'three';
import * as CONSTANTS from "./settings.js"
import { Object } from "./object.js"

const geometry = new THREE.BoxGeometry(CONSTANTS.blockSize, CONSTANTS.blockSize, CONSTANTS.blockSize);
const materials = {}

function getMaterial(colour) {
    if (!materials[colour]) {
        const material = new THREE.MeshBasicMaterial({color: colour});
        materials[colour] = material;
    }

    return materials[colour];
}

export class Block extends Object{
    constructor(scene, position, colour) {
        super(scene);

        this.mesh = new THREE.Mesh(geometry, getMaterial(colour));

        this.setUp(this.mesh, position)
    }
}