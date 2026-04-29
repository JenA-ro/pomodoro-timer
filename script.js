const tabs = document.querySelectorAll("[data-tab-target]"); 
const tabContent = document.querySelectorAll("[data-tab-content]");
// time variables
const minutes = 25;
let time = minutes * 60;
const countdown = document.getElementById('timer');
//buttons
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const resumeBtn = document.getElementById('resume-btn');

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
//Timer functions
//Function: countdown timer for Pomodoro
function pomodoroCountdown() {
  const minutes = Math.floor(time/60);

  let seconds = time % 60;

  seconds = seconds < 10 ? '0' + seconds : seconds;

  countdown.innerHTML = `${minutes}:${seconds}`;
  time--;
};
//Function: start button to start pomodoro countdown timer
startBtn.addEventListener('click', (event) => {
  timeID = setInterval(pomodoroCountdown, 1000);
  startBtn.style.display = 'none';
  stopBtn.style.display = 'block';
  resetBtn.style.display = 'block';

});

//Function: pause timer
// if pause, make pause button hidden and display resume button
let paused = false;
let time_left;
stopBtn.onclick = pause_clock;
function pause_clock() {
  // if (!paused) {
  //   paused = true;
  clearInterval(timeID);
  resumeBtn.style.display = 'block';
  stopBtn.style.display = 'none';
    // save time left
  }
// }

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