export class Controls {
    constructor(player, renderer) {
        this.player = player;
        this.renderer = renderer;

        this.keys = {};
        this.mouseSensitivity = 0.001;

        // Event listeners
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("mousemove", this.onMouseMove);
        this.renderer.domElement.addEventListener("click", this.onClick);
    }

    onKeyDown = (event) => {
        this.keys[event.key.toLowerCase()] = true;
    }

    onKeyUp = (event) => {
        this.keys[event.key.toLowerCase()] = false;
    }

    onMouseMove = (event) => {
        if (document.pointerLockElement !== this.renderer.domElement) return;

        this.player.look(event.movementX * this.mouseSensitivity, event.movementY * this.mouseSensitivity);
    }

    onClick = () => {
        this.renderer.domElement.requestPointerLock();
    }

    query(key) {
        return Boolean(this.keys[key]);
    }

    update() {
        const forwardInput = Number(this.query("w")) - Number(this.query("s"));
        const strafeInput = Number(this.query("d")) - Number(this.query("a"));
        const sprint = this.query("shift") && this.query("w");

        this.player.move(forwardInput, strafeInput, sprint);

        if (this.query(" ")) {
            this.player.jump()
        }
    }

    dispose() {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        window.removeEventListener("mousemove", this.onMouseMove);
        this.renderer.domElement.removeEventListener("click", this.onClick);
    }
}