// ===== DIGITAL CLOCK & DATE =====
function updateClock() {
  const now = new Date();

  // Time
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  hours = String(hours).padStart(2, '0');

  document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds} ${ampm}`;

  // Date
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
}

updateClock();
setInterval(updateClock, 1000);

// ===== TAB SWITCHING =====
const tabButtons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===== STOPWATCH =====
let swInterval = null;
let swStartTime = 0;
let swElapsed = 0;
let swRunning = false;

const swDisplay = document.getElementById('stopwatch-display');
const swStartBtn = document.getElementById('sw-start');
const swStopBtn = document.getElementById('sw-stop');
const swResetBtn = document.getElementById('sw-reset');

function formatStopwatch(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

function updateStopwatch() {
  const now = Date.now();
  const diff = now - swStartTime + swElapsed;
  swDisplay.textContent = formatStopwatch(diff);
}

swStartBtn.addEventListener('click', () => {
  if (!swRunning) {
    swStartTime = Date.now();
    swInterval = setInterval(updateStopwatch, 10);
    swRunning = true;
    swStartBtn.disabled = true;
    swStopBtn.disabled = false;
  }
});

swStopBtn.addEventListener('click', () => {
  if (swRunning) {
    clearInterval(swInterval);
    swElapsed += Date.now() - swStartTime;
    swRunning = false;
    swStartBtn.disabled = false;
    swStopBtn.disabled = true;
  }
});

swResetBtn.addEventListener('click', () => {
  clearInterval(swInterval);
  swElapsed = 0;
  swRunning = false;
  swDisplay.textContent = '00:00:00.00';
  swStartBtn.disabled = false;
  swStopBtn.disabled = true;
});

// ===== TIMER =====
let tmInterval = null;
let tmRemaining = 0;
let tmRunning = false;

const tmDisplay = document.getElementById('timer-display');
const tmStartBtn = document.getElementById('tm-start');
const tmStopBtn = document.getElementById('tm-stop');
const tmResetBtn = document.getElementById('tm-reset');
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

function formatTimer(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getInputSeconds() {
  const h = parseInt(hoursInput.value) || 0;
  const m = parseInt(minutesInput.value) || 0;
  const s = parseInt(secondsInput.value) || 0;
  return h * 3600 + m * 60 + s;
}

function updateTimerDisplay() {
  tmDisplay.textContent = formatTimer(tmRemaining);
}

tmStartBtn.addEventListener('click', () => {
  if (!tmRunning) {
    if (tmRemaining <= 0) {
      tmRemaining = getInputSeconds();
      if (tmRemaining <= 0) {
        alert('Please set a time greater than 0');
        return;
      }
    }

    tmRunning = true;
    tmStartBtn.disabled = true;
    tmStopBtn.disabled = false;

    hoursInput.disabled = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;

    tmInterval = setInterval(() => {
      tmRemaining--;
      updateTimerDisplay();

      if (tmRemaining <= 0) {
        clearInterval(tmInterval);
        tmRunning = false;
        tmStartBtn.disabled = false;
        tmStopBtn.disabled = true;
        hoursInput.disabled = false;
        minutesInput.disabled = false;
        secondsInput.disabled = false;
        tmDisplay.textContent = '00:00:00';
        alert('Time is up!');
      }
    }, 1000);
  }
});

tmStopBtn.addEventListener('click', () => {
  if (tmRunning) {
    clearInterval(tmInterval);
    tmRunning = false;
    tmStartBtn.disabled = false;
    tmStopBtn.disabled = true;
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
  }
});

tmResetBtn.addEventListener('click', () => {
  clearInterval(tmInterval);
  tmRunning = false;
  tmRemaining = 0;
  tmDisplay.textContent = '00:00:00';
  tmStartBtn.disabled = false;
  tmStopBtn.disabled = true;
  hoursInput.disabled = false;
  minutesInput.disabled = false;
  secondsInput.disabled = false;
  hoursInput.value = 0;
  minutesInput.value = 0;
  secondsInput.value = 0;
});