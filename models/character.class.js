/**
 * Represents the main player character (Pepe).
 * Handles movement, animation, sound, and interaction with the world.
 * Inherits from {@link MovableObject}.
 * @extends MovableObject
 */
class Character extends MovableObject {
    //#region attributes
    /**
     * The movement speed of the character.
     * @type {number}
     */
    speed = 10;
    /**
     * The vertical position of the character.
     * @type {number}
     */
    y = 120;
    /**
     * The height of the character sprite.
     * @type {number}
     */
    height = 250;

    /**
     * Offset used for collision detection.
     * @type {{ top: number, right: number, bottom: number, left: number }}
     */
    offset = {
        top: 100,
        right: 30,
        bottom: 10,
        left: 30
    };
    /**
     * Delay in seconds before the character starts sleeping.
     * @type {number}
     */
    SLEEP_DELAY = 2;
    /**
     * Delay between jump frames in milliseconds.
     * @type {number}
     */
    JUMP_FRAME_DELAY = 200;
    /**
     * Whether the character is currently snoring.
     * @type {boolean}
     */
    isSnoring = false;
    /**
     * Image paths for idle animation.
     * @type {string[]}
     */
    IMAGES_IDLE = ImageHub.pepe.idle;
    /**
     * Image paths for walking animation.
     * @type {string[]}
     */
    IMAGES_WALK = ImageHub.pepe.walk;
    /**
     * Image paths for jumping animation.
     * @type {string[]}
     */
    IMAGES_JUMP = ImageHub.pepe.jump;
    /**
     * Image paths for death animation.
     * @type {string[]}
     */
    IMAGES_DEAD = ImageHub.pepe.dead;
    /**
     * Image paths for hurt animation.
     * @type {string[]}
     */
    IMAGES_HURT = ImageHub.pepe.hurt;
    /**
     * Image paths for sleeping animation.
     * @type {string[]}
     */
    IMAGES_SLEEP = ImageHub.pepe.longIdle;
    /**
     * Reference to the current game world.
     * @type {World}
     */
    world;
    //#endregion

    /**
     * Creates a new playable character and loads all animation images.
     */
    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.lastAction = this.getNow();
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEP);
        this.animationSpeed = 8;
        this.animationCounter = 0;
    }

    //#region movement
    /**
     * Makes the character jump and plays the jump sound.
     */
    jump() {
        this.speedY = 25;
        SoundHub.play("jump");
    }

    /**
     * Handles all character movement logic including camera movement.
     */
    characterMovement() {
        const moved = this.handleMovementInput();
        this.handleFootstepSound(moved);
        if (moved) this.lastAction = this.getNow();
        this.world.camera_x = -this.x + 100;
    }

    /**
     * Checks input keys and moves the character accordingly.
     * @returns {boolean} True if the character moved.
     */
    handleMovementInput() {
        let moved = false;
        const keys = this.world.keyboard;
        if (keys.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight(); this.otherDirection = false; moved = true;
        }
        if (keys.LEFT && this.x > 0) {
            this.moveLeft(); this.otherDirection = true; moved = true;
        }
        if (keys.SPACE && !this.isAboveGround()) {
            this.jump(); moved = true;
        }
        return moved;
    }

    /**
     * Starts or stops the footstep sound based on movement state.
     * @param {boolean} moved - Whether the character is moving.
     */
    handleFootstepSound(moved) {
        if (moved && !this.isAboveGround()) SoundHub.startLoop("footstep");
        else SoundHub.stopLoop("footstep");
    }
    //#endregion

    //#region animation
    /**
     * Controls all animation states depending on character status.
     */
    characterAnimation() {
        this.animationCounter++;
        if (this.isDead())
            return this.playWithDelay(this.IMAGES_DEAD);
        if (this.isHurt())
            return this.playWithDelay(this.IMAGES_HURT);
        if (this.isAboveGround())
            return this.playJumpAnimation();
        this.handleGroundAnimations();
    }

    /**
     * Handles idle, walk, and sleep animations while on the ground.
     */
    handleGroundAnimations() {
        const keys = this.world.keyboard;
        if (keys.RIGHT || keys.LEFT) this.playWithDelay(this.IMAGES_WALK);
        else if (this.isSleeping()) this.playWithDelay(this.IMAGES_SLEEP);
        else this.playWithDelay(this.IMAGES_IDLE);
    }

    /**
     * Plays an animation sequence with delay.
     * @param {string[]} images - List of image paths to play as animation.
     */
    playWithDelay(images) {
        if (this.animationCounter % this.animationSpeed === 0) {
            this.playAnimation(images);
        }
    }

    /**
     * Plays jump animation frames with a controlled frame delay.
     */
    playJumpAnimation() {
        const now = this.getNow();
        if (!this.lastJumpFrameTime || now - this.lastJumpFrameTime > this.JUMP_FRAME_DELAY) {
            this.playAnimation(this.IMAGES_JUMP);
            this.lastJumpFrameTime = now;
        }
    }
    //#endregion

    //#region helpers
    /**
     * Returns the current timestamp.
     * @returns {number} Current time in milliseconds.
     */
    getNow() {
        return new Date().getTime();
    }

    /**
     * Checks if the character should play the sleeping animation.
     * Also handles snoring sound logic.
     * @returns {boolean} True if the character is sleeping.
     */
    isSleeping() {
        let idleTime = (this.getNow() - this.lastAction) / 1000;
        let sleeping = idleTime > this.SLEEP_DELAY;
        if (sleeping && !this.isSnoring) {
            SoundHub.startLoop("snoring");
            this.isSnoring = true;
        }
        if (!sleeping && this.isSnoring) {
            SoundHub.stopLoop("snoring");
            this.isSnoring = false;
        }
        return sleeping;
    }
    //#endregion
}