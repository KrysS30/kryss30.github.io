let sante = 100;

function version(douce, bizarre, inquiet) {
  if (sante > 60) return douce;
  if (sante >= 30) return bizarre;
  return inquiet;
}

let camionVu = false;
let telephoneVu = false;
let litVu = false;


let timer;
function parler(texte) {
  const zone = document.getElementById("narrateur");
  clearInterval(timer);
  zone.textContent = "Narrateur : ";
  if (texte.length === 0) return;
  let i = 0;
  timer = setInterval(() => {
    zone.textContent += texte[i];
    i++;
    if (i >= texte.length) clearInterval(timer);
    document.getElementById("personnage").style.display = "none";
    document.getElementById("bulle").style.display = "none";

  }, 40);
}

function parlerFrere(texte) {
  const zone = document.getElementById("bulle");
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


function majJauge() {
  document.getElementById("jauge").textContent = "Santé mentale : " + sante;
  const vraisChoix = choix.some(
  c => c.texte !== "Continuer" && c.texte !== "Commencer"
);

if (vraisChoix) {
  document.getElementById("personnage").style.display = "flex";
}

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

const phrasesIntro = [
  "Bonjour toi. Tu es enfin réveillé.",
  "Tu peux rester ici. Il n'y a rien à voir dehors.",
  "Tu entends ce bruit ? C'est juste le jeu qui commence.",
  "La chambre te semble familière, non ? Pourtant, quelque chose a changé.",
  "Noé s'est caché. On va le retrouver, comme la dernière fois.",
  "Ne réfléchis pas trop. Suis ma voix, et tout ira bien."
];


function intro() {
  introSuite(0);
}

function introSuite(i) {
  parler(phrasesIntro[i]);
  const suite = (i < phrasesIntro.length - 1)
    ? { texte: "Continuer", action: () => introSuite(i + 1) }
    : { texte: "Commencer", action: scene1 };
  afficher("", [suite]);
}

function scene1() {
  const choix = [];

  let description =
    "Tu es dans la chambre. Le lit est défait. Un petit camion est posé sur le sol, une roue cassée. Près de la porte, un téléphone vibre. La chambre est silencieuse.";

  if (camionVu || telephoneVu || litVu) {
    description += " Tu as déjà remarqué certains détails.";
  }

  // Examiner le petit camion
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

  // Regarder le téléphone
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

  // Examiner le lit
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

  // Le joueur choisit lui-même quand sortir.
  choix.push({
    texte: "Sortir de la chambre",
    action: scene2
  });

  afficher(description, choix);
}



function scene2() {
  afficher("Le jardin. Un cabanon fermé à clé, un répondeur qui clignote.", [
    { texte: "Écouter le répondeur", action: () => reaction(-20,
        "Un message de maman !",
        "Un message de maman... tu n'as pas décroché ?",
        "Tu n'as pas décroché. Tu étais occupé.", combat) },
    { texte: "Forcer le cabanon", action: () => reaction(-25,
        "Allez, on essaie !",
        "Il est fermé... mais on essaie quand même.",
        "Ferme-le. Je t'en prie. Ferme-le.", combat) },
    { texte: "Retourner dans la maison", action: () => reaction(10,
        "Bonne idée, on est mieux au chaud.",
        "On est mieux ici, non ?",
        "Reste avec moi. Tout va bien.", combat) }
  ]);
}

function combat() {
  parler(version(
    "Oh, regarde, Noé est là ! Dis-lui bonjour !",
    "Noé est là... Il te regarde depuis un moment, tu ne trouves pas ?",
    "Il est là. Ne l'écoute pas. Reste avec moi."));
  afficher("Noé apparaît, silencieux. Il te demande : « Tu étais où ? »", [
    { texte: "« J'étais sur mon téléphone. Je devais te surveiller. »", action: finVerite },
    { texte: "« Je te cherchais partout ! »", action: finDeni },
    { texte: "« Je dois retourner jouer. »", action: finDeni }
  ]);
}      

function finVerite() {
  document.body.style.background = "#223344";
  parler("...");
  afficher("Le Narrateur ne dit plus rien. Noé hoche la tête, et la maison s'éclaire doucement. Tu as dit la vérité. FIN : Vérité", [
    { texte: "Rejouer", action: recommencer }
  ]);
}

function finDeni() {
  sante = 100;
  parler("Bonjour toi ! On va jouer à cache-cache. Noé s'est caché, et toi, tu vas le trouver.");
  afficher("Tout recommence, comme si rien ne s'était passé. FIN : Déni", [
    { texte: "Jouer encore", action: scene1 }
  ]);
}

function recommencer() {
  sante = 100;
  document.body.style.background = "";
  intro();
}

intro();