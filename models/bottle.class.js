/**
 * Represents a collectible or throwable bottle object.
 * Inherits from {@link MovableObject} and provides position and image setup.
 * @extends MovableObject
 */
class Bottle extends MovableObject {
    /**
     * The vertical position of the bottle on the ground.
     * @type {number}
     */
    y = 360;

    /**
     * The width of the bottle in pixels.
     * @type {number}
     */
    width = 50;

    /**
     * The height of the bottle in pixels.
     * @type {number}
     */
    height = 60;

    /**
     * Defines the offset area for collision detection.
     * @type {{ top: number, right: number, bottom: number, left: number }}
     */
    offset = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    };

    /**
     * Image paths used for bottle sprites.
     * @type {string[]}
     */
    IMAGES = ImageHub.icons.salsaBottle;

    /**
     * Creates a new bottle instance with random horizontal position and slight speed variation.
     */
    constructor() {
        super();
        this.loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        this.x = 200 + Math.random() * 2500;
        this.speed = 0.2 + Math.random() * 0.25;
    }
}