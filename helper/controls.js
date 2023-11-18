import { FlyControls } from 'three/addons/controls/FlyControls.js';

export function initControls(camera,renderer, controls){
        function initFlyControls(camera,renderer) {
        controls = new FlyControls(camera, renderer.domElement);

        controls.movementSpeed = 50;
        controls.domElement = renderer.domElement;
        controls.rollSpeed = Math.PI / 12;
        controls.autoForward = false;
        controls.dragToLook = true;
        return controls;
    }
//set controls

   let coll = document.getElementsByClassName("collapsible");
    let i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }


// Get references to the arrow buttons and the action button
    const upButton = document.getElementById('up');
    const downButton = document.getElementById('down');
    const rightButton = document.getElementById('right');
    const leftButton = document.getElementById('left');
    const oneButton = document.getElementById('one');
    const twoButton = document.getElementById('two');
    const threeButton = document.getElementById('three');
    const fourButton = document.getElementById('four');
    const fiveButton = document.getElementById('five');
    const sixButton = document.getElementById('six');
    const QButton = document.getElementById('Q');
    const WButton = document.getElementById('W');
    const EButton = document.getElementById('E');
    const RButton = document.getElementById('R');
    const AButton = document.getElementById('A');
    const SButton = document.getElementById('S');
    const DButton = document.getElementById('D');
    const FButton = document.getElementById('F');



// Function to reset the arrow buttons to their default state
    function resetArrowButtons() {
        upButton.classList.remove('active');
        downButton.classList.remove('active');
        rightButton.classList.remove('active');
        leftButton.classList.remove('active');
    }

    // Function to reset the number buttons to their default state
    function resetNumberButtons() {
        oneButton.classList.remove('active');
        twoButton.classList.remove('active');
        threeButton.classList.remove('active');
        fourButton.classList.remove('active');
        fiveButton.classList.remove('active');
        sixButton.classList.remove('active');
        oneButton.textContent="1";
        twoButton.textContent="2";
        threeButton.textContent="3";
        fourButton.textContent="4";
        fiveButton.textContent="5";
        sixButton.textContent="6";
    }
    function resetLetterButtons() {
        QButton.classList.remove('active');
        WButton.classList.remove('active');
        EButton.classList.remove('active');
        RButton.classList.remove('active');
        AButton.classList.remove('active');
        SButton.classList.remove('active');
        DButton.classList.remove('active');
        FButton.classList.remove('active');

    }

    document.addEventListener('keydown', (event) => {
        console.log(event.key)
        switch (event.key) {
            case 'ArrowUp':
                resetArrowButtons();
                upButton.classList.add('active');
                break;
            case 'ArrowDown':
                resetArrowButtons();
                downButton.classList.add('active');
                break;
            case 'ArrowRight':
                resetArrowButtons();
                rightButton.classList.add('active');
                break;
            case 'ArrowLeft':
                resetArrowButtons();
                leftButton.classList.add('active');
                break;
            case '1' :
                resetNumberButtons();
                resetArrowButtons();
                oneButton.textContent="Fly";
                oneButton.classList.add('active');
                break;
            case '2' :
                resetNumberButtons();
                resetArrowButtons();
                twoButton.textContent="orb";
                twoButton.classList.add('active');
                break;
            case '3' :
                resetNumberButtons();
                resetArrowButtons();
                threeButton.textContent="P1";
                threeButton.classList.add('active');
                break;
            case '4' :
                resetNumberButtons();
                resetArrowButtons();
                fourButton.textContent="P2";
                fourButton.classList.add('active');
                break;
            case '5' :
                resetNumberButtons();
                resetArrowButtons();
                fiveButton.textContent="P3";
                fiveButton.classList.add('active');
                break;
            case '6' :
                resetNumberButtons();
                resetArrowButtons();
                sixButton.textContent="P4";
                sixButton.classList.add('active');
                break;
            case 'q' :
            case 'Q' :
                resetLetterButtons();
                QButton.classList.add('active');
                break;
            case 'w' :
            case 'W' :
                console.log("W")
                resetLetterButtons();
                WButton.classList.add('active');
                break;
            case 'e' :
            case 'E' :
                resetLetterButtons();
                EButton.classList.add('active');
                break;
            case 'r' :
            case 'R' :
                resetLetterButtons();
                RButton.classList.add('active');
                break;
            case 'a' :
            case 'A' :
                resetLetterButtons();
                AButton.classList.add('active');
                break;
            case 's' :
            case 'S' :
                resetLetterButtons();
                SButton.classList.add('active');
                break;
            case 'd' :
            case 'D' :
                resetLetterButtons();
                DButton.classList.add('active');
                break;
            case 'f' :
            case 'F' :
                resetLetterButtons();
                FButton.classList.add('active');
                break;
        }
    });

    document.addEventListener('keyup', () => {resetArrowButtons();resetLetterButtons()});




    return initFlyControls(camera,renderer);
}