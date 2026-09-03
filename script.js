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
const sound_popup = document.getElementById("sound-popup");
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


// Open sound popup
function openPopup() {
  sound_popup.classList.add("openPopup");
  overlay.classList.add("active");
}

// Close sound popup
function closePopup() {
  sound_popup.classList.remove("openPopup");
  overlay.classList.remove("active");
}