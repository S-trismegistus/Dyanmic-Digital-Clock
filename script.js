async function fetchInternetTime() {
  try {
    const resp = await fetch('https://worldtimeapi.org/api/ip');
    const data = await resp.json();
    return new Date(data.datetime);
  } catch(e) { return new Date(); }
}

async function initClock() {
  let currentTime = await fetchInternetTime();

  const hourHand = document.getElementById('hourHand');
  const minuteHand = document.getElementById('minuteHand');
  const secondHand = document.getElementById('secondHand');
  const marksContainer = document.getElementById('marks');
  const dateDisplay = document.getElementById('dateDisplay');
  const centerDot = document.querySelector('.center-dot');
  const clock = document.getElementById('clock');

  const radius = clock.offsetWidth/2;

  // Build tick marks + numbers
  for(let i=0;i<60;i++){
    const mark=document.createElement('div');
    mark.className='mark';
    const angle=i*6-90;
    const len=(i%5===0)?radius*0.12:radius*0.07;
    const w=(i%5===0)?radius*0.018:radius*0.01;
    mark.style.width=w+'px'; mark.style.height=len+'px';
    const d=radius-len/2-5;
    mark.style.left=`calc(50% + ${Math.cos(angle*Math.PI/180)*d}px)`;
    mark.style.top=`calc(50% + ${Math.sin(angle*Math.PI/180)*d}px)`;
    mark.style.transform=`translate(-50%,-50%) rotate(${angle+90}deg)`;
    marksContainer.appendChild(mark);
  }

  for(let n=1;n<=12;n++){
    const num=document.createElement('div');
    num.className='number';
    num.textContent=n;
    const angle=n*30-90;
    const d=radius-radius*0.22;
    num.style.left=`calc(50% + ${Math.cos(angle*Math.PI/180)*d}px)`;
    num.style.top=`calc(50% + ${Math.sin(angle*Math.PI/180)*d}px)`;
    num.style.fontSize=`${Math.round(radius*0.12)}px`;
    num.style.transform='translate(-50%,-50%)';
    marksContainer.appendChild(num);
  }

function updateClock() {
  currentTime.setSeconds(currentTime.getSeconds() + 1);

  const h = currentTime.getHours();
  const m = currentTime.getMinutes();
  const s = currentTime.getSeconds();

  // Rotate hands
  const hourDeg = (h % 12) * 30 + m / 2 + s / 120;
  const minDeg = m * 6 + s / 10;
  const secDeg = s * 6;

  hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
  centerDot.style.transform = `translate(-50%,-50%) rotate(${secDeg}deg)`;

  // Update date
  dateDisplay.textContent = currentTime.toLocaleDateString(undefined, {
    weekday:'short', month:'short', day:'numeric', year:'numeric'
  });

  function scaleHands() {
  const radius = clock.offsetWidth / 2;

  hourHand.style.height = `${radius * 0.45}px`;   // shorter than radius
  minuteHand.style.height = `${radius * 0.65}px`; // reaches closer to edge
  secondHand.style.height = `${radius * 0.80}px`; // almost touches edge
}


  // --- AM/PM theme automatic toggle ---
  // If hour is between 6:00 AM - 5:59 PM => light mode
  // If hour is between 6:00 PM - 5:59 AM => dark mode
  if (h >= 6 && h < 18) {
    document.body.classList.remove('dark'); // morning/day
  } else {
    document.body.classList.add('dark'); // evening/night
  }
}



  updateClock();
  setInterval(updateClock,1000);
}

const canvas = document.getElementById('waveLogo');
const ctx = canvas.getContext('2d');
let t = 0;

function drawWave() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = '#34C759';
  ctx.lineWidth = 2;
  
  for(let x=0; x<canvas.width; x++) {
    const y = 20*Math.sin((x/20)+t) + canvas.height/2;
    if(x===0) ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  }
  
  ctx.stroke();
  t += 0.1;
  requestAnimationFrame(drawWave);
}

drawWave();


initClock();
