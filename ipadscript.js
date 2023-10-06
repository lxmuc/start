// Verknüpfung der HTML-Formulare und Eingabefelder mit JavaScript-Variablen

const form0 = document.getElementById('form0');
const query0 = document.getElementById('query0');
const googlenorm = 'https://www.google.com/search?q=';

const form1 = document.getElementById('form1');
const query1 = document.getElementById('query1');
const google = 'https://www.google.com/search?q=';

const form2 = document.getElementById('form2');
const query2 = document.getElementById('query2');
const duckduckgo = 'https://duckduckgo.com/?q=!%20';

const form3 = document.getElementById('form3');
const query3 = document.getElementById('query3');
const googlesearchengine = 'https://www.google.de/search?q=site:www.oppenhoff.eu OR site:www.freshfields.de OR site:www.pwwl.de OR site:www.twobirds.com OR site:www.noerr.com OR site:www.arbeitsrecht-weltweit.de OR site:www.advant-beiten.com ';

const form4 = document.getElementById('form4');
const query4 = document.getElementById('query4');
const googlehaufe = 'https://www.google.de/search?q=site%3Awww.haufe.de'

const form6 = document.getElementById('form6');
const query6 = document.getElementById('query6');
const ministerienuche = 'https://www.google.de/search?q=site:www.arbeitsagentur.de OR site:www.bundesfinanzministerium.de OR site:www.bmas.de OR site:bamf.de OR site:www.bundesregierung.de'

const form6a = document.getElementById('form6a');
const query6a = document.getElementById('query6a');
const gegnersuche = 'https://www.google.de/search?q=site:www.boeckler.de OR site:www.verdi.de'

// Funktionen zur Verarbeitung von Suchanfragen
function submitted0(event) {
  // Datum ermitteln (minus 1 Woche oder minus 1 Jahr)
  const checkbox = document.getElementById('nurletztewoche');
  const checkbox1 = document.getElementById('nurletztesjahr');

  let formattedDate = '';

  if (checkbox.checked) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 14);
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();

    formattedDate = ` nach:${day}.${month}.${year}`;
  } else if (checkbox1.checked) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 350);
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();

    formattedDate = ` nach:${day}.${month}.${year}`;
  }

  event.preventDefault(); // Verhindert, dass das Formular standardmäßig übermittelt wird
  const url = googlenorm + query0.value + formattedDate; // Erstellt die URL für die Google-Suche mit der eingegebenen Suchanfrage
  const win = window.open(url, '_blank'); // Öffnet ein neues Browserfenster mit der erstellten URL
  win.focus(); // Fokussiert das neue Fenster, um es dem Benutzer anzuzeigen (MIT STRG kann man das Vermeiden)
}


function submitted1(event) {
  event.preventDefault();
  const url = google + query1.value + '+' + 'ext:pdf'; // Erstellt die URL für die Google-Suche mit der eingegebenen Suchanfrage und dem Filter "ext:pdf"
  const win = window.open(url, '_blank');
  win.focus();
}

function submitted2(event) {
  event.preventDefault();
  const url = duckduckgo + query2.value;
  const win = window.open(url, '_blank');
  win.focus();
}


function submitted3(event) {
  event.preventDefault();
  const url = googlesearchengine + query3.value;
  const win = window.open(url, '_blank');
  win.focus();
}

function submitted4(event) {
  event.preventDefault();
  const url = googlehaufe + '+' + query4.value;
  const win = window.open(url, '_blank');
  win.focus();
}

function submitted6(event) {
  event.preventDefault();
  const url = ministerienuche + '+' + query6.value;
  const win = window.open(url, '_blank');
  win.focus();
}

function submitted6a(event) {
  event.preventDefault();
  const url = gegnersuche + '+' + query6a.value;
  const win = window.open(url, '_blank');
  win.focus();
}


/* Auslöser für Funktion / LISTENER */ 
form0.addEventListener('submit', submitted0);
form1.addEventListener('submit', submitted1);
form2.addEventListener('submit', submitted2);
form3.addEventListener('submit', submitted3);
form4.addEventListener('submit', submitted4);
form6.addEventListener('submit', submitted6);
form6a.addEventListener('submit', submitted6a);

/* Aktuelles Datum */ 
const currentDateAnzeige = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const dateString = currentDateAnzeige.toLocaleDateString('de-DE', options);
document.getElementById("current-date").textContent = dateString

function changeWebsite(url) {
  var rightFrame = parent.document.getElementsByName("right")[0];
  rightFrame.contentWindow.location.replace(url);
}

/* Schalter für Anzeige von Mails */ 
function toggleIframe() {
  var iframe = document.getElementById("myIframe");
  var button = document.getElementById("toggleButton");
  
  if (iframe.src.includes("empty.html")) {
    iframe.src = "mails.html";
    button.textContent = "Mails verbergen";
  } else {
    iframe.src = "empty.html";
    button.textContent = "Mails zeigen";
  }
}

/* NUR EINE CHECKBOX DARF GECHECKT SEIN */

// Checkboxen referenzieren
var nurLetzteWocheCheckbox = document.getElementById('nurletztewoche');
var nurLetztesJahrCheckbox = document.getElementById('nurletztesjahr');

// Add event listeners to the checkboxes
nurLetzteWocheCheckbox.addEventListener('change', function() {
  if (nurLetzteWocheCheckbox.checked) {
    nurLetztesJahrCheckbox.checked = false;
  }
});

nurLetztesJahrCheckbox.addEventListener('change', function() {
  if (nurLetztesJahrCheckbox.checked) {
    nurLetzteWocheCheckbox.checked = false;
  }
});
