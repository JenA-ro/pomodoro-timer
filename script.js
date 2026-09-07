const tabs = document.querySelectorAll("[data-tab-target]"); 
const tabContent = document.querySelectorAll("[data-tab-content]");
// time variables
const minutes = 0.1; // change to 25 later, use 0.1 (6 sec) for testing
let time = minutes * 60;
const countdown = document.getElementById('timer');
// buttons
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const resumeBtn = document.getElementById('resume-btn');
// interval text
const interval = document.getElementById('interval-text');
// header buttons
const soundBtn = document.getElementById("sound-btn");
// popup and popup buttons
const sound_popup = document.getElementById("sound-popup");
const brownNoiseBtn = document.getElementById("brown-noise-btn");
const greenNoiseBtn = document.getElementById("green-noise-btn");
const pinkNoiseBtn = document.getElementById("pink-noise-btn");
const whiteNoiseBtn = document.getElementById("white-noise-btn");
const closeBtn = document.getElementById("close-sound-popup");
// blur overlay
const overlay = document.getElementById("overlay");




// Function: allows tab (li tag) to be clicked and switch to that clicked tab 
tabs.forEach(tab => {
  tab.addEventListener('click', () =>{
    const target = document.querySelector(tab.dataset.tabTarget)
    tabContent.forEach(tabContent =>{
      tabContent.classList.remove('active')
    })
    tabs.forEach(tab => {
      tab.classList.remove('active')
    })
    tab.classList.add('active')
    target.classList.add('active')
  })
});
                                        //later: make sure start button can only start on Pomodoro or Break tab
let timeID;
// let time_left;
//Timer functions
//Function: countdown timer for Pomodoro
function pomodoroCountdown() {
  const minutes = Math.floor(time/60);

  let seconds = time % 60;

  seconds = seconds < 10 ? '0' + seconds : seconds;

  countdown.innerHTML = `${minutes}:${seconds}`;
  time--;
  if (time < 0) { // time stops at 0:00
    clearInterval(timeID);
  }
};
// Function: start button to start pomodoro countdown timer
startBtn.addEventListener('click', (event) => {
  timeID = setInterval(pomodoroCountdown, 1000);
  startBtn.style.display = 'none';
  stopBtn.style.display = 'block';
  resetBtn.style.display = 'block';

});
// Function: pause Pomodoro timer
// Post: if paused, make pause button hidden and display resume button
stopBtn.onclick = pause_clock;
function pause_clock() {
  clearInterval(timeID);
  resumeBtn.style.display = 'block';
  stopBtn.style.display = 'none';
    // save time left
}
// Function: resume Pomodoro timer
// Post: if resumed, make resume button hidden and display pause button
resumeBtn.onclick = resume_clock;
function resume_clock() {
  timeID = setInterval(pomodoroCountdown, 1000);
  resumeBtn.style.display = 'none';
  stopBtn.style.display = 'block';
}

//Function: reset timer
// timeId = setInterval(pomodoroCountdown() {
//   startBtn.addEventListener('click', (event) => 
// }, 1000) 
// resetBtn.addEventListener('click', (event) => {
//   clearInterval(timeID);
//   minutes = 25;
//   countdown.innerHTML = '25:00';
// })





// Sound popup
// Open sound popup
soundBtn.onclick = openPopup;
function openPopup() {
  sound_popup.classList.add("openPopup");
  overlay.classList.add("active");
}
// Close sound popup
closeBtn.onclick = closePopup;
function closePopup() {
  sound_popup.classList.remove("openPopup");
  overlay.classList.remove("active");
}

// Variables for generating and playing noise audio
let audioContext = null;
let audioSource = null;
let noiseType = null;

let whiteNoiseFilter = null;
let greenNoiseFilter = null;

const buffers = {
  brownNoise: null,
  greenNoise: null,
  pinkNoise: null,
  whiteNoise: null,
};

// Noise Generators
/* 
  * Generates brown noise
  * @param {number} channelData: audio sample of a specific channel
  * @param {number} bufferLength: the total number of sample frames
*/
function generateBrownNoise(channelData, bufferLength) {
  let output = 0.0;
  for (let i = 0; i < bufferLength; i++) {
    const white = Math.random() * 2 - 1;
    channelData[i] = (output + (0.02 * white)) / 1.02;
    output = channelData[i];
    channelData[i] *= 3.5;
  }
}
/* 
  * Generates green noise
  * @param {number} channelData: audio sample of a specific channel
  * @param {number} bufferLength: the total number of sample frames
*/
function generateGreenNoise(channelData, bufferLength) {
  for (let i = 0; i < bufferLength; i++) {
    channelData[i] = Math.random() * 2 - 1;
  }
}
/* 
  * Generates pink noise
  * @param {number} channelData: audio sample of a specific channel
  * @param {number} bufferLength: the total number of sample frames
*/
function generatePinkNoise(channelData, bufferLength) {
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferLength; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      channelData[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      channelData[i] *= 0.11;
      b6 = white * 0.115926;
    }
}
/* 
  * Generates white noise
  * @param {number} channelData: audio sample of a specific channel
  * @param {number} bufferLength: the total number of sample frames
*/
function generateWhiteNoise(channelData, bufferLength) {
  for (let i = 0; i < bufferLength; i++) {
    channelData[i] = Math.random() * 2 - 1;
  }
}

// Stores all noise audio into buffers object
function renderBuffer() {
  const bufferLength = 5 * audioContext.sampleRate; // 5 seconds of audio

  ["brownNoise", "greenNoise", "pinkNoise", "whiteNoise"].forEach(type => {
    const buffer = audioContext.createBuffer(2, bufferLength, audioContext.sampleRate);

    // Choose which noise to buffer
    // numberOfChannels: audio channels, channel (0) is left speaker and channel (1) is right speaker
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      if (type === "brownNoise") generateBrownNoise(channelData, bufferLength);
      if (type === "greenNoise") generateGreenNoise(channelData, bufferLength);
      if (type === "pinkNoise") generatePinkNoise(channelData, bufferLength);
      if (type === "whiteNoise") generateWhiteNoise(channelData, bufferLength);
    }
    buffers[type] = buffer;
  })
}
// Prepare audio before playing
function setUpAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext) ();
    renderBuffer();
  }
}

// Playback to speakers
function startPlayback(selectedNoise, button) {
  setUpAudio();
  
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  // Clicking button of currently playing audio pauses the audio
  if (audioSource && noiseType === selectedNoise) {
    audioSource.stop();
    audioSource.disconnect();
    audioSource = null;
    noiseType = null;
    button.textContent = "▶";
    return;
  }
  if (audioSource) {
    audioSource.stop();
    audioSource.disconnect();
  }

  // Plays noise audio
  noiseType = selectedNoise;
  audioSource = audioContext.createBufferSource();
  audioSource.buffer = buffers[noiseType];
  audioSource.loop = true;

  if (noiseType === "whiteNoise") {
    whiteNoiseFilter = audioContext.createBiquadFilter();
    whiteNoiseFilter.type = "lowpass";
    whiteNoiseFilter.frequency.value = 2000;
    audioSource.connect(whiteNoiseFilter);
    whiteNoiseFilter.connect(audioContext.destination);
  } 
  else if (noiseType === "greenNoise") {
    greenNoiseFilter = audioContext.createBiquadFilter();
    greenNoiseFilter.type = "bandpass";
    greenNoiseFilter.frequency.value = 500;
    greenNoiseFilter.Q.value = 1;
    audioSource.connect(greenNoiseFilter);
    greenNoiseFilter.connect(audioContext.destination);
  }
  else {
    audioSource.connect(audioContext.destination);
  }
  audioSource.start();
  button.textContent = "⏸";
}

// Button events
brownNoiseBtn.onclick = playBrownNoiseAudio;
greenNoiseBtn.onclick = playGreenNoiseAudio;
pinkNoiseBtn.onclick = playPinkNoiseAudio;
whiteNoiseBtn.onclick = playWhiteNoiseAudio;

function playBrownNoiseAudio() {
  startPlayback("brownNoise", brownNoiseBtn);
}
function playGreenNoiseAudio() {
  startPlayback("greenNoise", greenNoiseBtn);
}
function playPinkNoiseAudio() {
  startPlayback("pinkNoise", pinkNoiseBtn);
}
function playWhiteNoiseAudio() {
  startPlayback("whiteNoise", whiteNoiseBtn);
}