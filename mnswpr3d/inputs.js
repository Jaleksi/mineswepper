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

const onKeyUp = (e) => {
    e.preventDefault();
    switch(e.keyCode) {
        case 32:
            if(selectedCube){
                if(selectedCube.isBomb){
                    endGame();
                    return;
                }
                selectedCube.reveal();
                selectedCube = null;
                break;
            }
        case 69:
            if(morphing){
                return;
            }
            morphing = true;
            morphDirection = !morphDirection;
            break;
    }
}
