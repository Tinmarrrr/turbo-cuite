// import styles from '@/styles/players/players.module.scss'
import styles from '@/styles/abc/players.module.scss'
import { useState } from 'react'

export default function Players() {
	const [players, setPlayers] = useState<String[]>([]);

	const addPlayer = (event: any) => {
		event.preventDefault();
		const playerName = event.target.elements.playerName.value;
		if (players.length < 8) {
			setPlayers([...players, playerName]);
		}
		event.target.reset();
		console.log(players);
	};

	const startGame = () => {
		console.log("START GAME");
		// Code pour commencer le jeu avec les noms des joueurs stockés dans `players`
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.body}>
				<div className={styles.a}>
					<form className={styles.playerformarea}
						onSubmit={addPlayer}>
						{players.map((player, index) => (
							<div className={styles.userlist} key={index}>
								<span className={styles.userlist}>{player}</span>
							</div>
						))}
						{players.length < 8 && (
							<div className={styles.playerinputarea}>
								<label className={styles.label}>
									<input className={styles.playerinput} type="text" placeholder='AJOUTE UN GOURMAND' name="playerName" />
								</label>
								{/* <button type="submit">Ajouter</button> */}
							</div>
						)}
					</form>
				</div>
				<div className={styles.playbtnarea}>
					<a className={styles.playbtn} href="#" onClick={startGame}>
						JOUER
					</a>
				</div>
			</div>
		</div>
	);
}
