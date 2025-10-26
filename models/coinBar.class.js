class CoinBar extends DrawableObject {
    IMAGES = ImageHub.statusbarCoin.orange;
    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES);
        this.x = 40;
        this.y = 80;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }
    resolveImageIndex() {
        const thresholds = [100, 80, 60, 40, 20, 0];
        for (let i = 0; i < thresholds.length; i++) {
            if (this.percentage >= thresholds[i]) return 5 - i;
        }
        return 0;
    }
}
