const timer = document.getElementById("stopwatch");

var min = 0;
var sec = 0;
var stoptime = true;

function startTimer() {
    console.log("aaa");
    if (stoptime == true) {
        console.log("cc");
        stoptime = false;
        timerCycle();
    }
}
function stopTimer() {
    if (stoptime == false) {
        stoptime = true;
    }
}

function timerCycle() {
    if (stoptime == false) {
        sec = sec + 1;

        timerFormat();
        setTimeout("timerCycle()", 1000);
    }
}

function timerFormat() {
    if (sec >= 60) {
        min = min + 1;
        sec = sec % 60;
    }

    timer.innerHTML = ("00" + min).slice(-2) + ":" + ("00" + sec).slice(-2);
}

function addTimer(addSec) {
    sec += addSec;
    timerFormat();
}

function resetTimer() {
    timer.innerHTML = "00:00";
}