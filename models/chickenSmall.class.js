class ChickenSmall extends MovableObject {

    //#region attributes
    y = 370;
    height = 50;
    width = 50;

    offset = {
        top: 15,
        right: 10,
        bottom: 20,
        left: 10
    };

    IMAGES_WALK = ImageHub.chickenSmall.walk;
    IMAGES_DEAD = ImageHub.chickenSmall.dead;
    //#endregion

    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 470 + Math.random() * 2500;
        this.speed = 3 + Math.random() * 0.25;
        this.animationCounter = 0;
        this.animationSpeed = 10;
        this.dead = false;
    }
    //#region movement and animation
    moveStep = () => {
        if (!this.isDead()) {
            this.x -= this.speed;
        }
    }
    animateStep = () => {
        this.animationCounter++;

        if (this.isDead()) {
            this.img = this.imageCache[this.IMAGES_DEAD[0]];
            if (this.animationCounter > 60) {
                this.markedForDeletion = true;
            }
        } else {
            if (this.animationCounter % this.animationSpeed === 0) {
                this.playAnimation(this.IMAGES_WALK);
            }
        }
    }
    //#endregion

    //#region state handling
    die = () => {
        if (!this.dead) {
            this.dead = true;
            this.speed = 0;
            this.animationCounter = 0;
            SoundHub.play("chickenDead");
        }
    }
    //#endregion
}