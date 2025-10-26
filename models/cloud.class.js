/**
 * Represents a moving cloud in the background layer.
 * Clouds continuously move left to create a parallax effect.
 * Inherits movement and image-loading from {@link MovableObject}.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
    /**
     * Vertical position of the cloud.
     * @type {number}
     */
    y = 20;

    /**
     * Height of the cloud sprite.
     * @type {number}
     */
    height = 250;

    /**
     * Width of the cloud sprite.
     * @type {number}
     */
    width = 500;

    /**
     * Horizontal movement speed.
     * @type {number}
     */
    speed = 0.2;

    /**
     * Creates a new cloud at a random horizontal position.
     * Automatically starts its animation loop.
     */
    constructor() {
        super().loadImage('img/5_background/layers/4_clouds/1.png');
        /**
         * Randomized spawn position along the x-axis.
         * @type {number}
         */
        this.x = Math.random() * 2000;
        // Start smooth cloud movement (60 FPS)
        IntervalHub.startInterval(this.animate, 1000 / 60);
    }

    /**
     * Moves the cloud slightly left each frame to simulate drifting.
     * Called repeatedly via {@link IntervalHub}.
     * @returns {void}
     */
    animate = () => {
        this.moveLeft();
        this.x -= 0.1;
    };
}
