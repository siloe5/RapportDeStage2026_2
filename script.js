// Empêche le navigateur de restaurer l'ancienne position de scroll au rechargement
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Force le retour en haut dès que le script se charge
window.scrollTo(0, 0);

const video = document.getElementById('intro-video');
const hero = document.getElementById('hero');
const overlay = document.getElementById('hero-overlay');
const btnRaconte = document.getElementById('btn-raconte');
const firstCase = document.querySelector('.first-case');

// Éléments audio
const musique = document.getElementById('bg-music');
const btnAudio = document.getElementById('btn-audio');

// 1. Affichage du titre et du bouton au bout de 10s (ou fin de vidéo)
const showOverlay = () => {
  if (overlay) {
    overlay.classList.add('visible');
  }
};

if (video) {
  video.addEventListener('ended', showOverlay);
}
setTimeout(showOverlay, 10000);

// 2. Clic sur "Raconte !" -> Le titre monte en haut + la Case 1 se dessine + Lancement de la musique
if (btnRaconte && hero) {
  btnRaconte.addEventListener('click', () => {
    window.scrollTo(0, 0);
    hero.classList.add('started');
    
    // Lance la musique au clic
    if (musique) {
      musique.volume = 0.4; // Volume à 40%
      musique.play().catch(err => console.log("Lecture audio bloquée :", err));
    }
    
    // Déclenche l'effet de dessin sur la 1ère case
    setTimeout(() => {
      if (firstCase) {
        firstCase.classList.add('paint-reveal');
      }
      // Recalcule la position des cases suivantes
      updateScrollDraw();
    }, 350);
  });
}

// Gestion optionnelle du bouton Son / Muet
if (btnAudio && musique) {
  btnAudio.addEventListener('click', () => {
    if (musique.paused) {
      musique.play();
      btnAudio.textContent = '🔊';
    } else {
      musique.pause();
      btnAudio.textContent = '🔇';
    }
  });
}

// 3. Animation de dessin et montée synchronisée avec le scroll (Cases 2 à 5)
const revealCases = document.querySelectorAll('.reveal');

function updateScrollDraw() {
  const windowHeight = window.innerHeight;
  const startTrigger = windowHeight * 0.92;
  const endTrigger = windowHeight * 0.38;

  revealCases.forEach((el) => {
    const rect = el.getBoundingClientRect();
    let progress = (startTrigger - rect.top) / (startTrigger - endTrigger);
    
    // Borne la progression entre 0 et 1
    progress = Math.max(0, Math.min(1, progress));
    
    el.style.setProperty('--progress', progress.toFixed(3));
  });
}

window.addEventListener('scroll', updateScrollDraw, { passive: true });
window.addEventListener('resize', updateScrollDraw);
updateScrollDraw();

// 4. Ouverture de la "nouvelle page" blanche avec le texte au centre
const btnPause = document.getElementById('btn-pause');
const finalScreen = document.getElementById('final-screen');
const btnBack = document.getElementById('btn-back');

if (btnPause && finalScreen) {
  btnPause.addEventListener('click', () => {
    finalScreen.classList.add('active');
    document.body.style.overflow = 'hidden'; // Bloque le scroll derrière
  });
}

if (btnBack && finalScreen) {
  btnBack.addEventListener('click', () => {
    finalScreen.classList.remove('active');
    document.body.style.overflow = ''; // Réactive le scroll
  });
}