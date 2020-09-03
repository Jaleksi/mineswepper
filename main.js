'use strict';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
const domEvents = new THREEx.DomEvents(camera, renderer.domElement);

const initCubes = (cubeSize, sideLength) => {
    let cubes = [];
    for (let x=0; x<sideLength; x++){
        for (let y=0; y<sideLength; y++){
            for (let z=0; z<sideLength; z++){
                cubes.push(new Cube(scene, cubeSize, x, y, z, parseInt('0x'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'))));
            };
        };
    };
    cubes.map(cube => {
        scene.add(cube.mesh);
        domEvents.addEventListener(cube.mesh, "click", event => {
            cube.remove();
            cubes = cubes.filter(item => item !== cube);
        });
        domEvents.addEventListener(cube.mesh, "mouseover", event => {
            cube.toggleHover();
        });
        domEvents.addEventListener(cube.mesh, "mouseout", event => {
            cube.toggleHover();
        });
    });
}


const render = () => {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
};

initCubes(0.1, 10);
render();
