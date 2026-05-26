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
  }
}

/* end borrowed code */