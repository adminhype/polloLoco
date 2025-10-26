class Level {
    //#region attribute
    // enemies;
    // clouds;
    // backgroundObjects;
    // salsaBottles;
    // coins;
    level_end_x = 3200;
    //#endregion

    //#region object collections
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new ChickenSmall(),
        new ChickenSmall(),
        new ChickenSmall(),
        new Endboss()
    ];
    clouds = [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
    ];
    backgroundObjects = [];
    salsaBottles = [];
    coins = [];
    //#endregion

    constructor(bottleCount = 10, coinCount = 5) {
        for (let i = 0; i < bottleCount; i++) {
            this.salsaBottles.push(new Bottle());
        }

        for (let i = 0; i < coinCount; i++) {
            this.coins.push(new Coin());
        }
        for (let i = -1; i <= 5; i++) {
            const type = (i % 2 === 0) ? '1.png' : '2.png';

            this.backgroundObjects.push(new BackgroundObject('img/5_background/layers/air.png', 719 * i));
            this.backgroundObjects.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${type}`, 719 * i));
            this.backgroundObjects.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${type}`, 719 * i));
            this.backgroundObjects.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${type}`, 719 * i));
        }
    }
}