class Cube {
    constructor(scene, size, x, y, z, color){
        this.parentScene = scene;
        this.size = size;
        this.color = color;
        this.hoverColor = 0x8e0000;
        this.pos = {x: x, y: y, z: z};
        this.hovered = false;

        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        this.material = new THREE.MeshBasicMaterial({color: this.color});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = this.pos.x * this.size;
        this.mesh.position.y = this.pos.y * this.size;
        this.mesh.position.z = this.pos.z * this.size;
    }

    remove(){
        this.geometry.dispose();
        this.material.dispose();
        this.parentScene.remove(this.mesh);
    }

    toggleHover(){
        this.hovered = !this.hovered;
        this.mesh.material.color.setHex(this.hovered ? this.hoverColor : this.color);
    }
}
