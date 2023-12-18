// DEKLARATIONEN
const container = document.getElementById("fundstellenFenster"); // Assuming 'fundstellenFenster' is a parent that will always exist
const neueFundstelleWrapHTML = `
  <div class="fundstelleQuelle">
    <div class="fundstelleQuelleText"></div>
    <div class="fundstelleIcons">
      <i class="fa-solid fa-pen"></i>
      <i class="fa-solid fa-palette"></i>
      <i class="fa-regular fa-trash-can"></i>
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


// EINZELNER CONTAINER / TOGGLE MINIMIZE
window.minimizeMaximize = function () {
  console.log('sd');
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
      }
    }
  });
};

minimizeMaximize();

// TOGGLE GRÖßE DER CONTAINER / MINIMIZE MAXIMIZE
let areContainersMinimized = false; // Flag to track the containers' state

function toggleMinimize() {
  let fundstelleWraps = document.querySelectorAll('.fundstelleWrap');

  // Toggle the state of the flag
  areContainersMinimized = !areContainersMinimized;

  fundstelleWraps.forEach(function (wrap) {
    let inhaltContainer = wrap.querySelector('.fundstelleInhalt');
    let icon = wrap.querySelector('.fa-arrow-down-short-wide');

    if (inhaltContainer) {
      if (areContainersMinimized) {
        // Collapse the container
        inhaltContainer.style.height = inhaltContainer.scrollHeight + 'px';
        // Give the page a moment to set the height before setting it to 0
        setTimeout(() => inhaltContainer.style.height = '0', 0);
        inhaltContainer.classList.add('fundstelleInhaltMinimized');
      } else {
        // Expand the container
        inhaltContainer.style.height = inhaltContainer.scrollHeight + 'px';
        inhaltContainer.classList.remove('fundstelleInhaltMinimized');
        // Give the page a moment to ensure the transition is applied
        setTimeout(() => inhaltContainer.style.height = inhaltContainer.scrollHeight + 'px', 0);
      }
    }
  });
}


// KLICK auf PEN
document.addEventListener('click', function (event) {

  let clickedIcon = event.target.closest('.fa-pen');   // Check if the clicked element or its parent is an icon with the class 'fa-pen'
  if (!clickedIcon || !clickedIcon.classList.contains('fa-solid')) return;  // If not an icon, or if the icon doesn't have 'fa-solid', return

  let fundstelleWrap = clickedIcon.closest('.fundstelleWrap');   // Find the nearest ancestor element with the class 'fundstelleWrap'

  if (fundstelleWrap) {   // Check if a 'fundstelleWrap' was found
    let fundstelleInhalt = fundstelleWrap.querySelector('.fundstelleInhalt');     // Find the 'fundstelleInhalt' within the 'fundstelleWrap'

    if (fundstelleInhalt) {     // If 'fundstelleInhalt' is found, proceed
      var text = fundstelleInhalt.innerText;
      var editTextArea = document.getElementById('editTextArea');
      editTextArea.value = text;
      document.getElementById('overlayEditWindow').style.display = 'block';
      editTextArea.currentFundstelleInhalt = fundstelleInhalt;       // Store the currently edited 'fundstelleInhalt' container
    }
  }
});

// KLICK - TRASH-ICON WIRD GEKLICKT
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('fa-trash-can')) {
    let fundstelleInhalt = event.target.closest('.fundstelleWrap').querySelector('.fundstelleInhalt');
    if (confirm('INHALT wird gelöscht. Sicher?')) {
      fundstelleInhalt.textContent = '';
    }
  }
});

// KLICK - X-ICON WIRD GEKLICKT
document.addEventListener('click', function (event) {
  // Check if the clicked element is the 'x' icon
  if (event.target.classList.contains('fa-solid') && event.target.classList.contains('fa-xmark')) { // KLICK AUF X
    let fundstelleWrap = event.target.closest('.fundstelleWrap');
    if (fundstelleWrap && confirm('GANZE FUNDSTELLE wird gelöscht. Sicher?')) {
      fundstelleWrap.remove();
    }
  }
});


// KLICK - COLOR-ICON WIRD GEKLICKT
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('fa-palette')) {
    let fundstelleQuelle = event.target.closest('.fundstelleWrap').querySelector('.fundstelleQuelle');
    const colors = [
      'rgb(254, 217, 183)',
      'rgb(255, 255, 255)',
      'rgb(237, 237, 237)',
      'rgb(245, 202, 195)',
      'rgb(153, 193, 185)'
    ];

    let currentColor = fundstelleQuelle.style.backgroundColor;
    let currentIndex = colors.indexOf(currentColor);
    let nextColor = colors[(currentIndex + 1) % colors.length];

    fundstelleQuelle.style.backgroundColor = nextColor;
    saveToBrowser(); // ALLES SPEICHERN im Browser
  }
});


// FUNDSTELLEQUELLE - TEXT ÄNDERN
document.addEventListener('dblclick', function (event) {
  let fundstelleQuelle = event.target.closest('.fundstelleQuelle');  // nur bei fundstelleQuelleText
  let fundstelleQuelleText = fundstelleQuelle ? fundstelleQuelle.querySelector('.fundstelleQuelleText') : null;

  if (fundstelleQuelleText && event.target === fundstelleQuelleText) { // Benutzerinput
    let userInput = prompt("Quellenangabe ändern", fundstelleQuelleText.innerText); // Wenn "abbrechen" geklickt wurde, wird der Text nicht geändert
    if (userInput !== null) {
      fundstelleQuelleText.innerText = userInput; // Ändert den Text nur, wenn der Benutzer nicht auf "Abbrechen" geklickt hat
      saveToBrowser(); // ALLES SPEICHERN im Browser
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

      clearTimeout(debounceTimer);       // Debounce implementation
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
        saveToBrowser(); // ALLES SPEICHERN im Browser


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
        saveToBrowser(); // ALLES SPEICHERN im Browser
      }
    }
    e.stopPropagation(); // Stop the event from bubbling up
  }

});

// DRAG AD DROP // NEUE FUNDSTELLE
fundstellenFenster.addEventListener("dragover", (e) => {
  // if (isVerschiebenAktiv) {return;} //Damit kein neuer Container erstellt wird
  e.preventDefault(); // Necessary to allow drop
});

// NEUE FUNSTELLE ERSTELLEN UND EIGENSCHAFTEN DER NEUEN FUNDSTELLE FESTLEGEN
fundstellenFenster.addEventListener("drop", (e) => {
  if (isVerschiebenAktiv) { return; } //Damit kein neuer Container erstellt wird
  e.preventDefault(); // Prevent default behavior

  if (e.target === fundstellenFenster) {
    const data = e.dataTransfer.getData("text/plain");
    const newDiv = document.createElement("div");
    newDiv.className = "fundstelleWrap";
    newDiv.innerHTML = neueFundstelleWrapHTML;

    fundstellenFenster.appendChild(newDiv);

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
    return;
    // range.deleteContents();
    // range.insertNode(document.createTextNode(selectedText));
  } else {
    const span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    range.surroundContents(span);
  }

  window.getSelection().removeAllRanges();
}

// Event listener attached to the whole document
document.addEventListener("mouseup", (event) => {
  console.log("mouseup");

  // Check if the event target or any of its parents have the class 'fundstelleInhalt'
  let targetElement = event.target;
  do {
    if (targetElement.classList.contains('fundstelleInhalt')) {
      console.log("mouseup on fundstelleInhalt");
      highlightSelection();
      saveToBrowser(); // ALLES SPEICHERN im Browser
      return;
    }

    // Move up in the DOM tree
    targetElement = targetElement.parentElement;
  } while (targetElement);

});



// FARBE des HIGHLIGHTS ÄNDERN (YELLOW TO BLUE)
function toggleColorOnClick(event) {
  const selection = window.getSelection();
  if (selection.toString().length > 0) { // Prüfen, ob Text markiert ist. Wenn ja, nichts tun.
    return;
  }

  let targetElement = event.target;
  if (targetElement.tagName === 'SPAN' && (targetElement.style.backgroundColor === 'yellow' || targetElement.style.backgroundColor === 'rgb(150, 230, 247)' || targetElement.style.backgroundColor === 'rgb(255, 255, 255)')) {
    // Wechseln der Farbe
    if (targetElement.style.backgroundColor === 'yellow') {
      targetElement.style.backgroundColor = 'rgb(150, 230, 247)';
    } else if (targetElement.style.backgroundColor === 'rgb(150, 230, 247)') {
      targetElement.style.backgroundColor = 'rgb(255, 255, 255)';
    } else {
      targetElement.style.backgroundColor = 'yellow';
    }
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

// CLEAN TEXT
function cleanText(input) {
  // Remove numbers glued to the beginning of words
  input = input.replace(/\d+([A-Za-z]{3,})/g, '$1'); // "45Gehen", "2Zahl" entfernen 
  input = input.replace(/ \(→.*?\)/g, ''); // (→ Rn. XY)

  return input
}

// CONVERT TO CLEAN TEXT
function convertToPlainText(text) {
  let cleanedText = text.replace(/<br><br>/g, '\n'); // text = text.replace(/ \(→.*?\)/g, ''); // (→ Rn. XY)
  cleanedText = cleanedText.replace(/<br>/g, '\n');
  cleanedText = cleanedText.replace(/\n/g, '\n\n');
  cleanedText = cleanedText.replace(/\d+([^\d\s]{2,})/g, '$1'); // 45Günstig 3Geh usw.

  return cleanedText.replace(/<br>|\\n/g, ' ').trim(); // Absätze am Anfang entfernen
};

// SPEICHERN IN BROWSERSPEICHER
function saveToBrowser() {
  var container = document.getElementById('fundstellenFenster');
  var titleElement = document.getElementById("titleOfResearch");
  localStorage.setItem('rechercheToolStorage', container.innerHTML);
  localStorage.setItem('rechercheToolStorageTitel', titleElement.innerText);
}

// LADEN AUS BROWSERSPEICHER
function loadFromBrowser() {
  var storedContent = localStorage.getItem('rechercheToolStorage');
  var storedContentTitle = localStorage.getItem('rechercheToolStorageTitel');
  if (storedContent) {
    document.getElementById('fundstellenFenster').innerHTML = storedContent;
    document.getElementById('titleOfResearch').innerText = storedContentTitle;
  }
}

// AUF FESTPLATTE SPEICHERN
function saveToFile() {
  var container = document.getElementById('fundstellenFenster').innerHTML;
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

// VON FESTPLATTE LADEN
function loadFromFile() {
  var fileInput = document.getElementById('fileInput');
  var file = fileInput.files[0]; // Erste ausgewählte Datei nehmen
  if (!file) {
    return; // Wenn nichts ausgewählt wird
  }

  var reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById('fundstellenFenster').innerHTML = e.target.result;
    saveToBrowser(); // ALLES SPEICHERN im Browser
  };

  var fileNameWithoutExtension = file.name.split('_research_')[0]; // Geänderte Zeile
  document.getElementById('titleOfResearch').innerText = fileNameWithoutExtension;

  reader.readAsText(file); // Datei als Text lesen 
}

// TITEL ÄNDERN
function changeTitle() {
  let oldTitle = document.getElementById('titleOfResearch').innerText;

  // Display the prompt with the old title as the default value
  var newTitle = prompt("Enter new title", oldTitle);

  if (newTitle) {
    // Update the title on the page
    document.getElementById("titleOfResearch").innerHTML = newTitle;
    saveToBrowser(); // Save everything in the browser
  }
}


// Funktion zum Hinzufügen eines leeren fundstelleWrap-Containers
function addEmptyFundstelleWrap() {
  const newDiv = document.createElement("div");
  newDiv.className = "fundstelleWrap";
  newDiv.innerHTML = neueFundstelleWrapHTML;

  // Setzen Sie die Höhe von fundstelleInhalt auf 40px
  const fundstelleInhalt = newDiv.querySelector('.fundstelleInhalt');
  fundstelleInhalt.style.height = '40px';

  // Wählen Sie den Container aus, in dem die fundstelleWrap-Divs enthalten sind
  const container = document.getElementById('fundstellenFenster'); // Ersetzen Sie 'fundstellenFenster' mit der entsprechenden ID

  // Finden Sie das erste fundstelleWrap-Div im Container
  const firstFundstelleWrap = container.querySelector('.fundstelleWrap');

  // Fügen Sie den neuen fundstelleWrap-Container vor dem ersten fundstelleWrap-Div ein,
  // oder als erstes Kind des Containers, falls kein fundstelleWrap-Div existiert
  if (firstFundstelleWrap) {
    container.insertBefore(newDiv, firstFundstelleWrap);
  } else {
    container.appendChild(newDiv);
  }
  saveToBrowser(); // ALLES SPEICHERN im Browser
}


function setFontSize(size) {
  // Schriftgröße des Body-Elements setzen
  document.body.style.fontSize = size;

  // Schriftgröße aller 'fundstelleInhalt' Elemente setzen
  var elements = document.querySelectorAll('.fundstelleInhalt');
  if (elements) {
    elements.forEach(function (element) {
      element.style.fontSize = size;
    });
  }
}

function toggleFontSize() {
  // Aktuelle Schriftgröße aus dem Local Storage abrufen
  var currentFontSize = localStorage.getItem('fontsize');

  if (currentFontSize === '14px') {   // Schriftgröße umschalten
    localStorage.setItem('fontsize', '13px');
  } else {
    localStorage.setItem('fontsize', '14px');
  }

  setFontSize(localStorage.getItem('fontsize'));   // Neue Schriftgröße setzen
}

// Beim Laden der Webseite aufrufen
document.addEventListener('DOMContentLoaded', initializeFontSize);

window.onload = function () {
  loadFromBrowser();
};



// COPY PASTE / NEUE FUNSTELLE ERSTELLE STRG+V
fundstellenFenster.addEventListener("paste", (e) => {
  if (isVerschiebenAktiv) { return; } // Verhindert die Erstellung eines neuen Containers, falls 'isVerschiebenAktiv' aktiv ist

  // Überprüfen, ob Text in der Zwischenablage vorhanden ist
  if (e.clipboardData && e.clipboardData.getData) {
    const clipboardText = e.clipboardData.getData("text/plain");

    // Weitere Überprüfungen können hier hinzugefügt werden
    const newDiv = document.createElement("div");
    newDiv.className = "fundstelleWrap";
    newDiv.innerHTML = neueFundstelleWrapHTML;

    // Fügt den neuen Container am Anfang von 'fundstellenFenster' ein
    fundstellenFenster.prepend(newDiv);

    // Einfügen des Textes aus der Zwischenablage in den neuen Container
    const fundstelleInhaltDiv = newDiv.querySelector('.fundstelleInhalt');
    if (fundstelleInhaltDiv) {
      fundstelleInhaltDiv.innerText = clipboardText;
    }

    // Speichern im Browser
    saveToBrowser();

    // Verhindern des Standardverhaltens beim Einfügen
    e.preventDefault();
  }
});





// Event-Handler für Tastendrücke hinzufügen
document.addEventListener('keydown', function (event) {
  var overlay = document.getElementById('overlayEditWindow');
  var editTextArea = document.getElementById('editTextArea');

  // Prüfen, ob das Overlay sichtbar ist
  if (overlay.style.display === 'block') {
    // Schließen des Overlays bei Drücken von Escape
    if (event.key === 'Escape') {
      var bestaetigung = confirm("Möchten Sie das Fenster wirklich schließen, ohne zu speichern?");
      if (bestaetigung) {
        overlay.style.display = 'none';
      }
    }


    // Speichern und Schließen bei Shift + Enter
    if (event.key === 'Enter' && event.shiftKey) {
      // Speichern des Textes und Erhalten von Newlines
      editTextArea.currentFundstelleInhalt.innerHTML = editTextArea.value.replace(/\n/g, '<br>');

      // Overlay ausblenden
      overlay.style.display = 'none';
    }
  }
});


function closeAndSafeEditor() {  
  var overlay = document.getElementById('overlayEditWindow');
  var editTextArea = document.getElementById('editTextArea');
  editTextArea.currentFundstelleInhalt.innerHTML = editTextArea.value.replace(/\n/g, '<br>');
  overlay.style.display = 'none';
}



async function checkWithGPT() {
  // 1. Führe die addEmptyFundstelleWrap Funktion aus

  const userInput = prompt("Frage eingeben");

  if (!userInput || userInput.trim().length <= 10) {
    alert("frage zu kurz...");
    return;
  }

  addEmptyFundstelleWrap();
  // 2. Gehe durch alle fundstelleWrap Container
  const fundstelleWraps = document.querySelectorAll("#fundstellenFenster .fundstelleWrap");
  const newFundstelleWrap = document.querySelector("#fundstellenFenster .fundstelleWrap");
  const newFundstelleQuelleText = newFundstelleWrap.querySelector(".fundstelleQuelleText");
  const newFundstelleQuelle = newFundstelleWrap.querySelector(".fundstelleQuelle");
  newFundstelleQuelleText.innerText = 'GPT Answer:';
  // newFundstelleWrap.querySelector(".fundstelleInhalt").innerHTML += `Automatisierte Antworten auf die Frage: ${userInput}</p>`;

  for (let wrap of fundstelleWraps) {
    const fundstelleQuelle = wrap.querySelector(".fundstelleQuelle");
    const backgroundColor = window.getComputedStyle(fundstelleQuelle).backgroundColor;

    // Prüfe, ob die Hintergrundfarbe 255, 198, 198 ist
    if (backgroundColor === "rgb(254, 217, 183)") {
      const nameFundstelle = wrap.querySelector(".fundstelleQuelleText").innerText;
      const nameInhalt = wrap.querySelector(".fundstelleInhalt").innerText;

      // Warte auf die Antwort von makeRequest0
      const response = await makeRequest0(nameInhalt, userInput);
      if (response) {
        // Füge nameFundstelle und die Antwort in den neuen fundstelleInhalt Container ein
        // newFundstelleWrap.querySelector(".fundstelleInhalt").innerHTML += `<strong><p>${nameFundstelle}</strong>: <br>${response}</p>`;
        newFundstelleWrap.querySelector(".fundstelleInhalt").innerHTML += `<p><strong>${nameFundstelle}</strong>: <br>${response}</p>`;
      }
    }
  }
}


// GPT 35 Zusammenfassung
async function makeRequest0(contextText, userInput) {
  // Get user input for promptText and append pre-given text
  const promptText = userInput + "\n\n Beantworte die Frage nur, wenn Sie aus dem Text hervorgeht. Wenn nicht, schreibe: keine Angabe. ";

  if (!contextText || contextText.trim().length <= 500) {
    return;
  }

  const topPValue = 0.05; // document.getElementById("top_p").value;
  // const model = 'gpt-35-turbo-16k';
  const model = 'gpt-4-32k';

  const response = await fetch('https://chatgpt-api.web.azr.swm.de/chat/nostream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: "system", content: contextText },
        { role: "user", content: promptText }
      ],
      model: model,
      top_p: parseFloat(topPValue)
    })
  });

  if (!response.ok) {
    return;
  }

  const data = await response.json();
  return data.choices[0].message.content;
}


/// DRUCKVERSION NUR BULLETPOINTS
function druckversion2() {
  // Create a new window for the print version
  var printWindow = window.open('', '_blank');
  var title = document.getElementById('titleOfResearch').innerText;
  // Start building the HTML content for the print version
  var content = '<html><head><title>' + title + ' Recherche' + ' </title></head><body>';
  var date = new Date();
  var formattedDate = String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + date.getFullYear();

  // Set styles for the print version
  content += '<style>';
  content += 'div.container { width: 800px; border: none; visibility: hidden; }';
  content += 'div.title { font-size: 20px; font-family: arial;}';
  content += 'div.content { font-size: 14px; width: 800px; font-family: arial;}';
  content += 'div.quelle { font-weight: bold; background-color: #E5E5E5; }'; // BG COLOR
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

    // Regular expression to find highlighted parts
    var regex = /<span style="background-color: (yellow|rgb\(150, 230, 247\));">(.*?)<\/span>/g;
    var match;

    while ((match = regex.exec(inhalt)) !== null) {
      var text = match[2].replace(/<\/?span[^>]*>/g, ''); // Remove span tags
      if (match[1] === 'yellow') {
        content += '• ' + text + '<br>';
      } else if (match[1] === 'rgb(150, 230, 247)') {
        content += '<b>' + text + '</b><br>';
      }
    }

    content += '</div><br>';
  }

  // Close the HTML content
  content += '<div class="date">' + '(erstellt: ' + formattedDate + ')' + '</div>';
  content += '</body></html>';

  // Write the content to the new window and print
  printWindow.document.write(content);
  printWindow.document.close();
  /* Uncomment to enable automatic printing
  printWindow.focus();
  printWindow.print();
  printWindow.close();
  */
}


function druckversion() {
  // Create a new window for the print version
  var printWindow = window.open('', '_blank');
  var title = document.getElementById('titleOfResearch').innerText;
  // Start building the HTML content for the print version
  var content = '<html><head><title>' + title + ' Recherche' + ' </title></head><body>';
  var date = new Date();
  var formattedDate = String(date.getDate()).padStart(2, '0') + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + date.getFullYear();

  // Set styles for the print version
  content += '<style>';
  content += 'div.container { width: 800px; border: none; visibility: hidden; }';
  content += 'div.title { font-size: 20px; font-family: arial;}';
  content += 'div.content { font-size: 14px; width: 800px; font-family: arial;}';
  content += 'div.quelle { font-weight: bold; background-color: #E5E5E5; }'; // BG COLOR
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
    content += '"' + inhalt + '"'; // Add the inhalt
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



function eraseAll() {
  let confirmation = confirm("Wirklich alles löschen?");
  
  if (confirmation) {
    const container = document.getElementById('fundstellenFenster');

    while (container.firstChild) { // Remove all child elements
      container.removeChild(container.firstChild);
    }

    const titleElement = document.getElementById('titleOfResearch');
    titleElement.innerText = '...'; 

    addEmptyFundstelleWrap();
    addEmptyFundstelleWrap();
  }
}




////// TEXTTRANSFORMATIONEN

function entferneNewlines() {
  var editTextArea = document.getElementById('editTextArea');
  let text = editTextArea.value;
  text = text.replace(/\n+/g, ' ');
  editTextArea.value = text; // Aktualisiert den Textbereich mit dem neuen Text
}

function SaetzeTrennen() {
  var editTextArea = document.getElementById('editTextArea');
  let text = editTextArea.value;
  // text = handleUmlauts(text, false);  // Setze auf false, um Umlaute zu ersetzen
  text = text.replace(/(?<!\b(?:[0-9]{1,2}|[a-zA-Z]{1,3})\b)[.!?]/g, match => match + '\n\n') // TRENNUNG VON SÄTZEN
    .replace(/(ab\.|rot\.|auf\.|aus\.|ist\.)/g, '$1\n\n') // ...außer bei den Worten ....
    .replace(/\n /g, '\n')  // Replaces newline + space with newline only
    .replace(/(:\n)(.)/g, '$1\n$2') // Nach ":" müssen auch zwei absätze
    .replace(/(.\n)(.)/g, '$1\n$2')
    .replace(/\n{3,}/g, '\n\n'); // Niemals mehr als 2 Absätze hintereinander

  editTextArea.value = text; // Aktualisiert den Textbereich mit dem neuen Text
}


function Zeilenumbrueche() {
  var editTextArea = document.getElementById('editTextArea');
  let text = editTextArea.value;
  text = text.replace(/• /g, ' \n\n• ') // 2x ZEILENUMBRUCH vor BULLETPOINT
    .replace(/([a-zäöüß])-([a-zäöüß])/g, '$1$2') // Entfernt Bindestriche zwischen zwei Kleinbuchstaben
    .replace(/\t/g, ' ')  // TABULATOREN durch ein Leerzeichen
    .replace(/  +/g, ' ')  // X-Leerzeichen > 1 Leerzeichen
    .replace(/\.(?=[A-Z])/g, '. ')
    // Möglicherweise inhaltlich:
    .replace(/(\d)([a-zA-Z])/g, '$2')  // Entfernt Ziffern vor Buchstaben
    .replace(/(\d)([§])/g, '$2') // Entfernt Ziffern vor "§"
    .replace(/(\d)([a-zA-Z]{2})/g, '$2')
    // TIPPFEHLER
    .replace(/( :)/g, ':') // KEIN LEERZEICHEN vor DOPPELPUNKT ":"
    .replace(/\.\ \./g, '.')  // ". ." > "."
    .replace(//g, '•')  // Quadrat durch ein Bulletpoint ersetzt
    .replace(/ ,/g, ',')  // " ," > ","
    .replace(/(\d+\.)\n(?=[a-zA-Z§])/g, '$1')
    .trimStart()
    .replace(/(\s*\n\s*){3,}/g, '\n\n'); // Niemals mehr als 2 Absätze hintereinander


  editTextArea.value = text; // Aktualisiert den Textbereich mit dem neuen Text
}
