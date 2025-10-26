/**
 * @fileoverview Main game script for El Pollo Loco.
 * Handles initialization, screen management, controls, and game state handling.
 * @module Game
 */

//#region global variables
/** @type {HTMLCanvasElement} */
let canvas;

/** @type {World} */
let world;

/** @type {Keyboard} */
let keyboard = new Keyboard();

/** @type {World[]} */
const worlds = [];
//#endregion

//#region game initialization
/**
 * Initializes the game sound and canvas.
 * @returns {void}
 */
function init() {
    SoundHub.init();
    canvas = document.getElementById('canvas');
}

/**
 * Starts a new game instance, sets up the world and UI visibility.
 * @param {string} screenID - The ID of the start screen element to hide.
 * @param {string} buttonID - The ID of the button group to hide.
 * @returns {void}
 */
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

/**
 * Resets the game state by creating a new world instance.
 * @returns {void}
 */
function resetGameState() {
    if (worlds.length === 1) {
        worlds.splice(0, 1, new World(canvas, keyboard));
    }
}
//#endregion

//#region screen management
/**
 * Hides a specific screen and button group.
 * @param {string} screenID - ID of the screen element to hide.
 * @param {string} buttonGroupID - ID of the button group to hide.
 * @returns {void}
 */
function makeScreenInvisible(screenID, buttonGroupID) {
    const screenRef = document.getElementById(screenID);
    const buttonGroupRef = document.getElementById(buttonGroupID);

    screenRef.classList.add("d-none");
    screenRef.classList.remove("d-flex");
    buttonGroupRef.classList.add("d-none");
    buttonGroupRef.classList.remove("d-flex");
}

/**
 * Displays the start screen again after the game ends.
 * @param {string} screenID - The game screen ID to hide.
 * @param {string} buttonGroupID - The button group ID to hide.
 * @returns {void}
 */
function showStartScreen(screenID, buttonGroupID) {
    makeScreenInvisible(screenID, buttonGroupID);
    showScreen("start");
    showScreen("start-buttons");

    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) mobileControls.classList.remove('active');

    const infoButton = document.getElementById('info-btn');
    if (infoButton) infoButton.style.display = 'flex';
}

/**
 * Shows a specific screen by ID.
 * @param {string} elementID - The ID of the element to display.
 * @returns {void}
 */
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

/**
 * Initializes the information overlay controls (open/close buttons).
 * @returns {void}
 */
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

/**
 * Initializes mobile control buttons (touch input).
 * @returns {void}
 */
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

/**
 * Binds a specific touch control to a virtual keyboard key.
 * @param {HTMLElement} button - The control button element.
 * @param {string} keyName - The virtual keyboard key name (e.g., "LEFT", "F").
 * @returns {void}
 */
function bindTouchControl(button, keyName) {
    button.addEventListener('touchstart', () => keyboard[keyName] = true, { passive: false });
    button.addEventListener('touchend', () => keyboard[keyName] = false, { passive: false });
}
//#endregion

//#region keyboard controls
document.addEventListener('keydown', (event) => handleKeyState(event.keyCode, true));
document.addEventListener('keyup', (event) => handleKeyState(event.keyCode, false));

/**
 * Updates the keyboard key state based on a key press or release.
 * @param {number} keyCode - The numeric key code from the event.
 * @param {boolean} isPressed - Whether the key is pressed or released.
 * @returns {void}
 */
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