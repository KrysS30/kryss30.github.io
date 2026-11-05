let sante = 100;

function version(douce, bizarre, inquiet) {
  if (sante > 60) return douce;
  if (sante >= 30) return bizarre;
  return inquiet;
}

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
  }, 40);
}

function parlerFrere(texte) {
  const zone = document.getElementById("bulle");

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
  afficher(
    "Tu reconnais cette chambre, mais quelque chose ne va pas. Le lit est vide. Un petit camion est posé sur le sol, une roue cassée. Un téléphone vibre près de la porte.\n\nLe narrateur parle doucement : « On devrait retrouver Noé. Après, on pourra rentrer. »",
    [
      {
        texte: "Dire au narrateur : « Arrête de dire que c'est un jeu. »",
        action: () => reaction(
          -20,
          "Bien sûr que c'est un jeu. Tu veux continuer, non ?",
          "Tu n'as jamais aimé qu'on te pose des questions.",
          "Ne me force pas à te rappeler ce qui s'est passé.",
          scene2
        )
      },
      {
        texte: "Lire le message de maman sur le téléphone",
        action: () => reaction(
          -15,
          "C'est sûrement juste un message ordinaire.",
          "Pourquoi tu hésites ? Tu sais qui appelle.",
          "Tu as vu son nom. Tu n'as quand même pas répondu.",
          scene2
        )
      },
      {
        texte: "Prétendre que le camion n'est pas cassé",
        action: () => reaction(
          -10,
          "Voilà, tout est comme avant !",
          "Il manque une roue. Tu l'avais déjà remarqué, non ?",
          "Tu ne peux pas réparer le souvenir en faisant semblant.",
          scene2
        )
      }
    ]
  );
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