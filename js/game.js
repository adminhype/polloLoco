//#region global variables
let canvas;
let world;
let keyboard = new Keyboard();
const worlds = [];
//#endregion

//#region game initialization
function init() {
    SoundHub.init();
    canvas = document.getElementById('canvas');
}
function startGame(screenID, buttonID) {
    SoundHub.play("background");
    canvas = document.getElementById("canvas");
    resetGameState();
    if (worlds.length === 0) {
        worlds.push(new World(canvas, keyboard));
    }
    makeScreenInvisible(screenID, buttonID);
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.classList.add('active');
    }
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) infoBtn.style.display = 'none';
}

function resetGameState() {
    if (worlds.length === 1) {
        worlds.splice(0, 1, new World(canvas, keyboard));
    }
}
//#endregion

//#region screen management
function makeScreenInvisible(screenID, buttonGroupID) {
    const screenRef = document.getElementById(screenID);
    const buttonGroupRef = document.getElementById(buttonGroupID);

    screenRef.classList.add("d-none");
    screenRef.classList.remove("d-flex");
    buttonGroupRef.classList.add("d-none");
    buttonGroupRef.classList.remove("d-flex");
}

function showStartScreen(screenID, buttonGroupID) {
    makeScreenInvisible(screenID, buttonGroupID);
    showScreen("start");
    showScreen("start-buttons");

    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) mobileControls.classList.remove('active');

    const infoButton = document.getElementById('info-btn');
    if (infoButton) infoButton.style.display = 'flex';
}

function showScreen(elementID) {
    const element = document.getElementById(elementID);
    if (!element) return;
    element.classList.remove("d-none");
    element.classList.add("d-flex");
}
//#endregion

//#region ui and overlay controls
document.addEventListener('DOMContentLoaded', () => {
    initOverlayControls();
    initMobileControls();
});

function initOverlayControls() {
    const overlay = document.getElementById('info-overlay');
    const openButton = document.getElementById('info-btn');
    const closeButton = document.getElementById('close-overlay');

    openButton.addEventListener('click', (event) => {
        event.preventDefault();
        overlay.classList.remove('d-none');
    });
    closeButton.addEventListener('click', () => overlay.classList.add('d-none'));
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) overlay.classList.add('d-none');
    });
}

function initMobileControls() {
    const buttonLeft = document.getElementById('btn-left');
    const buttonRight = document.getElementById('btn-right');
    const buttonUp = document.getElementById('btn-up');
    const buttonThrow = document.getElementById('btn-throw');
    const mobileControls = document.getElementById('mobile-controls');

    const allControlsExist = buttonLeft && buttonRight && buttonUp && buttonThrow && mobileControls;
    if (!allControlsExist) return;

    bindTouchControl(buttonLeft, 'LEFT');
    bindTouchControl(buttonRight, 'RIGHT');
    bindTouchControl(buttonUp, 'SPACE');
    bindTouchControl(buttonThrow, 'F');
    mobileControls.addEventListener('contextmenu', (event) => event.preventDefault());
}

function bindTouchControl(button, keyName) {
    button.addEventListener('touchstart', () => keyboard[keyName] = true, { passive: false });
    button.addEventListener('touchend', () => keyboard[keyName] = false, { passive: false });
}
//#endregion

//#region keyboard controls
document.addEventListener('keydown', (event) => handleKeyState(event.keyCode, true));
document.addEventListener('keyup', (event) => handleKeyState(event.keyCode, false));

function handleKeyState(keyCode, isPressed) {
    const keyMap = {
        37: 'LEFT',
        38: 'UP',
        39: 'RIGHT',
        40: 'DOWN',
        32: 'SPACE',
        70: 'F'
    };
    const key = keyMap[keyCode];
    if (key) keyboard[key] = isPressed;
}
//#endregion

console.log(`
              A           
             AAA          
            AAAAA         
           AAA AAA        
          AAA   AAA       
         AAA     AAA
        AAAAAAAAAAAAA
       AAA         AAA    
      AAA           AAA   
     AAA             AAA
     
    “The journey is the reward.” – Confucius          
`);