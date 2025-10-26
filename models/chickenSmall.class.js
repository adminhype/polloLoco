/**
 * Represents a smaller, faster variant of the chicken enemy.
 * Handles movement, animation, and death behavior.
 * Inherits from {@link MovableObject}.
 * @extends MovableObject
 */
class ChickenSmall extends MovableObject {
    //#region attributes
    /**
     * Vertical position of the small chicken.
     * @type {number}
     */
    y = 370;

    /**
     * Height of the sprite.
     * @type {number}
     */
    height = 50;

    /**
     * Width of the sprite.
     * @type {number}
     */
    width = 50;

    /**
     * Collision hitbox offset.
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = { top: 15, right: 10, bottom: 20, left: 10 };

    /**
     * File paths for walking animation frames.
     * @type {string[]}
     */
    IMAGES_WALK = ImageHub.chickenSmall.walk;

    /**
     * File paths for dead sprite frame(s).
     * @type {string[]}
     */
    IMAGES_DEAD = ImageHub.chickenSmall.dead;

    //#endregion

    /**
     * Creates a new small chicken enemy with random position and speed.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_DEAD);

        /**
         * Horizontal spawn position (randomized).
         * @type {number}
         */
        this.x = 470 + Math.random() * 2500;

        /**
         * Movement speed (randomized, faster than normal chicken).
         * @type {number}
         */
        this.speed = 3 + Math.random() * 0.25;

        /**
         * Counter for controlling animation timing.
         * @type {number}
         */
        this.animationCounter = 0;

        /**
         * Determines animation frame delay.
         * @type {number}
         */
        this.animationSpeed = 10;

        /**
         * Whether the chicken is dead.
         * @type {boolean}
         */
        this.dead = false;
    }

    //#region movement and animation
    /**
     * Moves the chicken to the left if alive.
     * Called once per frame by the {@link World}.
     * @returns {void}
     */
    moveStep = () => {
        if (!this.isDead()) this.x -= this.speed;
    };

    /**
     * Handles animation frame updates and removal after death.
     * @returns {void}
     */
    animateStep = () => {
        this.animationCounter++;
        if (this.isDead()) {
            this.img = this.imageCache[this.IMAGES_DEAD[0]];
            if (this.animationCounter > 60) this.markedForDeletion = true;
        } else if (this.animationCounter % this.animationSpeed === 0) {
            this.playAnimation(this.IMAGES_WALK);
        }
    };
    //#endregion

    //#region state handling
    /**
     * Kills the chicken if alive and plays death sound.
     * Prevents multiple death triggers.
     * @returns {void}
     */
    die = () => {
        if (!this.dead) {
            this.dead = true;
            this.speed = 0;
            this.animationCounter = 0;
            SoundHub.play("chickenDead");
        }
    };
    //#endregion
}
