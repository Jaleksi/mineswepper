class Cube {
    constructor(scene, size, x, y, z, isBomb){
        this.isBomb = isBomb;
        this.texture = null;
        this.parentScene = scene;
        this.size = size;
        this.hoverColor = 0x8ffb4;
        this.color = 0xffffff;
        this.pos = {x: x, y: y, z: z};
        this.hovered = false;
        this.neighbours = null;
        this.neighbourBombCount = null;
        this.isRevealed = false;
        this.markedAsBomb = false;
    }

    initMesh(){
        this.texture = textures[0];
        this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            side: THREE.DoubleSide,
            transparent: true
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = this.pos.x * this.size;
        this.mesh.position.y = this.pos.y * this.size;
        this.mesh.position.z = this.pos.z * this.size;
        this.parentScene.add(this.mesh);
    }

    resetPosition(){
        this.mesh.position.x = this.pos.x * this.size;
        this.mesh.position.y = this.pos.y * this.size;
        this.mesh.position.z = this.pos.z * this.size;
    }

    updateTexture(){
        this.mesh.material.map = this.isBomb ? textures[1] :
                                 this.neighbourBombCount == 0 ?
                                 textures[0] :
                                 textures[Math.min(this.neighbourBombCount + 2, 10)];
        this.mesh.material.opacity = this.neighbourBombCount != 0 && this.isRevealed && !this.isBomb ?
                                     0.3 : 1;
        this.mesh.material.needsUpdate = true;
    }

    removeMesh(){
        this.geometry.dispose();
        this.material.dispose();
        this.parentScene.remove(this.mesh);
    }

    toggleHover(state=null){
        this.hovered = state == null ? !this.hovered : state;
        this.mesh.material.color.setHex(this.hovered ? this.hoverColor : this.color);
        this.mesh.material.needsUpdate = true;
    }

    updateNeighbours() {
        this.neighbours = this.getNeighbourIndexes().map(xyz => getCubeByPos(xyz)).filter(c => c !== undefined);
    }

    reveal(recursively=true) {
        this.isRevealed = true;
        this.toggleHover(false);
        revealedMeshes.push(this.mesh);
        this.updateTexture();
        if(this.neighbourBombCount == 0 && recursively){
            this.updateNeighbours();
            this.removeMesh();
            this.neighbours.forEach(neighbour => {
                if(neighbour.neighbourBombCount <= 1 && !neighbour.isRevealed){
                    neighbour.reveal();
                }
            });
        }
    }

    getNeighbourIndexes(){
        let neighbourIndexes = [];
        const validIndex = (x, y, z) => {
            if(x < 0 || x > boardLength-1 || y < 0 || y > boardLength-1 || z < 0 || z > boardLength-1){
                return false;
            };
            return true;
        };

        for(let x=-1; x<2; x++){
            for(let y=-1; y<2; y++){
                for(let z=-1; z<2; z++){
                    if(!x && !y && !z){
                        continue;
                    }
                    let nx = this.pos.x + x;
                    let ny = this.pos.y + y;
                    let nz = this.pos.z + z;
                    if(validIndex(nx, ny, nz)){
                        neighbourIndexes.push([nx, ny, nz]);
                    };
                }
            }
        }
        return neighbourIndexes;
    }
}
