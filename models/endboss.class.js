class Endboss extends MovableObject {
    //#region attributes
    height = 400;
    width = 250;
    y = 50;

    offset = {
        top: 60,
        right: 30,
        bottom: 30,
        left: 30
    };

    IMAGES_WALK = ImageHub.enemieBossChicken.walk;
    IMAGES_ALERT = ImageHub.enemieBossChicken.alert;
    IMAGES_ATTACK = ImageHub.enemieBossChicken.attack;
    IMAGES_HURT = ImageHub.enemieBossChicken.hurt;
    IMAGES_DEAD = ImageHub.enemieBossChicken.dead;
    //#endregion

    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.x = 3000;
        this.animationCounter = 0;
        this.animationSpeed = 15;
        this.deadFrameIndex = 0;
        this.energy = 100;
        this.speed = 4;
        this.isCurrentlyHurt = false;
        this.hurtDuration = 500;

    }
    //#region movement and animation
    moveStep = (character) => {
        if (!this.isDead() && this.isAlert(character)) {
            if (this.x > character.x) {
                this.x -= this.speed;
            } else {
                this.x += this.speed;
            }
        }
    }
    animateStep = (character) => {
        this.animationCounter++;
        if (this.isDead()) {
            this.playWithDelay(this.IMAGES_DEAD);
            setTimeout(() => {
                this.markedForDeletion = true;
            }, 2000);
        }
        else if (this.isCurrentlyHurt) {
            this.playWithDelay(this.IMAGES_HURT);
        }
        else if (this.isCloseTo(character)) {
            this.playWithDelay(this.IMAGES_ATTACK);
        }
        else if (this.isAlert(character)) {
            if (this.x !== character.x) {
                this.playWithDelay(this.IMAGES_WALK);
            }
        }
        else {
            this.playWithDelay(this.IMAGES_ALERT);
        }
    }
    playWithDelay(images) {
        if (this.animationCounter % this.animationSpeed === 0) {
            this.playAnimation(images);
        }
    }
    //#endregion

    //#region status checks
    isCloseTo(character) {
        return Math.abs(this.x - character.x) < 300;
    }

    isAlert(character) {
        return Math.abs(this.x - character.x) < 500;
    }
    //#endregion

    //#region state and damage handling
    die = () => {
        this.energy = 0;
        this.speed = 0;
        this.animationCounter = 0;
    }
    takeHit(damage) {
        this.energy = Math.max(0, this.energy - damage);
        this.isCurrentlyHurt = true;
        SoundHub.play("chickenDead2");

        setTimeout(() => {
            this.isCurrentlyHurt = false;
        }, this.hurtDuration);

        if (this.energy <= 0) {
            this.die();
        }
    }
    //#endregion
}