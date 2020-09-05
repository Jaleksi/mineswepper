'use strict';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 1;
camera.position.y = 1;
camera.position.x = 1;
const renderer = new THREE.WebGLRenderer({antialias:true});
const controls = new THREE.OrbitControls(camera, renderer.domElement);
const rayCaster = new THREE.Raycaster();
const loader = new THREE.TextureLoader();
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("resize", onResize, false);
window.addEventListener("keyup", onKeyUp, false);


const boardLength = 5;
const difficulty = 0.9; // percentage of cubes that are not bombs
let morphing = false;
let morphDirection = true; // false = inwards, true = outwards
let morphStartTime = null;
let mouse = new THREE.Vector2();
let selectedCube = null;
let cubes = [];
let revealedMeshes = [];
let textures = loadAssets();
/*
    TEXTURES ORDER IN LIST:
    [plain, bomb, flag, one, two, three, four, five, six, seven, eight]
*/

const getCubeByPos = (xyzArray) => {
    const foundObject = cubes.filter(cube => {
        return cube.pos.x === xyzArray[0] &&
               cube.pos.y === xyzArray[1] &&
               cube.pos.z === xyzArray[2];
    });
    return foundObject[0];
};

const initCubes = (cubeSize, sideLength) => {
    // create cube objects
    for (let x=0; x<sideLength; x++){
        for (let y=0; y<sideLength; y++){
            for (let z=0; z<sideLength; z++){
                cubes.push(new Cube(scene, cubeSize, x, y, z, Math.random() >= difficulty));
            };
        };
    };
    // figure out number of surrouding bombs
    cubes.forEach(cube => {
        cube.updateNeighbours();
        cube.neighbourBombCount = cube.neighbours.filter(n => n.isBomb).length;
        cube.initMesh();
    });
}

const endGame = () => {
    cubes.filter(c => !c.isRevealed).forEach(c => {c.reveal();});
    selectedCube.toggleHover(false);
    selectedCube = null;
    alert("gameover");
}

const morphBoard = (currentTime) => {
    if(morphStartTime === null){
        morphStartTime = currentTime;
    }
    const deltaTime = (currentTime - morphStartTime) / 1000;
    if(deltaTime > 1){
        morphing = false;
        morphStartTime = null;
        if(morphDirection){
            // make sure cubes are aligned
            cubes.forEach(cube => {cube.resetPosition();});
        };
        return;
    }
    const middle = new THREE.Vector3(boardLength/20, boardLength/20, boardLength/20);
    const lerp = (a, b, t) => {
        return a + (b - a) * t;
    }

    const newPos = (old, mid) => {
        const multiplier = morphDirection ? -0.015 : 0.015;
        return old + (old - mid) * multiplier;
    }

    cubes.forEach(cube => {
        const nx = lerp(cube.mesh.position.x, newPos(cube.mesh.position.x, middle.x), deltaTime);
        const ny = lerp(cube.mesh.position.y, newPos(cube.mesh.position.y, middle.y), deltaTime);
        const nz = lerp(cube.mesh.position.z, newPos(cube.mesh.position.z, middle.z), deltaTime);
        cube.mesh.position.set(nx, ny, nz);
    });
}

const handleIntersection = () => {
    rayCaster.setFromCamera(mouse, camera);
    const objectsToLookFor = scene.children.filter(obj => !revealedMeshes.includes(obj));
    const intersects = rayCaster.intersectObjects(objectsToLookFor, true);
    // if any intersections
    if (intersects.length > 0){
        // get first intersection, find Cube object by mesh
        const intersectedObject = cubes.filter(cube => {
            return cube.mesh === intersects[0].object
        })[0];
        // if not the same as highlighted
        if(selectedCube !== intersectedObject){
            // remove highlight from earlier
            if(selectedCube){
                selectedCube.toggleHover();
            }
            // set new selected cube and highlight
            selectedCube = intersectedObject;
            selectedCube.toggleHover();
        }
    // didn't intersect with any cube
    } else {
        // remove highlight from earlier selection if exists
        if(selectedCube){
            selectedCube.toggleHover();
        }
        selectedCube = null;
    }

}

const animate = (timeNow) => {
    requestAnimationFrame(animate);
    if(morphing){
        morphBoard(timeNow);
    }
    handleIntersection();
    controls.update();
    renderer.render(scene, camera);
};

loadAssets();
initCubes(0.1, boardLength);
animate();
