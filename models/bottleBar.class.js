class BottleBar extends DrawableObject {
    IMAGES = ImageHub.statusbarBottle.blue;
    percentage = 0;
    x = 40;
    y = 40;
    width = 200;
    height = 60;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.setPercentage(0);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}