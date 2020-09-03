class Cube {
    constructor(scene, size, x, y, z, texture){
        this.texture = texture;
        this.parentScene = scene;
        this.size = size;
        this.hoverColor = 0x8ffb4;
        this.color = 0xffffff;
        this.pos = {x: x, y: y, z: z};
        this.hovered = false;
        this.initMesh();
    }

    initMesh(){
        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        this.material = new THREE.MeshBasicMaterial({map: this.texture});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = this.pos.x * this.size;
        this.mesh.position.y = this.pos.y * this.size;
        this.mesh.position.z = this.pos.z * this.size;
        this.parentScene.add(this.mesh);
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
