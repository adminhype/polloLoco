class StatusBarEndboss extends StatusBar {
    constructor() {
        super();
        this.IMAGES = ImageHub.statusbarEndboss.orange;
        this.loadImages(this.IMAGES);
        this.x = 500;
        this.y = 40;
        this.width = 200;
        this.height = 60;
        this.maxValue = 100;
        this.setPercentage(100);
    }

    setBossEnergy(energy) {
        let percentage = (energy / this.maxValue) * 100;
        this.setPercentage(percentage);
    }

    resolveImageIndex() {
        const thresholds = [80, 60, 40, 20, 0];
        for (let i = 0; i < thresholds.length; i++) {
            if (this.percentage > thresholds[i]) return 5 - i;
        }
        return 0;
    }
}