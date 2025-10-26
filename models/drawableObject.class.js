/**
 * Base class for all drawable game objects.
 * Provides fundamental properties and methods for loading and drawing images on the canvas.
 * Other objects like {@link MovableObject}, {@link Coin}, or {@link Character} extend this class.
 */
class DrawableObject {
    /**
     * The current image of the drawable object.
     * @type {HTMLImageElement}
     */
    img;

    /**
     * The current image index (used for animations).
     * @type {number}
     */
    currentImage = 0;

    /**
     * Cache storing preloaded images by file path.
     * @type {Record<string, HTMLImageElement>}
     */
    imageCache = {};

    /**
     * X-coordinate on the canvas.
     * @type {number}
     */
    x = 120;

    /**
     * Y-coordinate on the canvas.
     * @type {number}
     */
    y = 280;

    /**
     * Height of the object in pixels.
     * @type {number}
     */
    height = 150;

    /**
     * Width of the object in pixels.
     * @type {number}
     */
    width = 100;

    /**
     * Loads a single image and sets it as the object's active image.
     * @param {string} path - The path to the image file.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the current image of the object onto the given canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Preloads multiple images and stores them in the {@link imageCache}.
     * @param {string[]} arr - Array of image file paths to load (e.g. ['img/1.png', 'img/2.png']).
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}