

const DB_NAME = 'rechercheToolDB';
const DB_VERSION = 1; // Use a higher number for upgrades
const STORE_NAME = 'rechercheToolDBData';

let db;

openDb();


function openDb() {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'titel' });
    }
  };

  request.onsuccess = (e) => {
    db = e.target.result;
  };

  request.onerror = (e) => {
    console.error("IndexedDB error:", e.target.errorCode);
  };
}



  // EINTRAG SPEICHERN UND GGF ÜBERSCHREIGEN
function DBspeichern() {
    const title = document.getElementById('titleOfResearch').innerText;
    const type = 'reineRecherche';
    const heute = new Date().toISOString();
  
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(title);
  
    request.onsuccess = (e) => {
      const data = e.target.result;
      const newData = {
        titel: title,
        type: type,
        erstelltDatum: data ? data.erstelltDatum : heute,
        geändertDatum: heute,
        gesamterInhalt: document.getElementById('fundstellenFenster').innerHTML
      };
  
      if (data) {
        if (confirm('Datensatz existiert bereits. Überschreiben?')) {
          store.put(newData);
          alert("Datensatz überschrieben");
        }
      } else {
        store.add(newData);
        alert("Neuer Datensatz gespeichert");
        auflistenNachDatum();
      }
    };
  
    transaction.oncomplete = () => {
      console.log('Transaction completed.');
    };
  
    transaction.onerror = (e) => {
      console.error('Transaction error:', e.target.error);
    };
  }

/// NACH DATUM AUFLISTEN
function auflistenNachDatum() {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
  
    request.onsuccess = (e) => {
      const data = e.target.result;
      // Sort the records by geändertDatum
      data.sort((a, b) => new Date(b.geändertDatum) - new Date(a.geändertDatum));
  
      const suchergebnisseDiv = document.querySelector('.suchergebnisse');
      suchergebnisseDiv.innerHTML = ''; // Clear existing content
  
      // Create and append buttons with class 'searchResultTitle' and onclick event
      data.forEach(item => {
        const button = document.createElement('button');
        button.textContent = item.titel;
        button.className = 'searchResultTitle';
        button.onclick = function() { titelLaden(this); };
        suchergebnisseDiv.appendChild(button);
      });
    };
  
    request.onerror = (e) => {
      console.error('Error fetching data:', e.target.error);
    };
  }


  // TITEL LADEN ÜBER KLICKEN AUF TITEL
 function titelLaden(button) {
    const titel = button.textContent;
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(titel);
  
    request.onsuccess = (e) => {
      const data = e.target.result;
      if (data) {
        document.getElementById('titleOfResearch').innerText = data.titel;
        document.getElementById('fundstellenFenster').innerHTML = data.gesamterInhalt;
      } else {
        console.error('Datensatz nicht gefunden:', titel);
      }
    };
  
    request.onerror = (e) => {
      console.error('Error fetching data:', e.target.error);
    };
  }

  // EINTRAG LÖSCHEN
  function DBdelete() {
    const title = document.getElementById('titleOfResearch').innerText; // Adjust this if the current title is stored differently
    const confirmation = confirm(`Sind Sie sicher, den Eintrag mit dem Titel "${title}" löschen zu wollen?`);
  
    if (confirmation) {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(title);
  
      request.onsuccess = () => {
        auflistenNachDatum();
        eraseAll();
      };
  
      request.onerror = (e) => {
        console.error('Fehler beim Löschen des Eintrags:', e.target.error);
      };
    } else {
      console.log('Löschvorgang abgebrochen.');
    }
  }



  // TITEL SUCHEN ÜBER INPUTLEISTE
  function sucheNachTitel() {
    // Zugriff auf den eingegebenen Text im Textfeld
    const eingabeText = document.querySelector('input[type="text"]').value.toLowerCase();
  
    // Öffnen einer Transaktion und Zugriff auf den ObjectStore
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
  
    request.onsuccess = (e) => {
      const data = e.target.result;
      const suchergebnisseDiv = document.querySelector('.suchergebnisse');
      suchergebnisseDiv.innerHTML = ''; // Vorherigen Inhalt löschen
  
      // Filtern der Daten basierend auf der Eingabe
      const gefilterteErgebnisse = data.filter(item => item.titel.toLowerCase().includes(eingabeText));
  
      // Erstellen und Anhängen der Buttons für gefilterte Ergebnisse
      gefilterteErgebnisse.forEach(item => {
        const button = document.createElement('button');
        button.textContent = item.titel;
        button.className = 'searchResultTitle';
        button.onclick = function() { titelLaden(this); };
        suchergebnisseDiv.appendChild(button);
      });
    };
  
    request.onerror = (e) => {
      console.error('Fehler beim Abrufen der Daten:', e.target.error);
    };
  }
  

  // Event-Listener für das Drücken der Enter-Taste im Textfeld hinzufügen
document.querySelector('input[type="text"]').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    sucheNachTitel();
  }
});

  // MENÜ AUSFAHREN
  document.querySelector('.fa-solid.fa-play').addEventListener('click', function() {
    var sections = document.getElementsByClassName('sectionRight');
    var icon = this;

    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];

        if (section.style.width === '0px' || section.style.width === '') {
            section.style.width = '250px';
            section.style.visibility = 'visible'; // Machen Sie das Element sichtbar
            auflistenNachDatum();
        } else {
            section.style.width = '0px';
            setTimeout(function() { // Verwenden Sie setTimeout, um die Unsichtbarkeit nach der Transition einzustellen
                section.style.visibility = 'hidden';
            }, 1); // Verzögerung sollte der Dauer der Transition entsprechen
        }
    }

    icon.classList.toggle('mirrored');
});



function setType() {
    let userInput = prompt("Bitte geben Sie '1' für 'reineRecherche' oder '2' für 'gesamteAkte' ein:");
  
    if (userInput === "1") {
      return 'reineRecherche';
    } else if (userInput === "2") {
      return 'gesamteAkte';
    } else {
      alert("Ungültige Eingabe. Bitte geben Sie '1' oder '2' ein.");
      return setType(); // Dies ruft die Funktion erneut auf, wenn die Eingabe ungültig ist.
    }
  }
  
  function DBchangeTitel() {
    let alterTitel = document.getElementById('titleOfResearch').innerText;
    let neuerTitel = prompt("Wollen Sie den Titel " + alterTitel + " ändern?", alterTitel);
  
    if (neuerTitel && neuerTitel !== alterTitel) {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
  
      // Den bestehenden Datensatz abrufen
      const getRequest = store.get(alterTitel);
  
      getRequest.onsuccess = (e) => {
        const data = e.target.result;
        if (data) {
          // Löschen des alten Datensatzes
          const deleteRequest = store.delete(alterTitel);
  
          deleteRequest.onsuccess = () => {
            // Den neuen Titel im Datensatz aktualisieren
            data.titel = neuerTitel;
  
            // Den aktualisierten Datensatz mit dem neuen Titel hinzufügen
            const addRequest = store.add(data);
  
            addRequest.onsuccess = () => {
              document.getElementById('titleOfResearch').innerText = neuerTitel;
              alert("Datensatztitel wurde erfolgreich geändert.");
              auflistenNachDatum();
            };
  
            addRequest.onerror = (e) => {
              console.error('Fehler beim Hinzufügen des aktualisierten Datensatzes:', e.target.error);
            };
          };
  
          deleteRequest.onerror = (e) => {
            console.error('Fehler beim Löschen des alten Datensatzes:', e.target.error);
          };
        } else {
          alert("Datensatz mit dem angegebenen Titel nicht gefunden.");
        }
      };
  
      getRequest.onerror = (e) => {
        console.error('Fehler beim Abrufen des Datensatzes:', e.target.error);
      };
    } else {
      alert("Keine Änderungen vorgenommen.");
    }
  }



  function DBBackup() {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
  
    request.onsuccess = (e) => {
      const data = e.target.result;
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: 'text/plain' });
  
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'database-backup.txt';
      document.body.appendChild(a); // notwendig für Firefox
      a.click();
      document.body.removeChild(a);
    };
  
    request.onerror = (e) => {
      console.error('Fehler beim Erstellen des Backups:', e.target.error);
    };
  }
  

  function DBImport() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
      const file = e.target.files[0];
  
      const reader = new FileReader();
      reader.onload = function(event) {
        const data = JSON.parse(event.target.result);
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
  
        for (const item of data) {
          store.put(item);
        }
  
        transaction.oncomplete = () => {
          alert('Datenimport erfolgreich abgeschlossen.');
          auflistenNachDatum();
        };
  
        transaction.onerror = (e) => {
          console.error('Fehler beim Importieren der Daten:', e.target.error);
        };
      };
      reader.readAsText(file);
    };
    input.click();
  }
  