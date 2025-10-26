/**
 * Represents a static background image in the level.
 * Inherits movement and image-loading functionality from {@link MovableObject}.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
    /**
     * The background width in pixels.
     * @type {number}
     */
    width = 720;
    /**
     * The background height in pixels.
     * @type {number}
     */
    height = 480;
    /**
     * Creates a background object instance.
     * @param {string} imagePath - Path to the background image file.
     * @param {number} x - Horizontal position of the background.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;
    }
}