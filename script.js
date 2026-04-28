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
//Function: countdown timer for Pomodoro
function pomodoroCountdown() {
  const minutes = Math.floor(time/60);

  let seconds = time % 60;

  seconds = seconds < 10 ? '0' + seconds : seconds;

  countdown.innerHTML = `${minutes}:${seconds}`;
  time--;
};

//Function: start button to start countdown timer
startBtn.addEventListener('click', (event) => {
  setInterval(pomodoroCountdown, 1000);
});