let ANIMATION_SPEED_MS = 50;
const ANIMATION_VOLUME = 0.025;
let array = [];

// array slider
let slider = document.getElementById("arraySizeSlider");
let output = document.getElementById("arraySliderValue");
output.innerHTML = slider.value;

init(parseInt(slider.value));

slider.oninput = function() {
    output.innerHTML = this.value;
    init(parseInt(this.value))
}

// animation speed slider
let timeSlider = document.getElementById("animSpeedSlider");
let timeOutput = document.getElementById("animSpeedValue");
timeOutput.innerHTML = timeSlider.value;

timeSlider.oninput = function() {
    timeOutput.innerHTML = this.value;
    ANIMATION_SPEED_MS = parseInt(this.value);
}

let audioCtx = null;

function init(size) {
    array = [];
    for(let i = 0; i < size; i++) {
        array[i] = Math.random();
        array[i] = array[i] < 0.03 ? 0.03 : array[i]
    }
    showBars();
}

function sort() {
    const copy = [...array];
    const moves = bubbleSort(copy);
    animate(moves);
}

function animate(moves) {
    if(moves.length == 0) {
        showBars();
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;

    if(move.type=="swap") {
        [array[i], array[j]] = [array[j], array[i]];
    }
    
    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);

    showBars(move);
    setTimeout(function() {
        animate(moves);
    }, ANIMATION_SPEED_MS);
}

function bubbleSort(array) {
    const moves = [];
    do {
        var swapped = false;
        for(let i = 1; i < array.length; i++) {
            //moves.push({indices:[i - 1, i], type:"comp"});
            if(array[i - 1] > array[i]) {
                swapped = true;
                moves.push({indices:[i - 1, i], type:"swap"});
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while(swapped);
    return moves;
}

function showBars(move) {
    container.innerHTML="";
    for(let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");
        if(move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
        }
        container.appendChild(bar);
    }
}

function playNote(freq) {
    if(audioCtx == null) {
        audioCtx = new(AudioContext || 
                       webkitAudioContext || 
                       window.webkitAudioContext
                    )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = ANIMATION_VOLUME;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}