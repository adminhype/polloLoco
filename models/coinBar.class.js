/**
 * Represents the coin status bar in the game's UI.
 * Displays the number of collected coins as a visual fill percentage.
 * Inherits from {@link DrawableObject}.
 * @extends DrawableObject
 */
class CoinBar extends DrawableObject {
    /**
     * Image paths for the coin status bar levels.
     * @type {string[]}
     */
    IMAGES = ImageHub.statusbarCoin.orange;

    /**
     * Current fill percentage of the coin bar (0–100).
     * @type {number}
     */
    percentage = 100;

    /**
     * Creates a new coin status bar and initializes its position and images.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES);
        /**
         * Horizontal position of the coin bar.
         * @type {number}
         */
        this.x = 40;

        /**
         * Vertical position of the coin bar.
         * @type {number}
         */
        this.y = 80;

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

        // Initialize with an empty bar
        this.setPercentage(0);
    }

    /**
     * Updates the coin bar display based on the given percentage.
     * Selects and sets the corresponding image from {@link IMAGES}.
     * @param {number} percentage - The new coin fill level (0–100).
     * @returns {void}
     */
    setPercentage(percentage) {
        this.percentage = percentage;
        const path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Determines which image to show based on the current percentage.
     * @private
     * @returns {number} Index of the image in {@link IMAGES}.
     */
    resolveImageIndex() {
        const thresholds = [100, 80, 60, 40, 20, 0];
        for (let i = 0; i < thresholds.length; i++) {
            if (this.percentage >= thresholds[i]) return 5 - i;
        }
        return 0;
    }
}