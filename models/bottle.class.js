class Bottle extends MovableObject {
    y = 360;
    width = 50;
    height = 60;

    offset = {
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
    };

    IMAGES = ImageHub.icons.salsaBottle;
    constructor() {
        super();
        this.loadImage('img/6_salsa_bottle/2_salsa_bottle_on_ground.png');
        this.x = 200 + Math.random() * 2500;
        this.speed = 0.2 + Math.random() * 0.25;
    }
}

