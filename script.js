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
const taskBtn = document.getElementById("task-btn");
// sound popup + buttons
const sound_popup = document.getElementById("sound-popup");
const brownNoiseBtn = document.getElementById("brown-noise-btn");
const greenNoiseBtn = document.getElementById("green-noise-btn");
const pinkNoiseBtn = document.getElementById("pink-noise-btn");
const whiteNoiseBtn = document.getElementById("white-noise-btn");
const closeSoundBtn = document.getElementById("close-sound-popup");
// task popup + elements
const task_popup = document.getElementById("task-popup");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const closeTaskBtn = document.getElementById("close-task-popup");
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
soundBtn.onclick = openSoundPopup;
function openSoundPopup() {
  sound_popup.classList.add("openPopup");
  overlay.classList.add("active");
}
// Close sound popup
closeSoundBtn.onclick = closeSoundPopup;
function closeSoundPopup() {
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





// Task List
taskBtn.onclick = openTaskPopup;
function openTaskPopup() {
  task_popup.classList.add("openPopup");
  overlay.classList.add("active");
}
// Close sound popup
closeTaskBtn.onclick = closeTaskPopup;
function closeTaskPopup() {
  task_popup.classList.remove("openPopup");
  overlay.classList.remove("active");
}


taskForm.addEventListener("submit", (event) => {
  event.preventDefault(); // prevents page to refresh

  const taskText = taskInput.value.trim(); // get rid of white space at both ends of string
  if (taskText === "") return; // return if input is empty

  // Create elements
  // li
  const li = document.createElement("li");
  // checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  // text span
  const textSpan = document.createElement("span"); // make text into span
  textSpan.textContent = taskText;
  // edit button
  const editBtn = document.createElement("button");
  editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Remix Icon by Remix Design - https://github.com/cyberalien/RemixIcon/blob/master/License --><path fill="currentColor" d="m15.728 9.576l-1.414-1.414L5 17.476v1.414h1.414zm1.414-1.414l1.414-1.414l-1.414-1.414l-1.414 1.414zm-9.9 12.728H3v-4.243L16.435 3.212a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414z"/></svg>`
  editBtn.className = "edit-btn";
  // edit input
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  // delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Remix Icon by Remix Design - https://github.com/cyberalien/RemixIcon/blob/master/License --><path fill="currentColor" d="M4 8h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm2 2v10h12V10zm3 2h2v6H9zm4 0h2v6h-2zM7 5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2h5v2H2V5zm2-1v1h6V4z"/></svg>`;
  // line
  const line = document.createElement("div");
  line.classList.add("task-li", "line");
  
   // container for edit and delete buttons
  const taskButtons = document.createElement("div");
  taskButtons.className = "task-buttons";

  // Save edits for task 
  function saveEdit() {
    const updatedText = editInput.value.trim();

    if (updatedText !== "") {
      textSpan.textContent = updatedText;
    }
    editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Remix Icon by Remix Design - https://github.com/cyberalien/RemixIcon/blob/master/License --><path fill="currentColor" d="m15.728 9.576l-1.414-1.414L5 17.476v1.414h1.414zm1.414-1.414l1.414-1.414l-1.414-1.414l-1.414 1.414zm-9.9 12.728H3v-4.243L16.435 3.212a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414z"/></svg>`
    li.classList.remove("editing");
  }

  // Event listeners
  // Check/Uncheck
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      textSpan.classList.add('completed');
    } else {
      textSpan.classList.remove('completed');
    }
  });
  // Edit
  editBtn.addEventListener('click', () => {
    const isEditing = li.classList.contains("editing");
    
    if (isEditing) {
      saveEdit();
    } else {
      editInput.value = textSpan.textContent;
      li.classList.add("editing");
      editInput.focus();
    }
  });
  editInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter" && li.classList.contains("editing")) {
      event.preventDefault();
      saveEdit();
    }
  });
  // Delete task
  deleteBtn.addEventListener('click', () => {
    li.remove();
  });


  li.classList.add("task-li"); 
  // Add the created elements inside <li> tag
  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(editInput);
  taskButtons.appendChild(editBtn);
  taskButtons.appendChild(deleteBtn);
  li.appendChild(taskButtons);
  li.appendChild(line);

  // Add <li> to <ul>
  taskList.appendChild(li);

  // Clear input field
  taskForm.reset();

});

