/**
 * Represents the bottle status bar in the HUD (shows collected bottles).
 * Inherits image handling from {@link DrawableObject}.
 * @extends DrawableObject
 */
class BottleBar extends DrawableObject {
    /**
     * Array of image paths for the bottle bar states.
     * @type {string[]}
     */
    IMAGES = ImageHub.statusbarBottle.blue;

    /**
     * Current fill percentage (0–100).
     * @type {number}
     */
    percentage = 0;

    /**
     * Horizontal position on the canvas.
     * @type {number}
     */
    x = 40;

    /**
     * Vertical position on the canvas.
     * @type {number}
     */
    y = 40;

    /**
     * Display width of the status bar in pixels.
     * @type {number}
     */
    width = 200;

    /**
     * Display height of the status bar in pixels.
     * @type {number}
     */
    height = 60;

    /**
     * Creates a new bottle bar instance and initializes its images.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(0);
    }

    /**
     * Updates the bottle bar image based on the collected bottle percentage.
     * @param {number} percentage - Value between 0 and 100.
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the image index depending on the percentage.
     * @returns {number} Image index (0–5).
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}