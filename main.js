'use strict';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
const rayCaster = new THREE.Raycaster();
const loader = new THREE.TextureLoader();

let mouse = new THREE.Vector2();
let selectedCube = null;

let cubes = [];
let textures = {};

const loadAssets = () => {
    for(let img in base64_imgs){
        if(Object.prototype.hasOwnProperty.call(base64_imgs, img)){
            const image = new Image();
            image.src = base64_imgs[img];
            const texture = new THREE.Texture();
            texture.image = image;
            image.onload = () => {texture.needsUpdate = true;}
            textures[img] = texture;
        }
    }
}


const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

const onMouseMove = (e) => {
    e.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

const onKeyPress = (e) => {
    e.preventDefault();
    if(e.keyCode === 32 && selectedCube){
        selectedCube.remove();
        selectedCube = null;
    }
}

document.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("resize", onResize, false);
window.addEventListener("keypress", onKeyPress, false);




const initCubes = (cubeSize, sideLength) => {
    for (let x=0; x<sideLength; x++){
        for (let y=0; y<sideLength; y++){
            for (let z=0; z<sideLength; z++){
                cubes.push(new Cube(scene, cubeSize, x, y, z, textures.plain));
            };
        };
    };
}

const handleIntersection = () => {
    rayCaster.setFromCamera(mouse, camera);
    const intersects = rayCaster.intersectObjects(cubes.map(cube => cube.mesh));
    // if any intersections
    if (intersects.length > 0){
        // get first intersection, find Cube object by mesh
        const intersectedObject = cubes.filter(cube => {
            return cube.mesh === intersects[0].object
        })[0];
        // if not the same as highlighted
        if(selectedCube != intersectedObject){
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



const render = () => {
    requestAnimationFrame(render);
    handleIntersection();
    controls.update();
    renderer.render(scene, camera);
};

loadAssets();
initCubes(0.1, 10);
render();
