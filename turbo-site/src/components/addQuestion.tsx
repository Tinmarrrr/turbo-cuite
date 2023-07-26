import React, { useState } from "react";
import axios from "axios"
import styles from "../styles/components/addquestion.module.scss"
import toast, { Toaster } from 'react-hot-toast';
const qs = require('qs');

export default function AddQuestion() {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");

  const routeApi = process.env.API_BASE_URL;

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    console.log(`Nom: ${name}, Question: ${question}`);
    sendQuestion();
    setName("");
    setQuestion("");
  };

  function sendQuestion() {
    let data = qs.stringify({
      'name': name,
      'question': question
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: routeApi + '/create',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };
    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast.success("Question ajoutée!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Merci de remplir les champs :)")
      });
  }

  return (
    <div className={styles.body} >
      <div><Toaster/></div>

      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.title}>AJOUTER UNE QUESTION</div>
          <div className={styles.infoContainer}>
            Pour différencier les joueurs, merci de leur attribuer un numéro et entouré du signe &apos;%&apos;. Ex: %1% donne 2 gorgées à %2%.
          </div>
          <div className={styles.input}>
            <label>
              <input className={styles.fieldName}
                type="text"
                placeholder="NOM"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <textarea className={styles.fieldText}
              placeholder="QUESTION"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
              />
            </label>
            <div className={styles.submitButton}>
              <button className={styles.btn}
                type="submit"
                onClick={handleSubmit}>SUBMIT</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
