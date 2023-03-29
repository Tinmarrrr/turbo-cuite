// import styles from '@/styles/players/players.module.scss'
import styles from "@/styles/abc/players.module.scss";
import { useState } from "react";

export default function Players() {
  const [players, setPlayers] = useState<String[]>([]);

  const addPlayer = (event: any) => {
    const playerName = event.target.value;
    if (players.length < 8 && playerName !== "" && playerName.length < 20) {
      setPlayers([...players, playerName]);
    }
    event.target.value = "";
    console.log(players);
  };

  const startGame = () => {
    console.log("START GAME");
    // Code pour commencer le jeu avec les noms des joueurs stockés dans `players
    console.log(players);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.playerContainer}>
        <div className={styles.PlayerManagerContainer}>
          <div className={styles.PlayerNamesContainer}>
            {players.map((player, index) => {
              return (
                <div className={styles.NameContainer} key={index.toString()}>
                  {player}
                </div>
              );
            })}
            {players.length < 8 ? (
              <div className={styles.AddplayerContainer}>
                <input
                  className={styles.AddPlayerButton}
                  id="id"
                  placeholder="Ajouter un Bincheur"
                  type="text"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      addPlayer(event);
                    }
                  }}
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className={styles.PlayContainer}>
          <div className={styles.playbtn} onClick={startGame}>
            Jouer
          </div>
        </div>
      </div>
    </div>
  );
}
