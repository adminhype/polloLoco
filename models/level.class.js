/**
 * Represents a single game level containing all objects,
 * such as enemies, background layers, clouds, coins, and bottles.
 *
 * This class initializes a complete level environment and populates
 * it with entities when a new game starts.
 */
class Level {
    /**
     * The x-coordinate defining the end boundary of the level.
     * @type {number}
     */
    level_end_x = 3200;

    //#region object collections
    /**
     * All enemy entities in the level (normal chickens, small chickens, and the endboss).
     * @type {Array<Chicken|ChickenSmall|Endboss>}
     */
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new ChickenSmall(),
        new ChickenSmall(),
        new ChickenSmall(),
        new Endboss()
    ];

    /**
     * Array of moving cloud objects used for the parallax background.
     * @type {Cloud[]}
     */
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

    /**
     * Static background objects that form the layered scenery (mountains, trees, etc.).
     * @type {BackgroundObject[]}
     */
    backgroundObjects = [];

    /**
     * Collectible salsa bottle objects scattered throughout the level.
     * @type {Bottle[]}
     */
    salsaBottles = [];

    /**
     * Collectible coins for increasing the player’s score.
     * @type {Coin[]}
     */
    coins = [];
    //#endregion

    /**
     * Creates a new level instance with a specified number of collectible bottles and coins.
     * Also initializes the parallax background layers.
     *
     * @param {number} [bottleCount=10] - Number of bottles to spawn in the level.
     * @param {number} [coinCount=5] - Number of coins to spawn in the level.
     */
    constructor(bottleCount = 10, coinCount = 5) {
        // Populate bottles
        for (let i = 0; i < bottleCount; i++) {
            this.salsaBottles.push(new Bottle());
        }

        // Populate coins
        for (let i = 0; i < coinCount; i++) {
            this.coins.push(new Coin());
        }

        // Build parallax background layers
        for (let i = -1; i <= 5; i++) {
            const type = i % 2 === 0 ? "1.png" : "2.png";

            this.backgroundObjects.push(new BackgroundObject("img/5_background/layers/air.png", 719 * i));
            this.backgroundObjects.push(new BackgroundObject(`img/5_background/layers/3_third_layer/${type}`, 719 * i));
            this.backgroundObjects.push(new BackgroundObject(`img/5_background/layers/2_second_layer/${type}`, 719 * i));
            this.backgroundObjects.push(new BackgroundObject(`img/5_background/layers/1_first_layer/${type}`, 719 * i));
        }
    }
}