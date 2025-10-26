/**
 * The main game controller class that manages the game world, including
 * the player, level, enemies, physics, collisions, rendering, and UI.
 *
 * Acts as the central update and rendering loop for the entire game.
 */
class World {
    //#region attributes
    /**
     * The main playable character.
     * @type {Character}
     */
    character = new Character();

    /**
     * The current level containing enemies, background, and collectibles.
     * @type {Level}
     */
    level = new Level();

    /**
     * Rendering context for the HTML canvas.
     * @type {CanvasRenderingContext2D}
     */
    ctx;

    /**
     * The canvas element where the game is drawn.
     * @type {HTMLCanvasElement}
     */
    canvas;

    /**
     * Object containing the current keyboard input states.
     * @type {Keyboard}
     */
    keyboard;

    /**
     * Horizontal camera offset used for world scrolling.
     * @type {number}
     */
    camera_x = 0;

    /**
     * Indicates if the game loop is currently running.
     * @type {boolean}
     */
    isRunning = true;

    /**
     * Displays the player's health.
     * @type {StatusBar}
     */
    statusBar = new StatusBar();

    /**
     * Displays the number of collected bottles.
     * @type {BottleBar}
     */
    bottlBar = new BottleBar();

    /**
     * Displays the number of collected coins.
     * @type {CoinBar}
     */
    coinBar = new CoinBar();

    /**
     * Displays the Endboss’s remaining energy.
     * @type {StatusBarEndboss}
     */
    endbossBar = new StatusBarEndboss();

    /**
     * Active thrown bottles currently in motion.
     * @type {ThrowableObject[]}
     */
    throwableObjects = [];

    /**
     * All bottles the player has collected.
     * @type {Bottle[]}
     */
    collectedBottles = [];

    /**
     * All coins the player has collected.
     * @type {Coin[]}
     */
    collectedCoins = [];
    //#endregion

    /**
     * Creates a new world instance, binds the canvas, and starts the rendering loop.
     *
     * @param {HTMLCanvasElement} canvas - The canvas where the game is drawn.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
    }

    //#region setup
    /**
     * Binds the character to this world so it can access global game state and camera.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
    }
    //#endregion

    //#region input and throwing logic
    /**
     * Checks for player input and creates a new throwable bottle if conditions are met.
     * Includes cooldown logic to prevent spamming.
     * @returns {void}
     */
    checkThrowObjects() {
        if (this.character.isSleeping()) return;

        const now = Date.now();
        const cooldown = 300;
        const canThrow =
            this.keyboard.F &&
            this.bottlBar.percentage > 0 &&
            !this.character.otherDirection &&
            (!this.lastThrowTime || now - this.lastThrowTime > cooldown);
        if (!canThrow) return;
        const offsetX = this.character.width - 20;
        const offsetY = this.character.height / 2;
        const bottle = new ThrowableObject(
            this.character.x + offsetX,
            this.character.y + offsetY
        );
        this.throwableObjects.push(bottle);
        this.bottlBar.setPercentage(this.bottlBar.percentage - 20);
        this.lastThrowTime = now;
    }
    //#endregion

    //#region collision detection
    /**
     * Runs all collision checks between the character, enemies, collectibles, and projectiles.
     * @returns {void}
     */
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleCollisions();
        this.checkCoinCollisions();
        this.checkThrowableCollisions();
    }

    /**
     * Checks for collisions between the player and enemies, handling both hits and stomps.
     * @returns {void}
     */
    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (!this.character.isColliding(enemy) || enemy.isDead()) return;
            if (enemy instanceof Endboss) return this.handleBossHit();

            const feet = this.character.y + this.character.height;
            const stomp = this.character.speedY < 0 && feet <= enemy.y + enemy.height;
            stomp ? enemy.die() : this.handlePlayerHit();
        });
    }

    /**
     * Handles when the player collides with the boss.
     * @returns {void}
     */
    handleBossHit() {
        if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    /**
     * Handles when the player is damaged by an enemy.
     * @returns {void}
     */
    handlePlayerHit() {
        if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    /**
     * Detects when the player collects bottles.
     * @returns {void}
     */
    checkBottleCollisions() {
        this.level.salsaBottles = this.level.salsaBottles.filter(bottle => {
            if (!this.character.isColliding(bottle)) return true;
            this.collectBottle(bottle);
            return false;
        });
    }

    /**
     * Handles adding a collected bottle to inventory and updating the UI.
     * @param {Bottle} bottle - The collected bottle object.
     * @returns {void}
     */
    collectBottle(bottle) {
        this.collectedBottles.push(bottle);
        this.bottlBar.setPercentage(Math.min(100, this.bottlBar.percentage + 20));
        SoundHub.play("bottleCollect");
    }

    /**
     * Detects and handles coin collection by the player.
     * @returns {void}
     */
    checkCoinCollisions() {
        this.level.coins = this.level.coins.filter(coin => {
            if (this.character.isColliding(coin)) {
                this.collectedCoins.push(coin);
                this.coinBar.setPercentage(Math.min(100, this.coinBar.percentage + 20));
                SoundHub.play("coin");
                return false;
            }
            return true;
        });
    }

    /**
     * Handles collisions between thrown bottles and enemies (including the boss).
     * @returns {void}
     */
    checkThrowableCollisions() {
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(enemy => {
                if (!bottle.isColliding(enemy) || enemy.isDead()) return;
                this.handleBottleHit(enemy, bottle);
            });
        });
    }

    /**
     * Handles the result of a bottle colliding with an enemy.
     * @param {MovableObject} enemy - The enemy hit by the bottle.
     * @param {ThrowableObject} bottle - The bottle that caused the hit.
     * @returns {void}
     */
    handleBottleHit(enemy, bottle) {
        if (enemy instanceof Endboss) {
            enemy.takeHit(20);
            this.endbossBar.setBossEnergy(enemy.energy);
        } else {
            enemy.die();
        }
        bottle.markedForDeletion = true;
    }
    //#endregion

    //#region game state handling
    /**
     * Triggers the game over state and displays the corresponding screen.
     * @returns {void}
     */
    gameOver() {
        this.isRunning = false;
        SoundHub.stopLoop("footstep");
        SoundHub.play("gameover");
        document.getElementById("gameover").classList.replace("d-none", "d-flex");
        document.getElementById("gameover-buttons").classList.replace("d-none", "d-flex");
    }

    /**
     * Triggers the win screen and stops the game loop.
     * @returns {void}
     */
    winGame() {
        this.isRunning = false;
        SoundHub.stopLoop("footstep");
        SoundHub.play("win");
        document.getElementById("win").classList.replace("d-none", "d-flex");
        document.getElementById("win-buttons").classList.replace("d-none", "d-flex");
    }
    //#endregion

    //#region rendering
    /**
     * Main rendering loop — updates physics, logic, and draws all objects.
     * Uses requestAnimationFrame for smooth animation.
     * @returns {void}
     */
    draw() {
        if (!this.isRunning) return;
        this.clearCanvas();
        this.renderWorld();
        this.renderUI();
        this.update();
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Clears the canvas before each frame.
     * @returns {void}
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws all world elements (background, enemies, player, etc.) with camera offset.
     * @returns {void}
     */
    renderWorld() {
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        const worldObjects = [
            this.level.backgroundObjects,
            this.level.clouds,
            this.throwableObjects,
            this.level.salsaBottles,
            this.level.coins,
            this.level.enemies
        ];
        worldObjects.forEach(obj => this.addObjectsToMap(obj));
        this.addToMap(this.character);
        this.ctx.restore();
    }

    /**
     * Draws all HUD elements such as status bars and icons.
     * @returns {void}
     */
    renderUI() {
        [this.statusBar, this.bottlBar, this.coinBar, this.endbossBar].forEach(ui =>
            this.addToMap(ui)
        );
    }
    //#endregion

    //#region game logic update
    /**
     * Updates all world entities, animations, and checks win/lose conditions.
     * @returns {void}
     */
    update() {
        this.checkCollisions();
        this.checkThrowObjects();
        this.character.applyGravity();
        this.character.characterMovement();
        this.character.characterAnimation();
        this.level.enemies.forEach(e => {
            e.moveStep?.(this.character);
            e.animateStep?.(this.character);
        });
        this.level.enemies = this.level.enemies.filter(e => !e.markedForDeletion);
        this.throwableObjects = this.throwableObjects.filter(o => !o.markedForDeletion);
        if (this.character.energy <= 0 && this.isRunning) this.gameOver();
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (!endboss && this.isRunning) this.winGame();
    }
    //#endregion

    //#region rendering helpers
    /**
     * Adds multiple objects to the rendering pipeline.
     * Updates or animates them if necessary.
     * @param {DrawableObject[]} objects - The objects to draw.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => {
            if (obj instanceof ThrowableObject || obj instanceof Coin) {
                obj.update?.();
                obj.animate?.();
            }
            this.addToMap(obj);
        });
    }

    /**
     * Draws a single object to the canvas, handling flipping for direction.
     * @param {DrawableObject} moObject - The object to draw.
     * @returns {void}
     */
    addToMap(moObject) {
        if (moObject.otherDirection) this.flipImage(moObject);
        moObject.draw(this.ctx);
        if (moObject.otherDirection) this.flipImageBack(moObject);
    }

    /**
     * Flips the image horizontally before drawing (for facing left).
     * @param {DrawableObject} moObject - The object being flipped.
     * @returns {void}
     */
    flipImage(moObject) {
        this.ctx.save();
        this.ctx.translate(moObject.width, 0);
        this.ctx.scale(-1, 1);
        moObject.x *= -1;
    }

    /**
     * Restores the original orientation after drawing a flipped object.
     * @param {DrawableObject} moObject - The object being restored.
     * @returns {void}
     */
    flipImageBack(moObject) {
        moObject.x *= -1;
        this.ctx.restore();
    }
    //#endregion
}