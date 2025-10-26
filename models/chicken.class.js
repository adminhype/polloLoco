/**
 * Represents a normal chicken enemy.
 * Handles walking, dying, and animation playback.
 * Inherits from {@link MovableObject}.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
    //#region attributes
    /**
     * Vertical position of the chicken.
     * @type {number}
     */
    y = 350;

    /**
     * Height of the chicken sprite.
     * @type {number}
     */
    height = 70;

    /**
     * Width of the chicken sprite.
     * @type {number}
     */
    width = 70;

    /**
     * Collision offset for hitbox adjustments.
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = { top: 10, right: 5, bottom: 10, left: 5 };

    /**
     * Image paths for walking animation.
     * @type {string[]}
     */
    IMAGES_WALK = ImageHub.chickenNormal.walk;

    /**
     * Image paths for dead state.
     * @type {string[]}
     */
    IMAGES_DEAD = ImageHub.chickenNormal.dead;
    //#endregion

    /**
     * Creates a new chicken instance with randomized position and speed.
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
         * Movement speed (randomized).
         * @type {number}
         */
        this.speed = 0.2 + Math.random() * 0.25;

        /**
         * Counter for controlling animation timing.
         * @type {number}
         */
        this.animationCounter = 0;

        /**
         * How many frames between animation changes.
         * @type {number}
         */
        this.animationSpeed = 8;

        /**
         * Whether the chicken is dead.
         * @type {boolean}
         */
        this.dead = false;
    }

    //#region movement and animation
    /**
     * Moves the chicken to the left if it is alive.
     * Called once per update frame by the {@link World}.
     * @returns {void}
     */
    moveStep = () => {
        if (!this.isDead()) this.x -= this.speed;
    };

    /**
     * Handles the animation frame updates and removal after death.
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
     * Kills the chicken, stops movement and plays the death sound.
     * @returns {void}
     */
    die = () => {
        this.dead = true;
        this.energy = 0;
        this.speed = 0;
        this.animationCounter = 0;
        SoundHub.play("chickenDead");
    };
    //#endregion
}