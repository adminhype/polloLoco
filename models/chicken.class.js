class Chicken extends MovableObject {

    //#region attributes
    y = 350;
    height = 70;
    width = 70;

    offset = {
        top: 10,
        right: 5,
        bottom: 10,
        left: 5
    };

    IMAGES_WALK = ImageHub.chickenNormal.walk;
    IMAGES_DEAD = ImageHub.chickenNormal.dead;

    //#endregion

    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 470 + Math.random() * 2500;
        this.speed = 0.2 + Math.random() * 0.25;

        this.animationCounter = 0;
        this.animationSpeed = 8;

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
        this.dead = true;
        this.energy = 0;
        this.speed = 0;
        this.animationCounter = 0;
        SoundHub.play("chickenDead");
    }
    //#endregion
}