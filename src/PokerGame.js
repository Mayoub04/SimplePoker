import React, { useState } from 'react';
import './PokerGame.css'; // Importation du fichier CSS

const suits = ['♠', '♣', '♥', '♦'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = () => {
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
};

const drawCards = (deck, num = 2) => {
    let hand = [];
    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * deck.length);
        hand.push(deck.splice(randomIndex, 1)[0]);
    }
    return hand;
};

const evaluateHand = (hand) => {
    const cardValue = (card) => values.indexOf(card.value);
    const sortedHand = hand.sort((a, b) => cardValue(b) - cardValue(a));

    const counts = sortedHand.reduce((acc, card) => {
        acc[card.value] = (acc[card.value] || 0) + 1;
        return acc;
    }, {});

    const countValues = Object.values(counts);
    const uniqueCounts = new Set(countValues);

    if (countValues.includes(4)) return "Carré"; // Four of a kind
    if (countValues.includes(3)) return "Brelan"; // Three of a kind
    if (countValues.filter(count => count === 2).length === 2) return "Double Paire"; // Two pair
    if (countValues.includes(2)) return "Paire"; // One pair
    return "Carte Haute"; // High card
};

const PokerGame = () => {
    const [deck, setDeck] = useState(createDeck());
    const [playerHand, setPlayerHand] = useState([]);
    const [computerHand, setComputerHand] = useState([]);
    const [winner, setWinner] = useState(null);
    const [playerBet, setPlayerBet] = useState(0);
    const [computerBet, setComputerBet] = useState(0);
    const [betAmount, setBetAmount] = useState('');
    const [bettingPhase, setBettingPhase] = useState(false);

    const startGame = async () => {
        // Réinitialiser les états des mains et du gagnant
        setPlayerHand([]);  
        setComputerHand([]); 
        setWinner(null); 
        setComputerBet(Math.floor(Math.random() * 100) + 1); // Mise de l'ordinateur

        // S'assurer que la mise est définie avant de commencer
        const bet = parseInt(betAmount);
        if (isNaN(bet) || bet <= 0) {
            alert("Veuillez entrer une mise valide !");
            return;
        }
        setPlayerBet(bet);

        const newDeck = createDeck();
        const playerCards = [];
        const computerCards = [];

        // Tirer 4 cartes pour le joueur et l'ordinateur
        for (let i = 0; i < 4; i++) {
            const playerCard = drawCards(newDeck, 1)[0];
            const computerCard = drawCards(newDeck, 1)[0];
            
            playerCards.push(playerCard);
            computerCards.push(computerCard);
            
            setPlayerHand(prev => [...prev, playerCard]);
            setComputerHand(prev => [...prev, computerCard]);
            
            await new Promise(resolve => setTimeout(resolve, 500)); // Délai de 0.5 seconde
        }

        setDeck(newDeck);

        const playerScore = evaluateHand(playerCards);
        const computerScore = evaluateHand(computerCards);

        // Logique pour déterminer le gagnant
        if (playerBet > computerBet) {
            setWinner("Joueur");
        } else if (computerBet > playerBet) {
            setWinner("Ordinateur");
        } else {
            const handRanks = { "Carte Haute": 1, "Paire": 2, "Double Paire": 3, "Brelan": 4, "Carré": 5 };
            if (handRanks[playerScore] > handRanks[computerScore]) {
                setWinner("Joueur");
            } else if (handRanks[computerScore] > handRanks[playerScore]) {
                setWinner("Ordinateur");
            } else {
                setWinner("Égalité");
            }
        }

        // Réinitialiser la phase de mise après avoir démarré le jeu
        setBettingPhase(false);
    };

    const handleBetChange = (e) => {
        setBetAmount(e.target.value);
    };

    const handleNewGame = () => {
        // Réinitialiser tous les états
        setDeck(createDeck());
        setPlayerHand([]); 
        setComputerHand([]); 
        setWinner(null); 
        setPlayerBet(0);
        setComputerBet(0);
        setBetAmount(''); 
        setBettingPhase(true); // Passer à la phase de mise
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Jeu de Poker Simplifié - Joueur vs Ordinateur</h1>
            {bettingPhase ? (
                <div>
                    <input
                        type="number"
                        value={betAmount}
                        onChange={handleBetChange}
                        placeholder="Mise (en $)"
                        min="1"
                    />
                    <button onClick={startGame}>Confirmer la Mise et Démarrer</button>
                </div>
            ) : (
                <button onClick={handleNewGame}>Nouvelle Partie</button>
            )}
            <div style={{ marginTop: '20px' }}>
                <h2>Joueur</h2>
                <div>
                    {playerHand.length > 0 ? (
                        playerHand.map((card, i) => (
                            <span key={i} className="card">{card.value}{card.suit}</span>
                        ))
                    ) : (
                        <span>Aucune carte</span>
                    )}
                </div>
                <h3>Combinaison : {playerHand.length ? evaluateHand(playerHand) : "En attente"}</h3>
                <h3>Mise : {playerBet} $</h3>
            </div>
            <div style={{ marginTop: '20px' }}>
                <h2>Ordinateur</h2>
                <div>
                    {computerHand.length > 0 ? (
                        computerHand.map((card, i) => (
                            <span key={i} className="card">{card.value}{card.suit}</span>
                        ))
                    ) : (
                        <span>Aucune carte</span>
                    )}
                </div>
                <h3>Combinaison : {computerHand.length ? evaluateHand(computerHand) : "En attente"}</h3>
                <h3>Mise : {computerBet} $</h3>
            </div>
            <div style={{ marginTop: '20px' }}>
                <h2>Résultat</h2>
                <h3>{winner ? `Gagnant : ${winner}` : "En attente de la décision..."}</h3>
            </div>
        </div>
    );
};

export default PokerGame;
