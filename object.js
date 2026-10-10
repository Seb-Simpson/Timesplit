export class Object {
    constructor(scene) {
        this.scene = scene;
    }

    setUp(object, position = [0, 0, 0], rotation = [0, 0, 0]) {
        this.object = object;
        this.scene.add(this.object)

        this.setPosition(...position);
        this.setRotation(...rotation);
    }

    setPosition(x = null, y = null, z = null) {
        if (!this.object) return;

        if (x === null) x = this.object.position.x;
        if (y === null) y = this.object.position.y;
        if (z === null) z = this.object.position.z;

        this.object.position.set(x, y, z);
    }

    move(x = 0, y = 0, z = 0) {
        if (!this.object) return;

        this.object.position.x += x
        this.object.position.y += y
        this.object.position.z += z
    }

    setRotation(x = null, y = null, z = null) {
        if (!this.object) return;

        if (x === null) x = this.object.rotation.x;
        if (y === null) y = this.object.rotation.y;
        if (z === null) z = this.object.rotation.z;

        this.object.rotation.set(x, y, z);
    }

    rotate(x = 0, y = 0, z = 0) {
        if (!this.object) return;

        this.object.rotation.x += x
        this.object.rotation.y += y
        this.object.rotation.z += z
    }
}