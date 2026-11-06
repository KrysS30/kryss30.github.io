let sante = 100;

let camionVu = false;
let telephoneVu = false;
let litVu = false;

let timer;

function version(douce, bizarre, inquiet) {
  if (sante > 70) return douce;
  if (sante > 50) return bizarre;
  return inquiet;
}

function majJauge() {
  document.getElementById("jauge").textContent = "Santé mentale : " + sante;
}

function decorImage(fichier) {
  const scene = document.getElementById("visual-novel");
  scene.style.backgroundImage = 'url("images/' + fichier + '")';
}

function silence() {
  clearInterval(timer);
  document.getElementById("narrateur").style.display = "none";
  document.getElementById("personnage").style.display = "none";
  document.getElementById("bulle").style.display = "none";
}

function parler(texte) {
  const zone = document.getElementById("narrateur");

  clearInterval(timer);
  document.getElementById("personnage").style.display = "none";
  document.getElementById("bulle").style.display = "none";
  zone.style.display = "block";

  zone.textContent = "";

  if (texte.length === 0) return;

  let i = 0;
  timer = setInterval(() => {
    zone.textContent += texte[i];
    i++;
    if (i >= texte.length) clearInterval(timer);
  }, 40);
}

function parlerFrere(texte) {
  const zone = document.getElementById("bulle");
  document.getElementById("narrateur").style.display = "none";
  document.getElementById("personnage").style.display = "flex";
  zone.style.display = "block";

  clearInterval(timer);
  zone.textContent = "";

  let i = 0;
  timer = setInterval(() => {
    zone.textContent += texte[i];
    i++;
    if (i >= texte.length) clearInterval(timer);
  }, 40);
}

function afficher(description, choix) {
  document.getElementById("scene").textContent = description;

  const zone = document.getElementById("choix");
  zone.innerHTML = "";

  for (const c of choix) {
    const b = document.createElement("button");
    b.textContent = c.texte;
    b.onclick = c.action;
    zone.appendChild(b);
  }

  majJauge();
}

function reaction(variation, douce, bizarre, inquiet, suite) {
  sante += variation;
  parler(version(douce, bizarre, inquiet));
  afficher("", [{ texte: "Continuer", action: suite }]);
}

function reinitialiser() {
  sante = 100;
  camionVu = false;
  telephoneVu = false;
  litVu = false;
}

const phrasesIntro = [
  "Bonjour toi. Tu es enfin réveillé.",
  "Tu peux rester ici. Il n'y a rien à voir dehors.",
  "Tu entends ce bruit ? C'est juste le jeu qui commence.",
  "La chambre te semble familière, non ? Pourtant, quelque chose a changé.",
  "Noé s'est caché. On va le retrouver, comme la dernière fois.",
  "Ne réfléchis pas trop. Suis ma voix, et tout ira bien."
];

function intro() {
  decorImage("chambre.png");
  introSuite(0);
}

function introSuite(i) {
  parler(phrasesIntro[i]);

  const suite = (i < phrasesIntro.length - 1)
    ? { texte: "Continuer", action: () => introSuite(i + 1) }
    : { texte: "Commencer", action: questionNarrateur };

  afficher("", [suite]);
}

function questionNarrateur() {
  parlerFrere("Qui es-tu ? Et pourquoi suis-je de retour à cet endroit ?");
  afficher("", [{ texte: "Continuer", action: reponseNarrateur }]);
}

function reponseNarrateur() {
  parler("Ne pose pas trop de questions. Cherche ton frère.");
  afficher("", [{ texte: "Chercher Noé", action: scene1 }]);
}

function scene1() {
  decorImage(sante > 80 ? "chambre.png" : "chambre-sombre.png");

  const choix = [];

  let description =
    "Tu es dans la chambre. Le lit est défait. Un petit camion est posé sur le sol, une roue cassée. Près de la porte, un téléphone vibre. La chambre est silencieuse.";

  if (camionVu || telephoneVu || litVu) {
    description += " Tu as déjà remarqué certains détails.";
  }

  if (!camionVu) {
    choix.push({
      texte: "Examiner le petit camion",
      action: () => {
        camionVu = true;
        reaction(
          -10,
          "Le camion a une roue cassée. C'est celui de Noé.",
          "Tu te souviens de ce camion... mais pas de la dernière fois où tu l'as vu.",
          "La roue est cassée. Tu aurais dû faire attention à lui.",
          scene1
        );
      }
    });
  }

  if (!telephoneVu) {
    choix.push({
      texte: "Regarder le téléphone qui vibre",
      action: () => {
        telephoneVu = true;
        reaction(
          -10,
          "Un message de maman. Elle demande où vous êtes.",
          "Le téléphone vibre encore. Pourquoi tu ne réponds pas ?",
          "Tu n'as pas répondu à maman. Tu sais pourquoi.",
          scene1
        );
      }
    });
  }

  if (!litVu) {
    choix.push({
      texte: "Regarder le lit vide",
      action: () => {
        litVu = true;
        reaction(
          -10,
          "Un oreiller est tombé par terre. Quelqu'un a dû se lever rapidement.",
          "Le lit est défait. Tu as l'impression que quelqu'un était là.",
          "Il n'y a personne dans le lit. Tu le sais.",
          scene1
        );
      }
    });
  }

  choix.push({ texte: "Sortir de la chambre", action: sortieChambre });

  afficher(description, choix);
}

function sortieChambre() {
  parlerFrere("Mais qu'est-ce qu'il se passe ?");
  afficher("", [{ texte: "Continuer", action: scene2 }]);
}

function scene2() {
  decorImage("cabanon.png");
  afficher("Le jardin. Un cabanon fermé à clé, un répondeur qui clignote.", [
    { texte: "Écouter le répondeur", action: () => reaction(-20,
        "Un message de maman !",
        "Un message de maman... tu n'as pas décroché ?",
        "Tu n'as pas décroché. Tu étais occupé.", apparitionNoe) },
    { texte: "Forcer le cabanon", action: () => reaction(-25,
        "Allez, on essaie !",
        "Il est fermé... mais on essaie quand même.",
        "Ferme-le. Je t'en prie. Ferme-le.", apparitionNoe) },
    { texte: "Retourner dans la maison", action: () => reaction(10,
        "Bonne idée, on est mieux au chaud.",
        "On est mieux ici, non ?",
        "Reste avec moi. Tout va bien.", apparitionNoe) }
  ]);
}

function apparitionNoe() {
  silence();
  afficher("Tu vois ton frère au loin. Tu essaies de l'interpeller.", [
    { texte: "Continuer", action: appelNoe }
  ]);
}

function appelNoe() {
  parlerFrere("Noé !");
  afficher("Tu vois ton frère au loin. Tu essaies de l'interpeller.", [
    { texte: "Continuer", action: noeDisparait }
  ]);
}

function noeDisparait() {
  silence();
  afficher("Noé ne répond pas. Il disparaît au loin. Tu cours à sa poursuite.", [
    { texte: "Continuer", action: finNarrateur }
  ]);
}

function finNarrateur() {
  parler("Tu ne te souviens vraiment de rien ?");
  afficher("", [{ texte: "Continuer", action: aSuivre }]);
}

function aSuivre() {
  silence();
  afficher("À SUIVRE...", [{ texte: "Rejouer", action: recommencer }]);
}

function recommencer() {
  reinitialiser();
  intro();
}

const phrasesPrologue = [
  "Il y a longtemps, quelque chose est arrivé dans cette maison.",
  "Tu ne sais plus quand. Tu ne sais plus comment.",
  "Ou plutôt, tu te forces à oublier ce passé douloureux.",
  "Tout ce dont tu te souviens, c'est cette endroit, et ton petit frère Noé..",
  "Tu as déménagé il y a bien longtemps.",
  "Mais alors pourquoi être de retour à cet endroit ?",
  "Vos choix determineront le cours de l'histoire.",
  "Et attention a qui vous faites"
];

function prologue() {
  silence();
  const scene = document.getElementById("visual-novel");
  scene.style.backgroundImage = "none";
  scene.style.backgroundColor = "#000";
  prologueSuite(0);
}

function prologueSuite(i) {
  const suite = (i < phrasesPrologue.length - 1)
    ? { texte: "Continuer", action: () => prologueSuite(i + 1) }
    : { texte: "Entrer dans la maison", action: finPrologue };

  afficher(phrasesPrologue[i], [suite]);
  document.getElementById("scene").classList.add("prologue");
}

function finPrologue() {
  document.getElementById("scene").classList.remove("prologue");
  intro();
}

prologue();