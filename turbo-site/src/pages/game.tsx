import { useState, useEffect } from 'react';
import styles from '@/styles/game/game.module.scss'
import { Loading } from '@nextui-org/react';

import { ArrowDownIcon } from '@heroicons/react/24/solid'
import { ArrowUpIcon } from '@heroicons/react/24/solid'
import toast, { Toaster } from 'react-hot-toast';
import router from 'next/router';

export default function Game() {
  const [questions, setQuestions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [playerArr, setPlayerArr] = useState<any>([]);
  const [reachedEnd, setReachedEnd] = useState(false);


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);


  useEffect(() => {
    const storedPlayers = sessionStorage.getItem('players');
    if (storedPlayers) {
      let nbPlayer = storedPlayers.split(',').length;
      cleanPlayerArr(storedPlayers);
      const nbQuestion: number = 2;
      const axios = require('axios');
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:8080/questions-nbplayer?nbPlayer=${nbPlayer}&nbQuestions=${nbQuestion}`,
        headers: {}
      };
      axios.request(config)
        .then((response: { data: any; }) => {
          console.log('Length =', response.data);
          if (response.data.length === 0) {
            toast.error("Problème technique 😫")
          } else {
            setQuestions(response.data);
            setLoading(false);

          }
        })
        .catch((error: any) => {
          toast.error("Problème technique 😫")
          console.log(error);
        });
    }
  }, []);

  function cleanPlayerArr(storedPlayers: String) {
    let str = JSON.stringify(storedPlayers);
    str = str.replace(/\[/g, '');
    str = str.replace(/\]/g, '');
    str = str.replace(/\\/g, '');
    str = str.replace(/"/g, '');
    let tab: String[] = str.split(',');
    shufflePlayerArray(tab);
  }

  function shufflePlayerArray(array = playerArr) {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    console.log("NEWARR=", newArray);
    setPlayerArr(newArray);
  }

  console.log('currentQuestionIndex', currentQuestionIndex);
  function translateQuestion(str: String): String {
    let result = str;
    for (let i = 1; i <= questions[currentQuestionIndex].nbJoueurs; i++) {
      const placeholder = `%j${i}%`;
      if (result.includes(placeholder)) {
        const player = playerArr[i - 1];
        result = result.replaceAll(placeholder, player);
      }
    }
    return result;
  }


  function handleClickNext() {
    if (currentQuestionIndex < questions.length - 1) {
      shufflePlayerArray();
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setReachedEnd(true);
    }
  }

  function gameFinished() {
    router.push({
      pathname: '/',
    });
  }

  if (loading) {
    return (
      <div className={styles.body}>
        <div className={styles.questionContainer}>
          <Loading color={'white'} />
        </div>
      </div>);
  }

  if (reachedEnd) {
    return (
      <div className={styles.body}
        onClick={() => (gameFinished())}>
        <div className={styles.questionContainer}>
          {reachedEnd ? (
            <p>Merci d&apos;avoir joué !</p>
          ) : (
            <>
              <p>{questions[currentQuestionIndex]}</p>
              <button onClick={handleClickNext}>Suivant</button>
            </>
          )}
        </div>
      </div>
    );
  }


  console.log("QUESTIONS",questions);

  return (
    <div className={styles.body}>
      <div><Toaster /></div>
      <div className={styles.questionContainer}>
        {translateQuestion(questions[currentQuestionIndex].question)}
      </div>

      <div className={styles.authorContainer}>
        <div className={styles.authorName}>
          Proposée par {questions[currentQuestionIndex].name}
        </div>
        <div className={styles.voteContainer}>
          <button onClick={handleClickNext}>Suivant</button>

        </div>
      </div>
    </div >
  );
}