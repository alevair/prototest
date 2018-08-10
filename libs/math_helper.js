
function randomVictorDirection() {
    var x = Math.floor(Math.random() * 100) - 50;
    var y = Math.floor(Math.random() * 100) - 50;
    return Victor(x,y).normalize();
}

function randomVictor(min, width) {
    var x = Math.floor(Math.random() * width) + min;
    var y = Math.floor(Math.random() * width) + min;
    return Victor(x,y);
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}