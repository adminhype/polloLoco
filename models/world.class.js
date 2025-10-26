class World {

    //#region attributes
    character = new Character();
    level = new Level();
    ctx;
    canvas;
    keyboard;
    camera_x = 0;
    isRunning = true;

    statusBar = new StatusBar();
    bottlBar = new BottleBar();
    coinBar = new CoinBar();
    endbossBar = new StatusBarEndboss();
    throwableObjects = [];
    collectedBottles = [];
    collectedCoins = [];
    //#endregion

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
    }

    //#region setup
    setWorld() {
        this.character.world = this;
    }
    //#endregion

    //#region input and throwing logic
    checkThrowObjects() {
        if (this.character.isSleeping()) return;
        const now = Date.now(), cd = 300;
        const canThrow = this.keyboard.F && this.bottlBar.percentage > 0 &&
            !this.character.otherDirection &&
            (!this.lastThrowTime || now - this.lastThrowTime > cd);
        if (!canThrow) return;

        const offsetX = this.character.width - 20;
        const offsetY = this.character.height / 2;
        const bottle = new ThrowableObject(
            this.character.x + offsetX,
            this.character.y + offsetY
        );
        this.throwableObjects.push(bottle);
        this.bottlBar.setPercentage(this.bottlBar.percentage - 20);
        this.lastThrowTime = now;
    }
    //#endregion

    //#region collision detection
    checkCollisions() {
        this.checkEnemyCollisions();
        this.checkBottleCollisions();
        this.checkCoinCollisions();
        this.checkThrowableCollisions();
    }

    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (!this.character.isColliding(enemy) || enemy.isDead()) return;
            if (enemy instanceof Endboss) return this.handleBossHit();
            const feet = this.character.y + this.character.height;
            const stomp = this.character.speedY < 0 && feet <= enemy.y + enemy.height;
            stomp ? enemy.die() : this.handlePlayerHit();
        });
    }
    handleBossHit() {
        if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }
    handlePlayerHit() {
        if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
        }
    }

    checkBottleCollisions() {
        this.level.salsaBottles = this.level.salsaBottles.filter(bottle => {
            if (!this.character.isColliding(bottle)) return true;
            this.collectBottle(bottle);
            return false;
        });
    }
    collectBottle(bottle) {
        this.collectedBottles.push(bottle);
        this.bottlBar.setPercentage(Math.min(100, this.bottlBar.percentage + 20));
        SoundHub.play("bottleCollect");
    }
    checkCoinCollisions() {
        this.level.coins = this.level.coins.filter((coin) => {
            if (this.character.isColliding(coin)) {
                this.collectedCoins.push(coin);
                this.coinBar.setPercentage(Math.min(100, this.coinBar.percentage + 20));
                SoundHub.play("coin");
                return false;

            }
            return true;
        });
    }

    checkThrowableCollisions() {
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(enemy => {
                if (!bottle.isColliding(enemy) || enemy.isDead()) return;
                this.handleBottleHit(enemy, bottle);
            });
        });
    }
    handleBottleHit(enemy, bottle) {
        if (enemy instanceof Endboss) {
            enemy.takeHit(20);
            this.endbossBar.setBossEnergy(enemy.energy);
        } else enemy.die();
        bottle.markedForDeletion = true;
    }
    //#endregion

    //#region game state handling
    gameOver() {
        this.isRunning = false;
        SoundHub.stopLoop("footstep");
        SoundHub.play("gameover");

        document.getElementById("gameover").classList.remove("d-none");
        document.getElementById("gameover").classList.add("d-flex");

        document.getElementById("gameover-buttons").classList.remove("d-none");
        document.getElementById("gameover-buttons").classList.add("d-flex");
    }

    winGame() {
        this.isRunning = false;
        SoundHub.stopLoop("footstep");
        SoundHub.play("win");

        document.getElementById("win").classList.remove("d-none");
        document.getElementById("win").classList.add("d-flex");

        document.getElementById("win-buttons").classList.remove("d-none");
        document.getElementById("win-buttons").classList.add("d-flex");
    }
    //#endregion

    //#region rendering
    draw() {
        if (!this.isRunning) return;
        this.clearCanvas();
        this.renderWorld();
        this.renderUI();
        this.update();
        requestAnimationFrame(() => this.draw());
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderWorld() {
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);

        const worldObjects = [
            this.level.backgroundObjects,
            this.level.clouds,
            this.throwableObjects,
            this.level.salsaBottles,
            this.level.coins,
            this.level.enemies
        ];

        worldObjects.forEach(obj => this.addObjectsToMap(obj));
        this.addToMap(this.character);
        this.ctx.restore();
    }

    renderUI() {
        [this.statusBar, this.bottlBar, this.coinBar, this.endbossBar]
            .forEach(ui => this.addToMap(ui));
    }
    //#endregion

    //#region game logic update
    update() {
        this.checkCollisions();
        this.checkThrowObjects();
        this.character.applyGravity();
        this.character.characterMovement();
        this.character.characterAnimation();
        this.level.enemies.forEach(e => {
            if (e.moveStep) e.moveStep(this.character);
            if (e.animateStep) e.animateStep(this.character);
        });
        this.level.enemies = this.level.enemies.filter(e => !e.markedForDeletion);
        this.throwableObjects = this.throwableObjects.filter(o => !o.markedForDeletion);
        if (this.character.energy <= 0 && this.isRunning) this.gameOver();
        const endboss = this.level.enemies.find(e => e instanceof Endboss);
        if (!endboss && this.isRunning) this.winGame();
    }
    //#endregion

    //#region rendering helpers
    addObjectsToMap(objects) {
        objects.forEach(obj => {
            if (obj instanceof ThrowableObject || obj instanceof Coin) {
                obj.update?.(); obj.animate?.();
            }
            this.addToMap(obj);
        });
    }

    addToMap(moObject) {
        if (moObject.otherDirection) {
            this.flipImage(moObject);
        }
        moObject.draw(this.ctx);

        if (moObject.otherDirection) {
            this.flipImageBack(moObject);
        }
    }

    flipImage(moObject) {
        this.ctx.save();
        this.ctx.translate(moObject.width, 0);
        this.ctx.scale(-1, 1);
        moObject.x = moObject.x * -1;
    }

    flipImageBack(moObject) {
        moObject.x = moObject.x * -1;
        this.ctx.restore();
    }
    //#endregion
}