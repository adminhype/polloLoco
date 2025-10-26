class Coin extends MovableObject {
    y = 180;
    width = 100;
    height = 100;

    offset = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };

    IMAGES = ImageHub.coin;
    constructor() {
        super();
        this.loadImage(this.IMAGES[0]);
        this.x = 200 + Math.random() * 2000;
        this.speed = 0.2 + Math.random() * 0.25;

        this.currentFrame = 0;
        this.frameCounter = 0;
    }
    animate() {
        if (this.frameCounter % 10 === 0) {
            this.currentFrame = (this.currentFrame + 1) % this.IMAGES.length;
            this.loadImage(this.IMAGES[this.currentFrame]);
        }
        this.frameCounter++;
    }
}