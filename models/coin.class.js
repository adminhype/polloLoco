/**
 * Represents a collectible coin in the game world.
 * Coins can be collected by the {@link Character} and have a simple spinning animation.
 * Inherits from {@link MovableObject}.
 * @extends MovableObject
 */
class Coin extends MovableObject {
    /**
     * Vertical position of the coin.
     * @type {number}
     */
    y = 180;

    /**
     * Width of the coin sprite.
     * @type {number}
     */
    width = 100;

    /**
     * Height of the coin sprite.
     * @type {number}
     */
    height = 100;

    /**
     * Collision offset for hit detection.
     * @type {{top: number, right: number, bottom: number, left: number}}
     */
    offset = { top: 10, right: 10, bottom: 10, left: 10 };

    /**
     * File paths for the coin animation frames.
     * @type {string[]}
     */
    IMAGES = ImageHub.coin;

    /**
     * Creates a new coin with random position and speed.
     * Automatically loads the first image from the coin sprite set.
     */
    constructor() {
        super();
        // Load first coin frame
        this.loadImage(this.IMAGES[0]);

        /**
         * Random horizontal spawn position.
         * @type {number}
         */
        this.x = 200 + Math.random() * 2000;

        /**
         * Optional slow horizontal movement speed (for subtle motion).
         * @type {number}
         */
        this.speed = 0.2 + Math.random() * 0.25;

        /**
         * Current frame index for animation.
         * @type {number}
         */
        this.currentFrame = 0;

        /**
         * Frame counter to control animation speed.
         * @type {number}
         */
        this.frameCounter = 0;
    }

    /**
     * Animates the coin by cycling through image frames.
     * Creates a spinning effect every 10 frames.
     * @returns {void}
     */
    animate() {
        if (this.frameCounter % 10 === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.IMAGES.length;
            this.loadImage(this.IMAGES[this.currentFrame]);
        }
        this.frameCounter++;
    }
}