// Code Borrowed from KarenannDonnachie.github.io, and adjusted by Phoebe Biggin 

dragElement(document.getElementById("drag"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // identifies main the draggable tab is moved from
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;

    // remembers where the table was at the start
    elmnt._dragStartLeft = elmnt.offsetLeft;
    elmnt._dragStartTop = elmnt.offsetTop;

    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;

    
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    

    // variables for max cursor position:
    var xMax = window.innerWidth - elmnt.offsetWidth;
    var yMax = window.innerHeight - elmnt.offsetHeight;
    // set the element's new position, but locked within the browser size
    if ((elmnt.offsetLeft - pos1) >= 0 && (elmnt.offsetLeft - pos1) <= xMax) {
         elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
         pos3 = e.clientX;
    }
    if ((elmnt.offsetTop - pos2) >= 0 && (elmnt.offsetTop - pos2) <=yMax) { 
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        pos4 = e.clientY
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;

    if (elmnt._dragStartLeft !== undefined &&
      (elmnt.offsetLeft !== elmnt._dragStartLeft || elmnt.offsetTop !== elmnt._dragStartTop)) {
    window.dispatchEvent(new CustomEvent('cardmoved', { detail: { left: elmnt.offsetLeft, top: elmnt.offsetTop } }));
  }
  }
}

/* end borrowed code */
const card = document.getElementById("drag");
const messageEl = card.querySelector(".spoken");

let currentEvent = 0;

const events = [
  introduction,
  eventOne,
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForFocus() {
  return new Promise(resolve => {
    if (document.hasFocus() && document.visibilityState === 'visible') {
      resolve();
      return;
    }

    function onFocus() {
      window.removeEventListener('focus', onFocus);
      resolve();
    }

    window.addEventListener('focus', onFocus, { once: true });
  });
}

function waitForBlur() {
  return new Promise(resolve => {
    function onBlur() {
      window.removeEventListener('blur', onBlur);
      resolve();
    }

    window.addEventListener('blur', onBlur, { once: true });
  });
}


/* end lookouts */

const introductionScript= [
  "Hello... There",
  "Its nice to meet you",
  "I'm....",
  "This space, I guess",
  "...",
];

const introductionScript2 = [
  "I hope you like it here",
  "I hope you like me",
  "I hope you like this space",
  "..."
];

const Event1 = [
  "Wait, I want to show you something...",
  "...",
  "Do you mind...",
  "viewing something else for just a moment?",
  "...",
  "I need to change the page a bit",
]

const callBack = new Audio('assets/bell.mp3');


async function introduction(done) {
  for(const line of introductionScript){
    updateCardText(line);
    await sleep(2000);
    updateCardText('');
    await sleep(200);
  }
  updateCardText("You can move me around, if you'd like");
  await new Promise(resolve => {
      const onMove = () => { window.removeEventListener('cardmoved', onMove); resolve(); };
      window.addEventListener('cardmoved', onMove);

   });
   await sleep(1000);
  for(const line of introductionScript2){
    updateCardText(line);
    await sleep(2000);
    updateCardText('');
    await sleep(200);
  }
  if (typeof done === 'function') done()
}

async function eventOne(done) {
  for(const line of Event1){
    updateCardText(line);
    await sleep(2000);
    updateCardText('');
    await sleep(200);
  }
  updateCardText("just wait for me to call you back");
  await waitForBlur();
  await sleep(4000);
  callBack.play();
  if (typeof done === 'function') done();
}

function updateCardText(text) {
  messageEl.textContent = text;
}

let isProcessing = false;

function runNextEvent() {
  if (currentEvent >= events.length) return;
  const next = events[currentEvent];
  currentEvent += 1;
  next(runNextEvent);
}

//** delete after */

function skipToEvent(index) {
  const target = Number(index);
  if (Number.isNaN(target) || target < 0 || target >= events.length) return;
  currentEvent = target;
  runNextEvent();
}

