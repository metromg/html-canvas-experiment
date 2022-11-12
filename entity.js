Background = function () {
    this.image = new Image();
    this.image.src = "assets/sprites/background.png";

    this.imageWidth = 800;
    this.imageHeight = 1200;

    this.imagePositions = [new Vector2(0, 0), new Vector2(0, this.imageHeight)];

    this.y = 0;

    this.Update = function (dt) {
        var speed = 200 * dt;
        this.y -= speed;
        this.imagePositions[0].Set(this.imagePositions[0].x, this.y);
        this.imagePositions[1].Set(this.imagePositions[1].x, this.y + this.imageHeight);

        if (this.y <= 0 - this.imageHeight) {
            this.y = 0;
        }
    };

    this.Draw = function (context) {
        context.drawImage(this.image, this.imagePositions[0].x, this.imagePositions[0].y, this.imageWidth, this.imageHeight);
        context.drawImage(this.image, this.imagePositions[1].x, this.imagePositions[1].y, this.imageWidth, this.imageHeight);
    };
};

Brickman = function () {
    this.position = new Vector2((clientWidth / 2) - 32, (clientHeight / 2) - 32 - 100);

    this.rect = new Rectangle(this.position.x + 16, this.position.y + 30, 32, 32);

    this.anim = new Animation(64, 64, 0, 0, 2, "assets/sprites/brickman.png", 25, 2, 1, 64, 64);
    this.anim.position.Set(this.position.x, this.position.y);

    this.movementSpeed = 0;

    this.SetPosition = function (x, y) {
        this.position = new Vector2(x, y);

        this.rect.x = x + 16;
        this.rect.y = y + 30;

        this.anim.position.Set(x, y);
    };

    this.Update = function (dt) {
        var pos = this.position;

        // A or <-
        if (input.keys.Contains(65) || input.keys.Contains(37)) {
            this.movementSpeed = -250;
        }

        // D or ->
        if (input.keys.Contains(68) || input.keys.Contains(39)) {
            this.movementSpeed = 250;
        }

        if (!(input.keys.Contains(65) || input.keys.Contains(37) || input.keys.Contains(68) || input.keys.Contains(39))) {
            if (this.movementSpeed > 0) {
                this.movementSpeed -= 8;
            }
            else if (this.movementSpeed < 0) {
                this.movementSpeed += 8;
            }
        }


        pos.x = pos.x + (this.movementSpeed * dt);
        if (pos.x <= 0) {
            pos.x = 0;
        }

        if (pos.x >= (clientWidth - this.anim.width)) {
            pos.x = clientWidth - this.anim.width;
        }

        this.SetPosition(pos.x, pos.y);
        this.anim.Update(dt);
    };

    this.Draw = function (context) {
        this.anim.Draw(context);
    };
};

Pipes = function () {
    var random = Math.floor(Math.random() * ((-100) - (-700) + 1) + (-700));

    this.deathRects = [new Rectangle(random, clientHeight, 726, 54), new Rectangle(random + 876, clientHeight, 800, 54)];
    this.liveRect = new Rectangle(random + 724, clientHeight, 152, 54);

    this.image = new Image();
    this.image.src = "assets/sprites/pipes.png";

    this.position = new Vector2(random, clientHeight);

    this.collided = false;

    this.SetPosition = function (x, y) {
        this.position = new Vector2(x, y);

        this.deathRects[0].x = x;
        this.deathRects[0].y = y;

        this.deathRects[1].x = x + 876;
        this.deathRects[1].y = y;

        this.liveRect.x = x + 724;
        this.liveRect.y = y;
    };

    this.Update = function (dt) {
        var y = this.position.y - (180 * dt);
        this.SetPosition(random, y);
    };

    this.Draw = function (context) {
        context.drawImage(this.image, this.position.x, this.position.y, 1600, 54);
    };
};

Counter = function () {
    this.count = 0;
    //this.sound = new Sound("assets/audio/coin.mp3", false);

    this.Add = function () {
        this.count++;
        
        //this.sound.Stop();
        //this.sound.Play();
    };

    this.Draw = function (context) {
        context.textAlign = "center";
        context.font = "50px Arial"
        context.fillStyle = "white";
        context.fillText(this.count, clientWidth / 2, clientHeight - 100);
    };
};

SoundSettingsHandler = function () {
    this.sounds = [];
    this.cooldown = 0;

    this.muted = false;
    this.muteImage = new Image();
    this.muteImage.src = "assets/sprites/soundcontrol/unmute.png";
    this.position = new Vector2(clientWidth - (32 + 10), clientHeight - (32 + 10));
    this.muteRect = new Rectangle(this.position.x, this.position.y, 32, 32);

    this.volumeLevel = 1;
    this.volumePos = new Vector2(clientWidth - (128 + 20), clientHeight - (32 + 10));
    this.volumeDownRect = new Rectangle(this.volumePos.x - 10, this.volumePos.y, 32, 32);
    this.volumeUpRect = new Rectangle(this.volumePos.x + 64, this.volumePos.y, 32, 32);
    this.volumeDownImage = new Image();
    this.volumeDownImage.src = "assets/sprites/soundcontrol/minus.png";
    this.volumeUpImage = new Image();
    this.volumeUpImage.src = "assets/sprites/soundcontrol/plus.png";

    this.AddControlableSound = function (sound) {
        this.sounds.push(sound);
    };

    this.Update = function (dt) {
        if (this.cooldown == 0) {
            // Mute
            if (input.IsClickedOnRect(this.muteRect)) {
                this.cooldown = 30;

                if (this.muted) {
                    this.muteImage.src = "assets/sprites/soundcontrol/unmute.png";
                    this.muted = false;
                }
                else {
                    this.muteImage.src = "assets/sprites/soundcontrol/mute.png";
                    this.muted = true;
                }
            }

            // Volume
            if (input.IsClickedOnRect(this.volumeDownRect)) {
                this.cooldown = 30;

                if (this.volumeLevel >= 0.1) {
                    this.volumeLevel = this.volumeLevel - 0.1;
                }
            }

            if (input.IsClickedOnRect(this.volumeUpRect)) {
                this.cooldown = 30;

                if (this.volumeLevel <= 0.9) {
                    this.volumeLevel = this.volumeLevel + 0.1;
                }
            }

            // Apply
            for (var i = 0; i < this.sounds.length; i++) {
                this.sounds[i].SetMute(this.muted);
                this.sounds[i].SetVolume(this.volumeLevel);
            }
        }
        else {
            this.cooldown -= 1;
        }
    };

    this.Draw = function (context) {
        context.drawImage(this.muteImage, this.position.x, this.position.y, 32, 32);
        
        context.font = "16px Arial";
        context.textAlign = "center";
        context.fillStyle = "white";
        context.fillText((this.volumeLevel * 100).toFixed(0), this.volumePos.x + 32 + 10, this.volumePos.y + 22);

        context.drawImage(this.volumeDownImage, this.volumeDownRect.x, this.volumeDownRect.y, this.volumeDownRect.width, this.volumeDownRect.height);
        context.drawImage(this.volumeUpImage, this.volumeUpRect.x, this.volumeUpRect.y, this.volumeUpRect.width, this.volumeUpRect.height);
    };
};