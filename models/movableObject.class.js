class MovableObject extends DrawableObject {

    //#region attributes
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.3;
    energy = 100;
    lastHit = 0;

    offset = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };
    rX;
    rY;
    rW;
    rH;
    //#endregion

    constructor() {
        super();
    }

    //#region collision detection
    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }
    isColliding(moObject) {
        this.getRealFrame();
        moObject.getRealFrame();
        return this.rX + this.rW > moObject.rX &&
            this.rY + this.rH > moObject.rY &&
            this.rX < moObject.rX + moObject.rW &&
            this.rY < moObject.rY + moObject.rH;
    }
    //#endregion

    //#region movement and physics
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

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 180;
        }
    }
    moveRight() {
        this.x += this.speed;
    }
    moveLeft() {
        this.x -= this.speed;
    }
    jump() {
        this.speedY = 18;
    }
    //#endregion

    //#region status and damage handling
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
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }
    isDead() {
        return this.energy <= 0 || this.dead === true;
    }
    //#endregion

    //#region animation
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
    //#endregion
}