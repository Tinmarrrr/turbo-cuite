import styles from "styles/abc/players.module.scss"
import { useState } from 'react'

interface Player {
    name: string;
}

export default function Players() {
    const [numPlayers, setNumPlayers] = useState(0)
    const [players, setPlayers] = useState<Player[]>([])

    const addPlayer = () => {
        console.log("ADD PLAYER");
        setNumPlayers(numPlayers + 1)
        setPlayers([...players, { name: '' }])
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newName = event.target.value
        const newPlayers = [...players]
        newPlayers[index].name = newName
        setPlayers(newPlayers)
    }

    const startGame = () => {
        console.log("START GAME");
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.body}>
                {[...Array(numPlayers)].map((_, index) => (
                    <div key={index} className={styles.player}>
                        <label htmlFor={`player-${index + 1}-name`}>Joueur {index + 1} :</label>
                        <input
                            className={styles.input}
                            id={`player-${index + 1}-name`}
                            type="text"
                            value={players[index].name}
                            onChange={(event) => handleNameChange(event, index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
