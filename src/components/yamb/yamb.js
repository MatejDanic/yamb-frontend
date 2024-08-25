import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BoxType } from '../../constants/box-types';
import { CurrentUserContext, ErrorContext } from '../../App';
import { AuthService } from '../../services/authService';
import { GameService } from '../../services/gameService';
import { calculateScore } from '../../util/score-calculator';
import Game from './game/game';
import './yamb.css';

function Yamb() {

    const { id } = useParams();
    const { t } = useTranslation();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { handleError } = useContext(ErrorContext);
    
    const [game, setGame] = useState(null);

    useEffect(() => {   
        if (id) {
            GameService.getById(id)
            .then((data) => {
                setGame(data);
            })
            .catch((error) => {
                handleError(error)
            });
        } else if (currentUser) {
            GameService.create()
            .then((data) => {
                setGame(data);
            })
            .catch((error) => {
                handleError(error);
                // setCurrentUser(null);
                // AuthService.logout();
            });
        }
    }, [currentUser, id]);

    function handleRoll(diceToRoll) {
        console.time("roll");
        GameService.rollById(game.id, diceToRoll)
        .then((data) => {
            console.timeEnd("roll");
            let newGame = {...data};
            // newGame.dices = data;
            // newGame.rollCount = game.rollCount + 1;
            setGame(newGame);
        })
        .catch((error) => {
            handleError(error)
        });
    };

    function handleFill(columnType, boxType) {
        console.time("fill");
        let diceValues = game.dices.map((dice) => dice.value);
        let newGame = {...game};
        const columnIndex = newGame.sheet.columns.findIndex(c => c.type === columnType);
        const boxIndex = newGame.sheet.columns[columnIndex].boxes.findIndex(b => b.type === boxType);
        let value = calculateScore(diceValues, BoxType[boxType])
        newGame.sheet.columns[columnIndex].boxes[boxIndex].value = value;
        setGame(newGame);
        GameService.fillById(
            game.id, columnType, boxType
        )
        .then((data) => {
            console.timeEnd("fill");
            let newGame = {...data};
            // const columnIndex = newGame.sheet.columns.findIndex(c => c.type === columnType);
            // const boxIndex = newGame.sheet.columns[columnIndex].boxes.findIndex(b => b.type === boxType);
            // newGame.sheet.columns[columnIndex].boxes[boxIndex].value = data;
            // newGame.rollCount = 0;
            // newGame.announcement = null;
            // newGame.status = data.status;
            setGame(newGame);
            if (data.status === "FINISHED") {
                handleFinish();
            }
        })
        .catch((error) => {
            handleError(error)
        });
    }

    function handleNewGame() {
        GameService.play()
        .then((data) => {
            setGame(data);
        })
        .catch((error) => {
            handleError(error)
        });
    }

    function handleAnnounce(type) {
        console.time("announce");
        GameService.announceById(
            game.id, type
        )
        .then((data) => {
            console.timeEnd("announce");
            let newGame = {...data};
            setGame(newGame);
        })
        .catch((error) => {
            handleError(error)
        });

    }

    function handleRestart() {       
        console.time("restart");
        GameService.restartById(
            game.id
        )
        .then((data) => {
            console.timeEnd("restart");
            setGame(data);
        })
        .catch((error) => {
            handleError(error)
        });
    }

    function handleFinish(totalSum) {
        toast(
			<div>
				<h4>{t('congratulations')}</h4><h2>{totalSum}</h2>
				<button onClick={handleNewGame} className="new-game-button">{t('new-game')}</button>
			</div>, {
				position: "top-center",
				autoClose: false,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				pauseOnFocusLoss: true,
				draggable: true,
				progress: undefined,
				theme: "dark"
			}
		);
    }
   
    return (
        <div className="yamb">
            {game && <Game 
                sheet={game.sheet}
                dices={game.dices}
                rollCount={game.rollCount}
                announcement={game.announcement}
                status={game.status}
                player={game.player}
                onRoll={handleRoll}
                onFill={handleFill}
                onAnnounce={handleAnnounce}
                onRestart={handleRestart}>
            </Game>}
        </div>
    );
};

export default Yamb;

