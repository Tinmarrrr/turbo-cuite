import styles from '@/styles/home/home.module.scss'
import AddQuestion from '@/components/addQuestion'
import { useState } from 'react';

export default function Home() {

  const [showForm, setShowForm] = useState(false);

  function handleForm() {
    setShowForm(!showForm);
  }

  function handleKeyDown(event: { keyCode: number }) {
    if (event.keyCode === 27) {
      setShowForm(false);
    }
  }
  return (
    <div className={styles.body} onKeyDown={handleKeyDown} tabIndex={0}>
      <div className={styles.buttonsContainer}>
        <div className={styles.title}>TURBOCUITE</div>
        <div className={styles.buttons}>
          <div className={styles.btn} onClick={handleForm}>CONTRIBUER</div>
          <a className={styles.btn} href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/players`}>JOUER</a>
        </div>
      </div>
      {showForm ?
        <div className={styles.addquestion}>
          <AddQuestion />
        </div>
        : <div className={styles.picture} ></div>
      }
      <div className={styles.line} />
    </div>
  )
}