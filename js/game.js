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

    document.getElementById("start").classList.remove("d-none");
    document.getElementById("start").classList.add("d-flex");

    document.getElementById("start-buttons").classList.remove("d-none");
    document.getElementById("start-buttons").classList.add("d-flex");
    const mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
        mobileControls.classList.remove('active');
    }
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) infoBtn.style.display = 'flex';
}
//#endregion

//#region ui and overlay controls
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('info-overlay');
    const openBtn = document.getElementById('info-btn');
    const closeBtn = document.getElementById('close-overlay');

    //overlay open/close
    openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.remove('d-none');
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.add('d-none');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.add('d-none');
    });

    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnUp = document.getElementById('btn-up');
    const btnThrow = document.getElementById('btn-throw');
    const mobileControls = document.getElementById('mobile-controls');

    // mobile touch controls

    if (btnLeft && btnRight && btnUp && btnThrow && mobileControls) {
        btnLeft.addEventListener('touchstart', () => keyboard.LEFT = true, { passive: false });
        btnLeft.addEventListener('touchend', () => keyboard.LEFT = false, { passive: false });
        btnRight.addEventListener('touchstart', () => keyboard.RIGHT = true, { passive: false });
        btnRight.addEventListener('touchend', () => keyboard.RIGHT = false, { passive: false });
        btnUp.addEventListener('touchstart', () => keyboard.SPACE = true, { passive: false });
        btnUp.addEventListener('touchend', () => keyboard.SPACE = false, { passive: false });
        btnThrow.addEventListener('touchstart', () => keyboard.F = true, { passive: false });
        btnThrow.addEventListener('touchend', () => keyboard.F = false, { passive: false });
        mobileControls.addEventListener('contextmenu', (e) => e.preventDefault());
    }
});
//#endregion

//#region keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.keyCode == 39) { // 39 is key →
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 37) { // 37 is key ←
        keyboard.LEFT = true;
    }
    if (e.keyCode == 38) { // 38 is key ↑
        keyboard.UP = true;
    }
    if (e.keyCode == 40) { // 40 is key ↓
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) { // 32 is key space
        keyboard.SPACE = true;
    }
    if (e.keyCode == 70) { // 70 is key F
        keyboard.F = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.keyCode == 39) { // 39 is key →
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 37) { // 37 is key ←
        keyboard.LEFT = false;
    }
    if (e.keyCode == 38) { // 38 is key ↑
        keyboard.UP = false;

    } if (e.keyCode == 40) { // 40 is key ↓
        keyboard.DOWN = false;

    } if (e.keyCode == 32) { // 32 is key space
        keyboard.SPACE = false;
    }
    if (e.keyCode == 70) { // 70 is key F
        keyboard.F = false;
    }
});
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