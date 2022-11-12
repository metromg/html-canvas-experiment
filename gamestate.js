GameStateManager = function () {
    // Game state constants
    this.titleState = 0;
    this.ingameState = 1;

    //this.soundSettingsHandler = new SoundSettingsHandler();

    // Set initial game state
    this.currentGameState = new TitleState(this);
    this.currentGameState.Init();
    //this.soundSettingsHandler.sounds = this.currentGameState.GetControlableSounds();

    this.gameStateFactory = new GameStateFactory();

    this.SetState = function (state) {
        this.currentGameState = this.gameStateFactory.GetState(state, this);
        this.currentGameState.Init();
        //this.soundSettingsHandler.sounds = this.currentGameState.GetControlableSounds();
    };

    this.Update = function (dt) {
        this.currentGameState.Update(dt);
        //this.soundSettingsHandler.Update(dt);
    };

    this.Draw = function (context) {
        this.currentGameState.Draw(context);
        //this.soundSettingsHandler.Draw(context);
    };
};

GameStateFactory = function () {
    this.GetState = function (state, gsm) {
        if (state == gsm.titleState) {
            return new TitleState(gsm);
        }

        if (state == gsm.ingameState) {
            return new IngameState(gsm);
        }
    };
};

IngameState = function (gsm) {
    this.gsm = gsm;

    this.timer = 0;
    this.pipes = [];

    this.gameover = false;
    this.gameoveronce = false;

    this.Init = function () {
        this.background = new Background();
        this.brickman = new Brickman();
        this.counter = new Counter();

        this.music = new Sound("assets/audio/ingame.mp3", true);
        this.music.Play();

        this.gameoverMusic = new Sound("assets/audio/gameover.mp3", true);
    };

    this.GetControlableSounds = function () {
        return [this.music, this.gameoverMusic, this.counter.sound];
    };

    this.Update = function (dt) {
        // Back to title
        if (input.keys.Contains(27)) {
            this.music.Stop();
            this.gameoverMusic.Stop();

            this.gsm.SetState(this.gsm.titleState);
        }

        // Gameover handling
        if (this.gameover) {
            if (!this.gameoveronce) {
                this.music.Stop();

                this.gameoverMusic.Play();
                this.gameoveronce = true;
            }

            if (input.keys.Contains(32)) {
                this.gameoverMusic.Stop();
                this.gsm.SetState(this.gsm.ingameState);
            }

            return;
        }

        this.timer += dt;

        // Background
        this.background.Update(dt);

        // Brickman
        this.brickman.Update(dt);

        // Every 1.5 seconds create a new pipe
        if (this.timer > 1.8) {
            this.timer = 0;
            
            var pipes = new Pipes();
            this.pipes.push(pipes);
        }

        // Remove any pipes outside of screen
        for (var i = 0; i < this.pipes.length; i++) {
            if (this.pipes[i].position.y < (0 - 54)) {
                this.pipes.RemoveAt(i);
                i--;
            }
        }

        // Update every pipe
        for (var i = 0; i < this.pipes.length; i++) {
            this.pipes[i].Update(dt);

            // Check live point
            if (this.pipes[i].liveRect.Intersects(this.brickman.rect) && !this.pipes[i].collided) {
                this.counter.Add();
                this.pipes[i].collided = true;
            }

            // Check death
            for (var j = 0; j < this.pipes[i].deathRects.length; j++) {
                if (this.pipes[i].deathRects[j].Intersects(this.brickman.rect)) {
                    this.gameover = true;
                }
            }
        }
    };

    this.Draw = function (context) {
        context.clearRect(0, 0, clientWidth, clientHeight);
        this.background.Draw(context);
        
        for (var i = 0; i < this.pipes.length; i++) {
            this.pipes[i].Draw(context);
        }

        this.brickman.Draw(context);
        this.counter.Draw(context);

        if (this.gameover) {
            context.font = "20px Arial";
            context.textAlign = "center";
            context.fillStyle = "white";
            context.fillText("Press space!", clientWidth / 2, clientHeight - 160);

            context.font = "60px Arial";
            context.fillText("Game Over!", clientWidth / 2, clientHeight - 200);
        }
    };
};

TitleState = function (gsm) {
    this.gsm = gsm;
    this.textOpacity = 0;

    this.Init = function () {
        this.background = new Background();
        this.brickman = new Brickman();

        this.music = new Sound("assets/audio/title.mp3", true);
        this.music.Play();
    };

    this.GetControlableSounds = function () {
        return [this.music];
    };

    this.Update = function (dt) {
        if (input.keys.Contains(32)) {
            this.music.Stop();

            this.gsm.SetState(this.gsm.ingameState);
        }

        this.background.Update(dt);
        this.brickman.Update(dt);

        if (this.textOpacity < 1) {
            this.textOpacity += 0.01;
        }
    };

    this.Draw = function (context) {
        context.clearRect(0, 0, clientWidth, clientHeight);

        this.background.Draw(context);
        this.brickman.Draw(context);

        context.font = "100px Arial";
        context.textAlign = "center";
        
        var color = new Color(255, 255, 255, this.textOpacity);
        context.fillStyle = color.ToStandard(true);

        context.fillText("Brickman", clientWidth / 2, clientHeight - 200);

        context.font = "20px Arial";
        context.fillText("Press space!", clientWidth / 2, clientHeight - 160);
    };
};