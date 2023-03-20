const serviceAccount = require("./creds.json");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.unsubscribe(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.port || 8080;

var cors = require('cors')

app.use(cors())

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create", async (req, res) => {
  try {
    const id = uuidv4();
    let question = {
      name: req.body.name,
      question: req.body.question,
      status: false,
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

app.get("/questions-true", async (req, res) => {
  try {
    const questions = await db.collection("turboQuestions").where("status", "==", true).get();
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
    const questions = await db.collection("turboQuestions").where("status", "==", false).get();
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
