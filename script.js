// DEKLARATIONEN
const container = document.getElementById("container4"); // Assuming 'container4' is a parent that will always exist
const neueFundstelleWrapHTML = `
  <div class="fundstelleQuelle">
    <div class="fundstelleQuelleText"></div>
    <div class="fundstelleIcons">
      <i class="fa-solid fa-section"></i>
      <i class="fa-solid fa-arrow-down-short-wide"></i>
      <i class="fa-solid fa-hand" draggable="true"></i>
      <i class="fa-solid fa-xmark"></i>
    </div>
  </div>
  <div class="fundstelleInhalt"></div>
`;
let isVerschiebenAktiv = false;


// Diese Funktion wird beim Laden der Webseite aufgerufen
function initializeFontSize() {
  // Standard-Schriftgröße im Local Storage speichern, wenn noch nicht vorhanden
  var initialFontSize = localStorage.getItem('fontsize') || '14px';
  localStorage.setItem('fontsize', initialFontSize);

  // Schriftgröße für den Body und alle 'fundstelleInhalt' Elemente setzen
  setFontSize(initialFontSize);
}

// FUNDSTELLENCONTAINER MINIMIERE > mit ANIMATIONEN
window.minimizeMaximize = function () {

  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('fa-arrow-down-short-wide')) {
      let inhaltContainer = event.target.closest('.fundstelleWrap').querySelector('.fundstelleInhalt');
      if (inhaltContainer) {
        // Check if the element is currently collapsed        
        if (inhaltContainer.style.height === '0px') { // If collapsed, expand it        
          inhaltContainer.style.height = inhaltContainer.scrollHeight + 'px';
          inhaltContainer.classList.remove('fundstelleInhaltMinimized');
        } else { // If expanded, collapse it
          inhaltContainer.style.height = inhaltContainer.scrollHeight + 'px'; // Need to reset height to scrollHeight first for consistent animation
          setTimeout(() => inhaltContainer.style.height = '0', 0);
          inhaltContainer.classList.add('fundstelleInhaltMinimized');
        }
        event.target.classList.toggle('rotated'); // Toggle the rotation class for the icon
        console.log(event.target);
      }
    }
  });
};

// Aufrufen MINIMIERE FUNDSTELLENCONTAINER
minimizeMaximize();

// KLICK - X-ICON WIRD GEKLICKT
document.addEventListener('click', function (event) {
  if (isVerschiebenAktiv) { return; }
  if (event.target.classList.contains('fa-solid') && event.target.classList.contains('fa-xmark')) {
    let fundstelleWrap = event.target.closest('.fundstelleWrap');
    if (fundstelleWrap) {
      showConfirmationPopup(fundstelleWrap, event.target);
    }
  }
});

function showConfirmationPopup(fundstelleWrap, target) {
  var popup = document.getElementById('confirmationPopup');
  var overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  
  // Position des X-Symbols ermitteln
  var rect = target.getBoundingClientRect();
  var top = rect.top + window.scrollY;
  var left = rect.left + window.scrollX;

  // Popup positionieren
  popup.style.top = top + 'px';
  popup.style.left = left - 40 + 'px';

  popup.style.display = 'block';
  overlay.style.display = 'block';

  document.getElementById('confirmButton').onclick = function() {
    fundstelleWrap.remove();
    closePopup();
    saveToBrowser();
  };

  document.getElementById('cancelButton').onclick = function() {
    closePopup();
  };
}

function closePopup() {
  var popup = document.getElementById('confirmationPopup');
  var overlay = document.querySelector('.overlay');
  popup.style.display = 'none';
  overlay.remove();
}

// FUNDSTELLEQUELLE - TEXT ÄNDERN
document.addEventListener('dblclick', function (event) {
  // if (isVerschiebenAktiv) { return; } // Verhindert das Erstellen eines neuen Containers während des Ziehens

  // nur bei fundstelleQuelleText
  let fundstelleQuelle = event.target.closest('.fundstelleQuelle');
  let fundstelleQuelleText = fundstelleQuelle ? fundstelleQuelle.querySelector('.fundstelleQuelleText') : null;

  if (fundstelleQuelleText && event.target === fundstelleQuelleText) {
    // Benutzerinput
    let userInput = prompt("Quellenangabe ändern", fundstelleQuelleText.innerText);
    // Wenn "abbrechen" geklickt wurde, wird der Text nicht geändert
    if (userInput !== null) {
      fundstelleQuelleText.innerText = userInput; // Ändert den Text nur, wenn der Benutzer nicht auf "Abbrechen" geklickt hat
      saveToBrowser(); // ALLS SPEICHERN im Browser
    }
  }
});


// REIHENFOLGE DER FUNDSTELLEN 
container.addEventListener('mousedown', function (event) {
  if (event.target.classList.contains('fa-hand')) {
    isVerschiebenAktiv = true;
    let draggedItem = event.target.closest('.fundstelleWrap');

    let debounceTimer; // For debouncing dragOver events
    let lastDragOverIndex = null; // To track the last index of drag over item

    container.addEventListener('dragover', dragOver);
    container.addEventListener('drop', drop);

    function dragOver(e) {
      e.preventDefault();

      // Debounce implementation
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        let draggingOverItem = e.target.closest('.fundstelleWrap');
        if (draggingOverItem && draggedItem !== draggingOverItem) {
          // Determine position and move draggedItem
          const draggingOverIndex = Array.from(container.children).indexOf(draggingOverItem);
          const draggedItemIndex = Array.from(container.children).indexOf(draggedItem);

          // Additional logging for debugging
          if (draggingOverIndex < draggedItemIndex) {
            if (lastDragOverIndex !== draggingOverIndex) {
              container.insertBefore(draggedItem, draggingOverItem);
              lastDragOverIndex = draggingOverIndex; // Update last index
            }
          } else {
            if (lastDragOverIndex !== draggingOverIndex) {
              container.insertBefore(draggedItem, draggingOverItem.nextSibling);
              lastDragOverIndex = draggingOverIndex; // Update last index
            }
          }
        }
      }, 10); // 50 milliseconds debounce time
    }

    function drop(e) {
      e.preventDefault();
      container.removeEventListener('dragover', dragOver);
      container.removeEventListener('drop', drop);
      isVerschiebenAktiv = false; // Reset flag after drop
      clearTimeout(debounceTimer); // Clear debounce timer

    }
  }
});

// (INHALT) DRAG to QUELLE
container.addEventListener("dragover", (e) => {
  if (isVerschiebenAktiv) return;
  if (e.target.classList.contains("fundstelleQuelleText")) {
    e.preventDefault();
    if (e.target.textContent.trim() === "") { e.target.classList.add("fundstelleQuelleTextHovered"); } // FARBE ON HOVER +
  }
});

container.addEventListener("dragleave", (e) => {
  if (e.target.classList.contains("fundstelleQuelleText")) {
    e.target.classList.remove("fundstelleQuelleTextHovered"); // FARBE ON HOVER -
  }
});

// (INHALT) DRAG to FUNDSTELLEINHALT
container.addEventListener("dragover", (e) => {
  if (isVerschiebenAktiv) return;
  console.log("D0");
  if (e.target.classList.contains("fundstelleInhalt")) {
    e.preventDefault();
    if (e.target.textContent.trim() === "") { e.target.classList.add("fundstelleInhaltHovered"); } // FARBE ON HOVER +
  }
});

container.addEventListener("dragleave", (e) => {
  if (e.target.classList.contains("fundstelleInhalt")) {
    e.target.classList.remove("fundstelleInhaltHovered"); // FARBE ON HOVER -
  }
});

// /QUELLE) DRAG FUNDSTELLE-WRAP    
container.addEventListener("drop", (e) => {
  if (isVerschiebenAktiv) { return; } //Damit kein neuer Container erstellt wird

  // Check if the target is a fundstelleInhalt or fundstelleQuelle
  if (e.target.classList.contains("fundstelleInhalt") || e.target.classList.contains("fundstelleQuelleText")) {
    e.preventDefault(); // Prevent default behavior
    if (e.target.textContent.trim() === "") { // inhalt soll nicht überschrieben werden

      // INHALT 
      if (e.target.classList.contains("fundstelleInhalt")) {
        e.target.maxHeight = container.scrollHeight + 'px';
        let data = e.dataTransfer.getData("text/plain");
        e.target.innerText = data;
        e.target.innerText = convertToPlainText(e.target.innerHTML);
        e.target.classList.remove("fundstelleInhaltHovered"); // FARBE ON HOVER -
        saveToBrowser(); // ALLS SPEICHERN im Browser


        // QUELLE   
      } else if (e.target.classList.contains("fundstelleQuelleText")) {
        let data = e.dataTransfer.getData("text/html");
        let dataPlain = e.dataTransfer.getData("text/plain");

        let plainTextContent = fundstelleErmitteln(data);

        if (dataPlain.length < 100) { // falls es keine Beck Quelle ist
          e.target.innerText = dataPlain.replace(/\r\n|\n|\r/g, " ");
        } else {
          e.target.innerHTML = plainTextContent

        }
        // Farbe ändern
        e.target.classList.remove("fundstelleQuelleTextHovered"); // FARBE ON HOVER -
        saveToBrowser(); // ALLS SPEICHERN im Browser
      }
    }
    console.log("D4");
    e.stopPropagation(); // Stop the event from bubbling up
  }

});

// DRAG AD DROP // NEUE FUNDSTELLE
container4.addEventListener("dragover", (e) => {
  // if (isVerschiebenAktiv) {return;} //Damit kein neuer Container erstellt wird
  e.preventDefault(); // Necessary to allow drop
});

// NEUE FUNSTELLE ERSTELLEN UND EIGENSCHAFTEN DER NEUEN FUNDSTELLE FESTLEGEN
container4.addEventListener("drop", (e) => {
  if (isVerschiebenAktiv) { return; } //Damit kein neuer Container erstellt wird
  e.preventDefault(); // Prevent default behavior

  if (e.target === container4) {
    const data = e.dataTransfer.getData("text/plain");
    const newDiv = document.createElement("div");
    newDiv.className = "fundstelleWrap";
    newDiv.innerHTML = neueFundstelleWrapHTML;

    container4.appendChild(newDiv);

    // Hier wird der gezogene Text eingefügt
    const fundstelleInhaltDiv = newDiv.querySelector('.fundstelleInhalt');
    fundstelleInhaltDiv.innerText = data;
    fundstelleInhaltDiv.innerText = convertToPlainText(fundstelleInhaltDiv.innerHTML);
    saveToBrowser(); // ALLES SPEICHERN im Browser
  }
});



// HIGHLIGHT TEXT
function highlightSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return false;

  const range = selection.getRangeAt(0);
  const selectedText = range.toString();

  if (selectedText.length < 2) { return; }// sonst wird bei jedem Click (auch rechtsklick) heimlich yellow im HTML eingefügt

  const tempContainer = document.createElement("div");
  tempContainer.appendChild(range.cloneContents());

  const selectedHTML = tempContainer.innerHTML;

  if (selectedHTML.includes("background-color: yellow") || selectedHTML.includes("background-color: rgb(150, 230, 247)")) {
    range.deleteContents();
    range.insertNode(document.createTextNode(selectedText));
  } else {
    const span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    range.surroundContents(span);
  }

  window.getSelection().removeAllRanges();
}

// Event listener for mouseup event on the whole document
document.addEventListener("mouseup", (event) => {
  // Check if the mouse was released over an element with a class starting with "text"
  if (event.target.classList.value.startsWith("fundstelleInhalt")) {
    highlightSelection();
    saveToBrowser(); // ALLS SPEICHERN im Browser
  }

});

// FARBE des HIGHLIGHTS ÄNDERN (YELLOW TO BLUE)
function toggleColorOnClick(event) {
  const selection = window.getSelection();
  if (selection.toString().length > 0) {// Prüfen, ob Text markiert ist. Wenn ja, nichts tun.
    return;
  }

  let targetElement = event.target;
  if (targetElement.tagName === 'SPAN' && (targetElement.style.backgroundColor === 'yellow' || targetElement.style.backgroundColor === 'rgb(150, 230, 247)')) {
    // Wechseln der Farbe
    targetElement.style.backgroundColor = targetElement.style.backgroundColor === 'yellow' ? 'rgb(150, 230, 247)' : 'yellow';
  }
}

// CLICK EVENT FARBE AENDERN ()
document.addEventListener('click', toggleColorOnClick);


// HIGHLIGHT ENDE ////////////////////////////////////////////////////////////////////// 


// FUNDSTELLE AUS HTML ZIEHEN um FUNDSTELLE IN FUNDSTELLEQUELLE zu zeigen
function fundstelleErmitteln(data) {

  // Sucht nach idealer Fundstellenbezeichnung zitMitAuflage...
  const dataMatch2 = data.match(/'zitMitAuflage'\)" style="cursor: pointer;">(.*?)<\/div>/);
  let citationText2 = '';
  if (dataMatch2 && dataMatch2.length > 1) {
    citationText2 = dataMatch2[1].replace(/<a[^>]*>(.*?)<\/a>/g, '$1').trim();
  }

  // Nur wenn dies leer ist, z.B. bei NZA, dann suche nach citation
  let citationText = '';
  if (!citationText2) {
    const dataMatch = data.match(/(?<=citation").+?(?=<\/span>)/) || [''];
    citationText = (dataMatch[0] || '')
      .replace('style="margin-left: 10px; display: block; float: right;">', '')
      .replace(/<a[^>]*>(.*?)<\/a>/g, '$1') // Entfernt die <a>-Tags, behält aber den Textinhalt
      .trim();
  }

  // "ENTSCHEIDUNG" 
  rnFundstelleMatch = data.match(/(?<="entscheidung").+?(?=<\/td>)/) || [''];
  const rnFundstelle = rnFundstelleMatch[0]
    .replace(/<[^>]+>/g, ''); // Entfernt sämtliche HTML-Tags

  // "PARNR""
  const rnGesetzMatch = data.match(/(?<="parnr").+?(?=<\/span>)/) || [''];
  const rnGesetz = rnGesetzMatch[0]
    .replace(/<[^>]+>/g, ''); // Entfernt sämtliche HTML-Tags

  // "ABK" (Abkürzung des Gesetzes) - gehört mit PARNR zusammen um § 613 + BGB  zu haben
  const rnGesetzABKMatch = data.match(/(?<="abk").+?(?=<\/span>)/) || [''];
  const rnABKGesetz = rnGesetzABKMatch[0]
    .replace(/<[^>]+>/g, ''); // Entfernt sämtliche HTML-Tags

  // KOMBINIERT
  let result = citationText2 + ' ' + citationText + ' ' + rnFundstelle + ' ' + rnGesetz + ' ' + rnABKGesetz;
  result = result.replace(/<br>|\\n/g, ' ').replace(/:/g, ' ').replace(/[\[\]]/g, ''); // 
  return result.replace(/>/g, '');
}

// 
function cleanText(input) {
  // Remove numbers glued to the beginning of words
  input = input.replace(/\d+([A-Za-z]{3,})/g, '$1'); // "45Gehen", "2Zahl" entfernen 
  input = input.replace(/ \(→.*?\)/g, ''); // (→ Rn. XY)

  return input
}

// 
function convertToPlainText(text) {
  // text = text.replace(/ \(→.*?\)/g, ''); // (→ Rn. XY)

  let cleanedText = text.replace(/<br><br>/g, '\n');
  cleanedText = cleanedText.replace(/<br>/g, '\n');
  cleanedText = cleanedText.replace(/\n/g, '\n\n');
  cleanedText = cleanedText.replace(/\d+([^\d\s]{2,})/g, '$1'); // 45Günstig 3Geh usw.

  return cleanedText.replace(/<br>|\\n/g, ' ').trim(); // Absätze am Anfang entfernen
};


function saveToBrowser() {
  var container = document.getElementById('container4');
  var titleElement = document.getElementById("titleOfResearch");
  localStorage.setItem('rechercheToolStorage', container.innerHTML);
  localStorage.setItem('rechercheToolStorageTitel', titleElement.innerText);
}

function loadFromBrowser() {
  var storedContent = localStorage.getItem('rechercheToolStorage');
  var storedContentTitle = localStorage.getItem('rechercheToolStorageTitel');
  if (storedContent) {
    document.getElementById('container4').innerHTML = storedContent;
    document.getElementById('titleOfResearch').innerText = storedContentTitle;
  }
}


function saveToFile() {
  var container = document.getElementById('container4').innerHTML;
  var titleElement = document.getElementById("titleOfResearch");
  var dateiNameText = titleElement ? titleElement.innerText : 'defaultName';
  var date = new Date();
  var formattedDate = date.getFullYear() + ' ' + String(date.getMonth() + 1).padStart(2, '0') + ' ' + String(date.getDate()).padStart(2, '0');
  
  var blob = new Blob([container], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = dateiNameText + '_research_' + formattedDate + '.txt'; // Geänderte Zeile
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


function loadFromFile() {

  var fileInput = document.getElementById('fileInput');
  var file = fileInput.files[0]; // Erste ausgewählte Datei nehmen
  if (!file) {
    return; // Wenn nichts ausgewählt wird
  }

  var reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('container4').innerHTML = e.target.result;
  };

  var fileNameWithoutExtension = file.name.split('_research_')[0]; // Geänderte Zeile
  document.getElementById('titleOfResearch').innerText = fileNameWithoutExtension;

  reader.readAsText(file); // Datei als Text lesen 
}


function changeTitle() {
  var newTitle = prompt("Namen eingeben");
  if (newTitle) {
    document.getElementById("titleOfResearch").innerHTML = newTitle;
    saveToBrowser(); // ALLS SPEICHERN im Browser
  }
}


function collapseAll() {
  let fundstelleWraps = document.querySelectorAll('.fundstelleWrap');

  fundstelleWraps.forEach(function (wrap) {
    let inhaltContainer = wrap.querySelector('.fundstelleInhalt');
    if (inhaltContainer && inhaltContainer.style.height !== '0px') {
      inhaltContainer.style.height = inhaltContainer.scrollHeight + 'px';
      setTimeout(() => inhaltContainer.style.height = '0', 0);
      inhaltContainer.classList.add('fundstelleInhaltMinimized');

      let icon = wrap.querySelector('.fa-arrow-down-short-wide');
      if (icon && !icon.classList.contains('rotated')) {
        icon.classList.add('rotated');
      }
    }
  });
}

function collapseAll() {
  let fundstelleWraps = document.querySelectorAll('.fundstelleWrap');

  fundstelleWraps.forEach(function (wrap) {
    let inhaltContainer = wrap.querySelector('.fundstelleInhalt');
    if (inhaltContainer && inhaltContainer.style.height !== '0px') {
      inhaltContainer.style.height = inhaltContainer.scrollHeight + 'px';
      setTimeout(() => inhaltContainer.style.height = '0', 0);
      inhaltContainer.classList.add('fundstelleInhaltMinimized');

      let icon = wrap.querySelector('.fa-arrow-down-short-wide');
      if (icon && !icon.classList.contains('rotated')) {
        icon.classList.add('rotated');
      }
    }
  });
}

function expandAll() {
  let fundstelleWraps = document.querySelectorAll('.fundstelleWrap');

  fundstelleWraps.forEach(function (wrap) {
    let inhaltContainer = wrap.querySelector('.fundstelleInhalt');
    if (inhaltContainer && inhaltContainer.style.height === '0px') {
      inhaltContainer.style.height = inhaltContainer.scrollHeight + 'px';
      inhaltContainer.classList.remove('fundstelleInhaltMinimized');

      let icon = wrap.querySelector('.fa-arrow-down-short-wide');
      if (icon && icon.classList.contains('rotated')) {
        icon.classList.remove('rotated');
      }
    }
  });
}

// Funktion zum Hinzufügen eines leeren fundstelleWrap-Containers
function addEmptyFundstelleWrap() {
  const newDiv = document.createElement("div");
  newDiv.className = "fundstelleWrap";
  newDiv.innerHTML = neueFundstelleWrapHTML;

  // Wählen Sie den Container aus, in dem die fundstelleWrap-Divs enthalten sind
  const container = document.getElementById('container4'); // Ersetzen Sie 'container4' mit der entsprechenden ID

  // Finden Sie das erste fundstelleWrap-Div im Container
  const firstFundstelleWrap = container.querySelector('.fundstelleWrap');

  // Fügen Sie den neuen fundstelleWrap-Container vor dem ersten fundstelleWrap-Div ein,
  // oder als erstes Kind des Containers, falls kein fundstelleWrap-Div existiert
  if (firstFundstelleWrap) {
    container.insertBefore(newDiv, firstFundstelleWrap);
  } else {
    container.appendChild(newDiv);
  }
  saveToBrowser(); // ALLS SPEICHERN im Browser
}

function setFontSize(size) {
  // Schriftgröße des Body-Elements setzen
  document.body.style.fontSize = size;

  // Schriftgröße aller 'fundstelleInhalt' Elemente setzen
  var elements = document.querySelectorAll('.fundstelleInhalt');
  if (elements) {
    elements.forEach(function(element) {
      element.style.fontSize = size;
    });
  }
}

function toggleFontSize() {
  // Aktuelle Schriftgröße aus dem Local Storage abrufen
  var currentFontSize = localStorage.getItem('fontsize');

  // Schriftgröße umschalten
  if (currentFontSize === '14px') {
    localStorage.setItem('fontsize', '13px');
  } else {
    localStorage.setItem('fontsize', '14px');
  }

  // Neue Schriftgröße setzen
  setFontSize(localStorage.getItem('fontsize'));
}

// Beim Laden der Webseite aufrufen
document.addEventListener('DOMContentLoaded', initializeFontSize);


window.onload = function() {
  loadFromBrowser();
};


function druckversion() {
  // Create a new window for the print version
  var printWindow = window.open('', '_blank');
  var title = document.getElementById('titleOfResearch').innerText;
  // Start building the HTML content for the print version
  var content = '<html><head><title>' + title + ' Recherche' + ' </title></head><body>';
  var date = new Date();
  var formattedDate = String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' +  date.getFullYear();
  
  // Set styles for the print version
  content += '<style>';
  content += 'div.container { width: 800px; border: none; visibility: hidden; }';
  content += 'div.title { font-size: 20px; font-family: arial;}';
  content += 'div.content { font-size: 14px; width: 800px; font-family: arial;}';
  content += 'div.quelle { font-weight: bold; }';
  content += 'div.date { font-size: 14px; width: 800px; font-family: arial;}';
  content += '</style>';

  // Add the title

  content += '<div class="title">' + title + '</div><br>';

  // Find all fundstelleWrap elements and extract their contents
  var fundstelleWraps = document.getElementsByClassName('fundstelleWrap');
  for (var i = 0; i < fundstelleWraps.length; i++) {
    var quelle = fundstelleWraps[i].getElementsByClassName('fundstelleQuelleText')[0].innerText;
    var inhalt = fundstelleWraps[i].getElementsByClassName('fundstelleInhalt')[0].innerHTML; // Use innerHTML to preserve any HTML formatting

    content += '<div class="content">';
    content += '<div class="quelle">' + quelle + ':</div><br>';
    content += '"' + inhalt + '"' ; // Add the inhalt
    content += '</div><br>';
  }

  // Close the HTML content
  content += '<div class="date">' + '(erstellt: ' + formattedDate + ')' + '</div>';
  content += '</body></html>';

  // Write the content to the new window and print
  printWindow.document.write(content);
  printWindow.document.close();
  /*printWindow.focus();
  printWindow.print();
  printWindow.close();*/
}

