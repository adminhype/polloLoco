/**
 * Represents the status bar for the Endboss's health.
 * Extends {@link StatusBar} to visualize the boss's remaining energy.
 * Displays a colored bar that decreases as the boss takes damage.
 * @extends StatusBar
 */
class StatusBarEndboss extends StatusBar {
    /**
     * Creates a new Endboss status bar and initializes its properties.
     */
    constructor() {
        super();
        /**
         * Image paths for the Endboss health bar states.
         * @type {string[]}
         */
        this.IMAGES = ImageHub.statusbarEndboss.orange;
        this.loadImages(this.IMAGES);

        /**
         * X-coordinate of the bar on the canvas.
         * @type {number}
         */
        this.x = 500;

        /**
         * Y-coordinate of the bar on the canvas.
         * @type {number}
         */
        this.y = 40;

        /**
         * Width of the bar in pixels.
         * @type {number}
         */
        this.width = 200;

        /**
         * Height of the bar in pixels.
         * @type {number}
         */
        this.height = 60;

        /**
         * Maximum possible health value for the Endboss.
         * @type {number}
         */
        this.maxValue = 100;

        this.setPercentage(100);
    }

    /**
     * Updates the visual representation of the Endboss's energy.
     * Converts a raw energy value (0–100) to a percentage and updates the bar image.
     * @param {number} energy – The Endboss's current energy value.
     * @returns {void}
     */
    setBossEnergy(energy) {
        const percentage = (energy / this.maxValue) * 100;
        this.setPercentage(percentage);
    }

    /**
     * Determines which image should be displayed based on the current health percentage.
     * @private
     * @returns {number} Index of the image in {@link IMAGES}.
     */
    resolveImageIndex() {
        const thresholds = [80, 60, 40, 20, 0];
        for (let i = 0; i < thresholds.length; i++) {
            if (this.percentage > thresholds[i]) return 5 - i;
        }
        return 0;
    }
}