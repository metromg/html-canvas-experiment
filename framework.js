function GetLeft(elm) {
    var left = elm.offsetLeft;
    while (elm = elm.offsetParent) {
        left += elm.offsetLeft;
    }

    // scrollbars
    left -= window.pageXOffset;

    return left;
}

function GetTop(elm) {
    var top = elm.offsetTop;
    while (elm = elm.offsetParent) {
        top += elm.offsetTop;
    }

    // scrollbars
    top -= window.pageYOffset;

    return top;
}

// Array prototypes
Array.prototype.Remove = function (arg, all) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == arg) {
            this.splice(i, 1);

            if (all == null || !all) {
                break;
            }
            else {
                i--;
            }
        }
    }
};

Array.prototype.RemoveAt = function (pos) {
    this.splice(pos, 1);
};

Array.prototype.Clear = function () {
    this.length = 0;
};

Array.prototype.InsertAt = function (arg, pos) {
    this.splice(pos, 0, arg);
};

Array.prototype.Contains = function (arg) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == arg) {
            return true;
        }
    }

    return false;
};

Array.prototype.Occurs = function (arg) {
    var counter = 0;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == arg) {
            counter++;
        }
    }

    return counter;
};

// The vector2
Vector2 = function (x, y) {
    this.x = 0;
    this.y = 0;

    if (x != null) {
        this.x = x;
    }

    if (y != null) {
        this.y = y;
    }

    // set both
    if (x != null && y == null) {
        this.x = x;
        this.y = x;
    }

    this.previousX = 0;
    this.previousY = 0;

    this.Set = function (x, y) {
        if (x == null && y == null) {
            console.warn("Cannot create vector2");
            return;
        }

        this.previousX = this.x;
        this.previousY = this.y;

        if (x != null) {
            this.x = x;
        }

        if (y != null) {
            this.y = y;
        }

        // set both
        if (x != null && y == null) {
            this.x = x;
            this.y = x;
        }
    };

    this.Normalize = function () {
        var tmp = new Vector2(this.x, this.y);

        var magnitude = Math.sqrt((tmp.x * tmp.x) + (tmp.y * tmp.y));
        tmp.x = tmp.x / magnitude;
        tmp.y = tmp.y / magnitude;

        return tmp;
    };

    this.Move = function (vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
    };

    this.Distance = function (vec2) {
        if (vec2 != null) {
            // Pythagoras
            return Math.sqrt(((vec2.x - this.x) * (vec2.x - this.x)) + ((this.y - vec2.y) * (this.y - vec2.y)));
        }

        return Math.sqrt(((this.previousX - this.x) * (this.previousX - this.x)) + ((this.y - this.previousY) * (this.y - this.previousY)));
    };

    this.HasChanged = function () {
        return this.x != this.previousX || this.y != this.previousY;
    };

    this.Difference = function (vec2, invert) {
        var inv = 1;
        if (invert) {
            inv = -1;
        }

        if (vec2 == null) {
            return new Vector2((this.x - this.previousX) * inv, (this.y - this.previousY) * inv);
        }

        return new Vector2((this.x - vec2.x) * inv, (this.y - vec2.y) * inv);
    };
};

Color = function (r, g, b, a) {
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.a = 1;

    if (r != null) {
        this.r = r;
    }

    if (g != null) {
        this.g = g;
    }

    if (b != null) {
        this.b = b;
    }

    if (a != null) {
        this.a = a;
    }

    this.ToStandard = function (alpha) {
        if (alpha != null && alpha) {
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        }

        return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    };
};

// The rectangle
Rectangle = function (x, y, width, height) {
    if (x == null || y == null || width == null || height == null) {
        console.warn("Unable to create rectangle");
        return;
    }

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.color = new Color();

    this.Contains = function (x, y) {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    };

    this.Intersects = function (shape) {
        // Top left
        if (this.Contains(shape.x, shape.y)) {
            return true;
        }

        // Top right
        if (this.Contains(shape.x + shape.width, shape.y)) {
            return true;
        }

        // Bottom left
        if (this.Contains(shape.x, shape.y + shape.height)) {
            return true;
        }

        // Bottom right
        if (this.Contains(shape.x + shape.width, shape.y + shape.height)) {
            return true;
        }

        // Top left other shape
        if (shape.Contains(this.x, this.y)) {
            return true;
        }

        // Top right other shape
        if (shape.Contains(this.x + this.width, this.y)) {
            return true;
        }

        // Bottom left other shape
        if (shape.Contains(this.x, this.y + this.height)) {
            return true;
        }

        // Bottom right other shape
        if (shape.Contains(this.x + this.width, this.y + this.height)) {
            return true;
        }

        return false;
    };

    this.Draw = function (context) {
        context.fillStyle = this.color.ToStandard(true);
        context.fillRect(this.x, this.y, this.width, this.height);
    };
};

Animation = function (width, height, row, column, limit, imgsrc, fps, columns, rows, scaleWidth, scaleHeight) {
    if (fps == null || fps >= 60) {
        this.delay = 1;
    }
    else {
        this.delay = 60 / fps;
    }

    this.fps = fps;
    this.delayCounter = 0;
    this.width = width;
    this.height = height;
    this.scaleWidth = scaleWidth;
    this.scaleHeight = scaleHeight;
    this.rowStart = row;
    this.columnStart = column;
    this.row = row;
    this.column = column;
    this.rows = rows;
    this.columns = columns;

    if (limit == null || limit == 0) {
        this.limit = 999999999999;
    } else {
        this.limit = limit - 1;
    }

    this.limitCount = 0;
    this.image = new Image();
    this.image.src = imgsrc;
    this.position = new Vector2(0);
    this.cropPosition = new Vector2(0);

    // Limit will limit animation to a part of frames in a sprite sheet
    this.SetLimit = function (limit) {
        this.limit = limit - 1;
    };

    this.SetRow = function (num) {
        this.row = num;
        this.rowStart = num;

        this.cropPosition.x = this.width * this.column;
        this.cropPosition.y = this.height * this.row;
    };

    this.SetColumn = function (num) {
        this.column = num;
        this.columnStart = num;

        this.cropPosition.x = this.width * this.column;
        this.cropPosition.y = this.height * this.row;
    };

    this.Update = function (dt) {
        // Update delay using delta time
        var maxFps = 1 / dt;
        if (this.fps == null || this.fps >= maxFps) {
            this.delay = 1;
        }
        else {
            this.delay = maxFps / fps;
        }

        this.cropPosition.x = this.width * this.column;
        this.cropPosition.y = this.height * this.row;

        if (this.columns == null || this.columns == 0) {
            this.columns = this.image.width / this.width;
        }

        if (this.rows == null || this.rows == 0) {
            this.rows = this.image.height / this.height;
        }
    };

    this.Draw = function (context) {
        if (this.delayCounter == 0) {
            // go to next frame
            if (this.limitCount < this.limit) {
                this.limitCount++;
                this.column++;

                // go to next row
                if (this.column >= this.columns) {
                    this.row++;
                    this.column = 0;

                    // go to beginning of sprite sheet
                    if (this.row >= this.rows) {
                        this.column = this.columnStart;
                        this.row = this.rowStart;
                        this.limitCount = 0;
                    }
                }
            }
            else {
                // go to beginning of sprite sheet
                this.column = this.columnStart;
                this.row = this.rowStart;
                this.limitCount = 0;
            }
        }

        // Draw and handle animation speed
        context.drawImage(this.image, this.cropPosition.x, this.cropPosition.y, this.width, this.height, this.position.x, this.position.y, this.scaleWidth, this.scaleHeight);
        this.delayCounter++;

        if (this.delayCounter >= this.delay) {
            this.delayCounter = 0;
        }
    };
};

Input = function () {
    this.keys = [];

    this.mouseIsDown = false;
    this.mousePosition = new Vector2(0);
    this.offset = new Vector2(0);
    this.clamp = new Vector2(0);

    this.IsClickedOnRect = function (rect) {
        return rect.Contains(this.mousePosition.x, this.mousePosition.y) && this.mouseIsDown;
    };
};

var input = new Input();

document.documentElement.onmousemove = function (e) {
    e = e || window.event;

    input.mousePosition.x = e.clientX - input.offset.x;
    input.mousePosition.y = e.clientY - input.offset.y;
};

document.documentElement.onmousedown = function (e) {
    input.mouseIsDown = true;
};

document.documentElement.onmouseup = function (e) {
    input.mouseIsDown = false;
};

document.documentElement.onkeydown = function (e) {
    var keycode;
    if (window.event) {
        keycode = window.event.keyCode;
    }
    else if (e) {
        keycode = e.which;
    }

    if (!input.keys.Contains(keycode)) {
        input.keys.push(keycode);
    }
};

document.documentElement.onkeyup = function (e) {
    var keycode;
    if (window.event) {
        keycode = window.event.keyCode;
    }
    else if (e) {
        keycode = e.which;
    }

    input.keys.Remove(keycode, true);
};

Sound = function (filepath, loop) {
    this.snd = new Audio(filepath);
    this.snd.loop = loop || false;

    this.Play = function () {
        if (this.snd.paused) {
            this.snd.play();
        }
    };

    this.Pause = function () {
        this.snd.pause();
    };

    this.Stop = function () {
        this.snd.pause();
        this.snd.currentTime = 0;
    };

    this.ToggleMute = function () {
        this.snd.muted = !this.snd.muted;
    };

    this.SetMute = function (muted) {
        this.snd.muted = muted;
    };

    this.SetVolume = function (volume) {
        this.snd.volume = volume;
    };
};