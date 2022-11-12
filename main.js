var canvas = document.getElementById("canvas");

var clientWidth = 800;
var clientHeight = 600;

canvas.width = clientWidth;
canvas.height = clientHeight;
canvas.style.width = clientWidth + "px";
canvas.style.height = clientHeight + "px";

var context = canvas.getContext('2d');

input.offset = new Vector2(GetLeft(canvas), GetTop(canvas));

window.onresize = function () {
    input.offset = new Vector2(GetLeft(canvas), GetTop(canvas));
};

// Initialize here
var gameStateManager = new GameStateManager();

// Handle focus and interupting game loop
var focus = true;
window.onblur = function () {
    focus = false;
};

window.onfocus = function () {
    focus = true;
};

document.onblur = window.onblur;
document.focus = window.focus;

// Main game loop
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var lastTime = Date.now();
var longestFrame = 50 / 1000.0;
var typicalFrame = 16 / 1000.0;

var gameLoop = function () {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    // Handle loosing focus
    if (dt > longestFrame) {
        dt = typicalFrame;
    }

    if (focus) {
        // Update using delta time
        gameStateManager.Update(dt);

        // Draw using context
        gameStateManager.Draw(context);

        //context.font = "10px Arial";
        //context.textAlign = "left";
        //context.fillStyle = "white";
        //context.fillText(dt, 10, 15);
    }

    lastTime = now;
    requestAnimFrame(gameLoop);
};

gameLoop();