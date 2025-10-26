class Character extends MovableObject {
    //#region attributes
    speed = 10;
    y = 120;
    height = 250;

    offset = {
        top: 100,
        right: 30,
        bottom: 10,
        left: 30
    };
    SLEEP_DELAY = 2;
    JUMP_FRAME_DELAY = 200;
    isSnoring = false;

    IMAGES_IDLE = ImageHub.pepe.idle;
    IMAGES_WALK = ImageHub.pepe.walk;
    IMAGES_JUMP = ImageHub.pepe.jump;
    IMAGES_DEAD = ImageHub.pepe.dead;
    IMAGES_HURT = ImageHub.pepe.hurt;
    IMAGES_SLEEP = ImageHub.pepe.longIdle;
    world;
    //#endregion

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.lastAction = this.getNow();
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_SLEEP);

        this.animationSpeed = 8;
        this.animationCounter = 0;
    }

    //#region movement

    jump() {
        this.speedY = 25;
        SoundHub.play("jump");
    }
    characterMovement() {
        const moved = this.handleMovementInput();
        this.handleFootstepSound(moved);
        if (moved) this.lastAction = this.getNow();
        this.world.camera_x = -this.x + 100;
    }
    handleMovementInput() {
        let moved = false;
        const keys = this.world.keyboard;
        if (keys.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight(); this.otherDirection = false; moved = true;
        }
        if (keys.LEFT && this.x > 0) {
            this.moveLeft(); this.otherDirection = true; moved = true;
        }
        if (keys.SPACE && !this.isAboveGround()) {
            this.jump(); moved = true;
        }
        return moved;
    }

    handleFootstepSound(moved) {
        if (moved && !this.isAboveGround()) SoundHub.startLoop("footstep");
        else SoundHub.stopLoop("footstep");
    }
    //#endregion

    //#region animation
    characterAnimation() {
        this.animationCounter++;
        if (this.isDead())
            return this.playWithDelay(this.IMAGES_DEAD);
        if (this.isHurt())
            return this.playWithDelay(this.IMAGES_HURT);
        if (this.isAboveGround())
            return this.playJumpAnimation();
        this.handleGroundAnimations();
    }
    handleGroundAnimations() {
        const keys = this.world.keyboard;
        if (keys.RIGHT || keys.LEFT) this.playWithDelay(this.IMAGES_WALK);
        else if (this.isSleeping()) this.playWithDelay(this.IMAGES_SLEEP);
        else this.playWithDelay(this.IMAGES_IDLE);
    }
    playWithDelay(images) {
        if (this.animationCounter % this.animationSpeed === 0) {
            this.playAnimation(images);
        }
    }
    playJumpAnimation() {
        const now = this.getNow();
        if (!this.lastJumpFrameTime || now - this.lastJumpFrameTime > this.JUMP_FRAME_DELAY) {
            this.playAnimation(this.IMAGES_JUMP);
            this.lastJumpFrameTime = now;
        }
    }
    //#endregion

    //#region helpers
    getNow() {
        return new Date().getTime();
    }
    isSleeping() {
        let idleTime = (this.getNow() - this.lastAction) / 1000;
        let sleeping = idleTime > this.SLEEP_DELAY;

        if (sleeping && !this.isSnoring) {
            SoundHub.startLoop("snoring");
            this.isSnoring = true;
        }
        if (!sleeping && this.isSnoring) {
            SoundHub.stopLoop("snoring");
            this.isSnoring = false;
        }
        return sleeping;
    }
    //#endregion
}