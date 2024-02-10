/* 



SORTIERMÖGLICHKEITEN:

- Muskelgruppe (ok)
- frei oder nicht frei (ok)
- Welches Sportgerät > KH,LH,SZ, frei, SZ,  (ok)
- nach GEWICHT (ist implizit drin) (ok)

TODO:
- ohne Rack? (Ausweismöglichkeit)
- ohne Bank?
- Ausweichmöglichkeit (instr )
- Prio von Übungen?
- Wie oft schon gemacht !||

FUNKTIONEN:
-safe canvas
-neue übung (parameter: muskelgruppe, bildname, name, sportgerät)

*/

function allesSpeichernStorage() {
    const mainContent = document.querySelector('.main').innerHTML;
    localStorage.setItem('gespeicherterInhalt', mainContent);
  }

  function allesLadenStorage() {
    const gespeicherterInhalt = localStorage.getItem('gespeicherterInhalt');
    if (gespeicherterInhalt) {
      document.querySelector('.main').innerHTML = gespeicherterInhalt;
    }
  }

  // Beim Laden der Seite
  // document.addEventListener('DOMContentLoaded', allesLadenStorage);


  function dragOverHandler(ev) {
    ev.preventDefault(); // Verhindert das Standardverhalten, um Drop zu ermöglichen
  }
  
  function dropHandler(ev) {
    ev.preventDefault(); // Verhindert das Standardverhalten des Browsers

    if (ev.dataTransfer.items) {
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        if (ev.dataTransfer.items[i].kind === 'file') {
          var file = ev.dataTransfer.items[i].getAsFile();
          var filename = file.name;
          // Entfernt die Dateiendung für die Anzeige
          var filenameWithoutExtension = filename.replace(/\.[^/.]+$/, '');
          // Setzt den Pfad zum Bild basierend auf dem Dateinamen
          // Achten Sie darauf, den Pfad entsprechend Ihrer Serverstruktur anzupassen
          var imagePath = './png/' + filename;
          ev.target.style.backgroundImage = `url('${imagePath}')`;
          // Setzt den Namen ohne Dateiendung in das Element [HERE]
          document.querySelector('.uebungsName').innerHTML = `<span class="highlight1">Brust</span><br>${filenameWithoutExtension}<br><span class="highlight2">Bank</span>`;
        }
      }
    }
  }
  