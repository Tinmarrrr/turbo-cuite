const serviceAccount = require("./creds.json");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();
const { FieldPath } = require("firebase-admin").firestore;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.unsubscribe(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.port || 8080;

var cors = require("cors");

app.use(cors());

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create", async (req, res) => {
  try {
    const id = uuidv4();

    let joueurs = new Set(); // initialise un ensemble vide pour stocker les noms des joueurs
    let regex = /%j([1-8])%/g;
    let match;
    while ((match = regex.exec(req.body.question)) !== null) {
      let joueur = match[1]; // extrait le numéro du joueur de l'occurrence
      joueurs.add(joueur); // ajoute le numéro du joueur à l'ensemble
    }
    let nbJoueurs = joueurs.size; // compte le nombre de joueurs différents
    console.log(nbJoueurs);

    let question = {
      name: req.body.name,
      question: req.body.question,
      status: false,
      upvote: 0,
      downvote: 0,
      nbJoueurs: nbJoueurs,
    };

    if (question.question === "") {
      res.status(400).send("Merci de renseigner une question");
      return;
    }
    if (question.name === "") {
      question.name = "Anonyme";
    }
    console.log("Nouvelle question !\n", question);
    const response = db.collection("turboQuestions").doc(id).set(question);
    res.status(200).send(response);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.get("/questions", async (req, res) => {
  try {
    const questions = await db.collection("turboQuestions").get();
    const questionsArray = questions.docs.map((question) => {
      const data = question.data();
      return { id: question.id, ...data };
    });
    res.status(200).send(questionsArray);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.get("/questions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const question = await db.collection("turboQuestions").doc(id).get();
    const data = question.data();
    res.status(200).send({ id: question.id, ...data });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.patch("/validate/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const question = await db.collection("turboQuestions").doc(id).get();
    const data = question.data();
    const status = data.status;
    const response = await db
      .collection("turboQuestions")
      .doc(id)
      .update({ status: true });
    res.status(200).send(response);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.patch("/unvalidate/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const question = await db.collection("turboQuestions").doc(id).get();
    const data = question.data();
    const status = data.status;
    const response = await db
      .collection("turboQuestions")
      .doc(id)
      .update({ status: false });
    res.status(200).send(response);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.patch("/upvote/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const question = await db.collection("turboQuestions").doc(id).get();
    const data = question.data();
    const upvote = data.upvote;
    const response = await db
      .collection("turboQuestions")
      .doc(id)
      .update({ upvote: upvote + 1 });
    res.status(200).send(response);
    console.log(upvote + 1);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.patch("/downvote/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const question = await db.collection("turboQuestions").doc(id).get();
    const data = question.data();
    const downvote = data.downvote;
    const response = await db
      .collection("turboQuestions")
      .doc(id)
      .update({ downvote: downvote + 1 });
    res.status(200).send(response);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

///

app.patch("/  /:id", async (req, res) => {
  try {
    const id = req.params.id;
    const question = await db.collection("turboQuestions").doc(id).get();
    const data = question.data();
    const upvote = data.upvote;
    const response = await db
      .collection("turboQuestions")
      .doc(id)
      .update({ upvote: upvote - 1 });
    res.status(200).send(response);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.patch("/canceldownvote/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const question = await db.collection("turboQuestions").doc(id).get();
    const data = question.data();
    const downvote = data.downvote;
    const response = await db
      .collection("turboQuestions")
      .doc(id)
      .update({ downvote: downvote - 1 });
    res.status(200).send(response);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

///

app.get("/questions-nbplayer", async (req, res) => {
  if (req.query.nbPlayer === undefined) {
    res.send("nbPlayer est indéfini");
    return;
  }
  if (req.query.nbQuestions === undefined) {
    res.send("nbQuestions est indéfini");
    return;
  }

  try {
    const maxNbJoueurs = parseInt(req.query.nbPlayer); // Valeur maximale pour le nombre de joueurs
    const questionsSnapshot = await db
      .collection("turboQuestions")
      .where("nbJoueurs", "<=", maxNbJoueurs)
      .get();

    // Convertir les résultats en un tableau
    const questionsArray = questionsSnapshot.docs.map((question) => {
      const data = question.data();
      console.log("data => ", data);
      return { id: question.id, ...data };
    });

    // Mélanger aléatoirement les questions
    const shuffledQuestions = shuffleArray(questionsArray);

    // Limiter le nombre de questions renvoyées au client (ici, 20)
    const limitedQuestions = shuffledQuestions.slice(0, 20);

    console.log("questionarray =>", limitedQuestions);
    res.status(200).send(limitedQuestions);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

// Fonction pour mélanger aléatoirement un tableau
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

app.get("/questions-true", async (req, res) => {
  try {
    const questions = await db
      .collection("turboQuestions")
      .where("status", "==", true)
      .get();
    const questionsArray = questions.docs.map((question) => {
      const data = question.data();
      return { id: question.id, ...data };
    });
    res.status(200).send(questionsArray);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.get("/questions-false", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const questions = await db
      .collection("turboQuestions")
      .where("status", "==", false)
      .get();
    const questionsArray = questions.docs.map((question) => {
      const data = question.data();
      return { id: question.id, ...data };
    });
    res.status(200).send(questionsArray);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const id = req.params.id;
    const response = await db.collection("turboQuestions").doc(id).delete();
    res.status(200).send(response);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});
