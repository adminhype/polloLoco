/**
 * Base class for all status bars (health, bottles, coins, endboss, etc.).
 * 
 * Extends {@link DrawableObject} to display a visual progress bar
 * that changes its image based on the current percentage value.
 * 
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
    /**
     * Image set representing the visual states of the bar (from 0% to 100%).
     * Default is the green health bar set.
     * @type {string[]}
     */
    IMAGES = ImageHub.statusbarHealth.green;

    /**
     * Current fill percentage of the bar (0–100).
     * Determines which image from {@link IMAGES} is displayed.
     * @type {number}
     */
    percentage = 100;

    /**
     * Creates a new status bar instance and loads all related images.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
     * Updates the visual representation of the bar based on a new percentage value.
     * 
     * @param {number} percentage - The new fill percentage (0–100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines which image index corresponds to the current percentage level.
     * 
     * @returns {number} Index of the image to display (0–5).
     */
    resolveImageIndex() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage > 80) {
            return 4;
        } else if (this.percentage > 60) {
            return 3;
        } else if (this.percentage > 40) {
            return 2;
        } else if (this.percentage > 20) {
            return 1;
        } else {
            return 0;
        }
    }
}