/**
 * Represents the final boss enemy (the "Endboss") in the game.
 * The boss reacts to the player's proximity, attacks, takes damage,
 * and can eventually die. Inherits movement and animation from {@link MovableObject}.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
    //#region attributes
    /**
     * Height of the boss sprite in pixels.
     * @type {number}
     */
    height = 400;

    /**
     * Width of the boss sprite in pixels.
     * @type {number}
     */
    width = 250;

    /**
     * Vertical position on the canvas.
     * @type {number}
     */
    y = 50;

    /**
     * Hitbox offset for collisions.
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = { top: 60, right: 30, bottom: 30, left: 30 };

    /**
     * Walking animation image paths.
     * @type {string[]}
     */
    IMAGES_WALK = ImageHub.enemieBossChicken.walk;

    /**
     * Alert (idle) animation image paths.
     * @type {string[]}
     */
    IMAGES_ALERT = ImageHub.enemieBossChicken.alert;

    /**
     * Attack animation image paths.
     * @type {string[]}
     */
    IMAGES_ATTACK = ImageHub.enemieBossChicken.attack;

    /**
     * Hurt animation image paths.
     * @type {string[]}
     */
    IMAGES_HURT = ImageHub.enemieBossChicken.hurt;

    /**
     * Death animation image paths.
     * @type {string[]}
     */
    IMAGES_DEAD = ImageHub.enemieBossChicken.dead;
    //#endregion

    /**
     * Creates a new Endboss instance and loads all animations.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);

        [this.IMAGES_WALK, this.IMAGES_ALERT, this.IMAGES_ATTACK,
        this.IMAGES_HURT, this.IMAGES_DEAD].forEach(imgs => this.loadImages(imgs));

        /**
         * Horizontal start position (far right of the level).
         * @type {number}
         */
        this.x = 3000;

        /**
         * Counter for animation frame updates.
         * @type {number}
         */
        this.animationCounter = 0;

        /**
         * Frame delay for animation timing.
         * @type {number}
         */
        this.animationSpeed = 15;

        /**
         * Index of the current frame during the death animation.
         * @type {number}
         */
        this.deadFrameIndex = 0;

        /**
         * Remaining health points (0–100).
         * @type {number}
         */
        this.energy = 100;

        /**
         * Horizontal movement speed.
         * @type {number}
         */
        this.speed = 4;

        /**
         * Whether the boss is currently in a hurt state.
         * @type {boolean}
         */
        this.isCurrentlyHurt = false;

        /**
         * Duration of the hurt animation in milliseconds.
         * @type {number}
         */
        this.hurtDuration = 500;
    }

    //#region movement and animation
    /**
     * Moves the boss toward the character if alert and alive.
     * @param {Character} character - The player character to track.
     * @returns {void}
     */
    moveStep = (character) => {
        if (this.isDead() || !this.isAlert(character)) return;
        this.x += this.x > character.x ? -this.speed : this.speed;
    };

    /**
     * Handles the boss’s animation logic depending on its state and proximity to the player.
     * @param {Character} character - The player character reference.
     * @returns {void}
     */
    animateStep = (character) => {
        this.animationCounter++;
        if (this.isDead()) return this.handleDeath();
        if (this.isCurrentlyHurt) return this.playWithDelay(this.IMAGES_HURT);
        if (this.isCloseTo(character)) return this.playWithDelay(this.IMAGES_ATTACK);
        if (this.isAlert(character) && this.x !== character.x)
            return this.playWithDelay(this.IMAGES_WALK);
        this.playWithDelay(this.IMAGES_ALERT);
    };

    /**
     * Plays the death animation and schedules removal of the boss from the game.
     * @private
     * @returns {void}
     */
    handleDeath() {
        this.playWithDelay(this.IMAGES_DEAD);
        setTimeout(() => (this.markedForDeletion = true), 2000);
    }

    /**
     * Plays an animation only every few frames for smoother timing.
     * @param {string[]} images - Array of image paths for the animation.
     * @returns {void}
     */
    playWithDelay(images) {
        if (this.animationCounter % this.animationSpeed === 0) {
            this.playAnimation(images);
        }
    }
    //#endregion

    //#region status checks
    /**
     * Checks if the boss is close enough to the character to attack.
     * @param {Character} character - The player character.
     * @returns {boolean} True if within 300 px.
     */
    isCloseTo(character) {
        return Math.abs(this.x - character.x) < 300;
    }

    /**
     * Checks if the boss detects the player and should start following.
     * @param {Character} character - The player character.
     * @returns {boolean} True if within 500 px.
     */
    isAlert(character) {
        return Math.abs(this.x - character.x) < 500;
    }
    //#endregion

    //#region state and damage handling
    /**
     * Kills the boss instantly by setting energy and speed to 0.
     * @returns {void}
     */
    die = () => {
        this.energy = 0;
        this.speed = 0;
        this.animationCounter = 0;
    };

    /**
     * Reduces the boss’s health by a given amount, plays sound, and handles death logic.
     * @param {number} damage - Amount of damage to subtract from energy.
     * @returns {void}
     */
    takeHit(damage) {
        this.energy = Math.max(0, this.energy - damage);
        this.isCurrentlyHurt = true;
        SoundHub.play("chickenDead2");
        setTimeout(() => {
            this.isCurrentlyHurt = false;
        }, this.hurtDuration);
        if (this.energy <= 0) this.die();
    }
    //#endregion
}
