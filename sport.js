/* 



SORTIERMÖGLICHKEITEN:

- Muskelgruppe (ok)
- frei oder nicht frei (ok)
- Welches Sportgerät > KH,LH,SZ, frei, SZ,  (ok)
- nach GEWICHT (ist implizit drin) (ok)
- ohne Rack? (Ausweismöglichkeit)
- Ausweichmöglichkeit (instr )


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
  document.addEventListener('DOMContentLoaded', allesLadenStorage);


