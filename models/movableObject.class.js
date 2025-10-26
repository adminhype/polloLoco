/**
 * Represents any object in the game world that can move, collide, or be affected by physics.
 * Extends {@link DrawableObject} by adding velocity, gravity, collision detection, and animation logic.
 * Used as a base class for dynamic entities like the player, enemies, and throwable objects.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
    //#region attributes
    /**
     * Horizontal movement speed of the object.
     * @type {number}
     */
    speed = 0.2;

    /**
     * Direction flag — `true` if facing left.
     * @type {boolean}
     */
    otherDirection = false;

    /**
     * Vertical velocity (used for jumping or falling).
     * @type {number}
     */
    speedY = 0;

    /**
     * Gravitational acceleration applied per frame.
     * @type {number}
     */
    acceleration = 2.3;

    /**
     * Health or energy points (0 = dead).
     * @type {number}
     */
    energy = 100;

    /**
     * Timestamp of the last time this object was hit.
     * @type {number}
     */
    lastHit = 0;

    /**
     * Collision box offset to fine-tune hitbox vs. visual sprite.
     * @type {{ top: number, bottom: number, left: number, right: number }}
     */
    offset = { top: 0, bottom: 0, left: 0, right: 0 };

    /**
     * Real collision frame X-coordinate (after offset).
     * @type {number}
     */
    rX;

    /**
     * Real collision frame Y-coordinate (after offset).
     * @type {number}
     */
    rY;

    /**
     * Real collision frame width (after offset).
     * @type {number}
     */
    rW;

    /**
     * Real collision frame height (after offset).
     * @type {number}
     */
    rH;
    //#endregion

    constructor() {
        super();
    }

    //#region collision detection
    /**
     * Calculates the object's real collision frame (adjusted by offsets).
     * @returns {void}
     */
    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Checks whether this object collides with another {@link MovableObject}.
     * @param {MovableObject} moObject - The object to test collision against.
     * @returns {boolean} `true` if the two objects overlap.
     */
    isColliding(moObject) {
        this.getRealFrame();
        moObject.getRealFrame();
        return (
            this.rX + this.rW > moObject.rX &&
            this.rY + this.rH > moObject.rY &&
            this.rX < moObject.rX + moObject.rW &&
            this.rY < moObject.rY + moObject.rH
        );
    }
    //#endregion

    //#region movement and physics
    /**
     * Applies gravity to the object if it is above ground or moving upward.
     * Adjusts vertical speed and position accordingly.
     * @returns {void}
     */
    applyGravity() {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
        if (this.y > 180) {
            this.y = 180;
            this.speedY = 0;
        }
    }

    /**
     * Determines whether the object is above ground level.
     * Throwable objects always return `true` to allow for projectile motion.
     * @returns {boolean}
     */
    isAboveGround() {
        return this instanceof ThrowableObject ? true : this.y < 180;
    }

    /**
     * Moves the object to the right based on its speed.
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object to the left based on its speed.
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Initiates a jump by setting upward velocity.
     * @returns {void}
     */
    jump() {
        this.speedY = 18;
    }
    //#endregion

    //#region status and damage handling
    /**
     * Applies damage to the object, reducing its energy.
     * Triggers sound effects and updates the last hit timestamp.
     * @returns {void}
     */
    hit() {
        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
            SoundHub.play("hurt");
        }
        if (this.energy <= 0) {
            SoundHub.play("death");
        }
    }

    /**
     * Checks whether the object is still in a short invulnerability phase after being hit.
     * @returns {boolean} `true` if hurt animation should still play.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean} `true` if energy is depleted or dead flag is set.
     */
    isDead() {
        return this.energy <= 0 || this.dead === true;
    }
    //#endregion

    //#region animation
    /**
     * Plays the next animation frame from a given image sequence.
     * @param {string[]} images - Array of image paths representing animation frames.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    //#endregion
}