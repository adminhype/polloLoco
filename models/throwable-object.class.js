/**
 * Represents a throwable object such as a bottle.
 *
 * Extends {@link MovableObject} and adds projectile motion, rotation, splash animation,
 * and a self-destruction sequence after breaking on impact.
 *
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
    /**
     * Creates a new throwable bottle at the specified position.
     * Loads both rotation and splash animation images.
     *
     * @param {number} x - Initial horizontal position.
     * @param {number} y - Initial vertical position.
     */
    constructor(x, y) {
        super().loadImage(ImageHub.bottleSplash.rotation[0]);

        /** @type {number} */
        this.x = x;

        /** @type {number} */
        this.y = y;

        /** @type {number} */
        this.height = 60;

        /** @type {number} */
        this.width = 40;

        // Preload animations
        this.loadImages(ImageHub.bottleSplash.rotation);
        this.loadImages(ImageHub.bottleSplash.splash);

        /**
         * Whether the bottle has already broken.
         * @type {boolean}
         */
        this.isBroken = false;

        /**
         * Upward speed of the projectile.
         * @type {number}
         */
        this.speedY = 20;

        /**
         * Horizontal speed of the projectile.
         * @type {number}
         */
        this.speedX = 6;

        /**
         * Acceleration due to gravity (affects fall speed).
         * @type {number}
         */
        this.acceleration = 1;

        /**
         * Animation frame delay for rotation.
         * @type {number}
         */
        this.animationSpeed = 4;

        /**
         * Current animation frame index.
         * @type {number}
         */
        this.currentFrame = 0;

        /**
         * Counter for animation timing.
         * @type {number}
         */
        this.frameCounter = 0;

        /**
         * Flag indicating if the object should be removed from the world.
         * @type {boolean}
         */
        this.markedForDeletion = false;
    }

    //#region movement and physics
    /**
     * Updates the projectile's position and applies gravity.
     * When it hits the ground, the bottle breaks.
     *
     * @returns {void}
     */
    update() {
        if (this.isBroken) return;

        this.x += this.speedX;
        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        // Check ground collision
        if (this.y >= 380) {
            this.breakBottle();
        }
    }
    //#endregion

    //#region animation
    /**
     * Handles both the flying rotation animation and splash sequence after impact.
     *
     * @returns {void}
     */
    animate() {
        if (!this.isBroken) {
            // Rotating bottle animation during flight
            if (this.frameCounter % this.animationSpeed === 0) {
                this.playAnimation(ImageHub.bottleSplash.rotation);
            }
        } else {
            // Splash animation after impact
            if (this.currentFrame < ImageHub.bottleSplash.splash.length) {
                this.loadImage(ImageHub.bottleSplash.splash[this.currentFrame]);
                this.currentFrame++;
            }
        }
        this.frameCounter++;
    }
    //#endregion

    //#region state handling
    /**
     * Breaks the bottle on ground impact, triggers sound and splash animation,
     * and marks it for deletion after a short delay.
     *
     * @returns {void}
     */
    breakBottle() {
        this.isBroken = true;
        this.speedY = 0;
        this.y = 380;
        this.currentFrame = 0;
        SoundHub.play("bottle");

        // Remove from world after splash animation ends
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 1000);
    }
    //#endregion
}