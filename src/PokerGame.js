import React, { useState } from 'react';
import './PokerGame.css'; 

const suits = ['♠', '♣', '♥', '♦'];
const values = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

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
    const isPair = countValues.includes(2);
    const isThreeOfAKind = countValues.includes(3);
    const isFourOfAKind = countValues.includes(4);

    if (isFourOfAKind) return "Carré";
    if (isThreeOfAKind && isPair) return "Full House";
    if (isThreeOfAKind) return "Brelan"; 
    if (countValues.filter(count => count === 2).length === 2) return "Double Paire"; 
    if (isPair) return "Paire"; 

    return "Carte Haute";
};

const getHighestCard = (hand) => {
    const cardValue = (card) => values.indexOf(card.value);
    return hand.reduce((highest, card) => {
        return cardValue(card) > cardValue(highest) ? card : highest;
    });
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
        setPlayerHand([]);
        setComputerHand([]);
        setWinner(null);
        setComputerBet(Math.floor(Math.random() * 100) + 1);
    
        const bet = parseInt(betAmount);
        if (isNaN(bet) || bet <= 0) {
            alert("Veuillez entrer une mise valide !");
            return;
        }
        setPlayerBet(bet);
    
        const newDeck = createDeck();
        const playerCards = [];
        const computerCards = [];
    
        for (let i = 0; i < 4; i++) {
            const playerCard = drawCards(newDeck, 1)[0];
            const computerCard = drawCards(newDeck, 1)[0];
            
            playerCards.push(playerCard);
            computerCards.push(computerCard);
            
            setPlayerHand(prev => [...prev, playerCard]);
            setComputerHand(prev => [...prev, computerCard]);
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    
        setDeck(newDeck);
    
        const playerScore = evaluateHand(playerCards);
        const computerScore = evaluateHand(computerCards);
    
        const handRanks = { "Carte Haute": 1, "Paire": 2, "Double Paire": 3, "Brelan": 4, "Full House": 5, "Carré": 6 };
        
        if (handRanks[playerScore] > handRanks[computerScore]) {
            setWinner("Joueur");
        } else if (handRanks[computerScore] > handRanks[playerScore]) {
            setWinner("Ordinateur");
        } else {
            
            const compareHands = (handA, handB) => {
                const sortedA = handA.sort((a, b) => values.indexOf(b.value) - values.indexOf(a.value));
                const sortedB = handB.sort((a, b) => values.indexOf(b.value) - values.indexOf(a.value));
                
                for (let i = 0; i < sortedA.length; i++) {
                    const valueA = values.indexOf(sortedA[i].value);
                    const valueB = values.indexOf(sortedB[i].value);
                    if (valueA !== valueB) return valueA > valueB ? "Joueur" : "Ordinateur";
                }
                return "Égalité";
            };
    
            setWinner(compareHands(playerCards, computerCards));
        }
    
        setBettingPhase(false);
    };
    

    const handleBetChange = (e) => {
        setBetAmount(e.target.value);
    };

    const handleNewGame = () => {
        
        setDeck(createDeck());
        setPlayerHand([]); 
        setComputerHand([]); 
        setWinner(null); 
        setPlayerBet(0);
        setComputerBet(0);
        setBetAmount(''); 
        setBettingPhase(true); 
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
                            <div key={i} className="card">
                                <span className="card-value">{card.value}</span>
                                <span className="card-suit">{card.suit}</span>
                            </div>
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
                            <div key={i} className="card">
                                <span className="card-value">{card.value}</span>
                                <span className="card-suit">{card.suit}</span>
                            </div>
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
