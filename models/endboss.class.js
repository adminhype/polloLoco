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
        [this.IMAGES_WALK, this.IMAGES_ALERT, this.IMAGES_ATTACK,
        this.IMAGES_HURT, this.IMAGES_DEAD].forEach(imgs => this.loadImages(imgs));
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
        if (this.isDead() || !this.isAlert(character)) return;
        this.x += this.x > character.x ? -this.speed : this.speed;
    }
    animateStep = (character) => {
        this.animationCounter++;
        if (this.isDead())
            return this.handleDeath();
        if (this.isCurrentlyHurt)
            return this.playWithDelay(this.IMAGES_HURT);
        if (this.isCloseTo(character))
            return this.playWithDelay(this.IMAGES_ATTACK);
        if (this.isAlert(character) && this.x !== character.x)
            return this.playWithDelay(this.IMAGES_WALK);
        this.playWithDelay(this.IMAGES_ALERT);
    }
    handleDeath() {
        this.playWithDelay(this.IMAGES_DEAD);
        setTimeout(() => this.markedForDeletion = true, 2000);
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