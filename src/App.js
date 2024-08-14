import React, { useState, useEffect } from 'react';
import Cartas from './Cartas';
import './App.css';
function App() {
  const [tiempo, setTiempo] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [points, setPoints] = useState(0);
  const [difficulty, setDifficulty] = useState('facil');

  // Función para obtener las cartas desde la API
  const apiCartas = async (difficulty) => {
    const response = await fetch("/api/cartas.json");
    const cartasJson = await response.json();

    let numCards;
    switch (difficulty) {
      case 'facil':
        numCards = 6; 
        setTiempo(120); // Llama a setTiempo con el nuevo valor
        setMoves(5); // Llama a setMoves con el nuevo valor
        break;
      case 'medio':
        numCards = 8; 
        setTiempo(120); // Llama a setTiempo con el nuevo valor
        setMoves(30); // Llama a setMoves con el nuevo valor
        break;
      case 'dificil':
        numCards = 12; 
        setTiempo(240); // Llama a setTiempo con el nuevo valor
        setMoves(40); // Llama a setMoves con el nuevo valor
        break;
      default:
        numCards = 6;
    }
    const selectedCards = cartasJson.cards.slice(0, numCards);
    const shuffledCards = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, uniqueId: index, isFlipped: false, isMatched: false }));

    setCards(shuffledCards);
  };

  useEffect(() => {
    apiCartas(difficulty);
  }, [difficulty]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempo(prevTiempo => {
        if (prevTiempo > 0) {
          return prevTiempo - 1;
          
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [tiempo]);
  const handleCardClick = (id) => {
    const newCards = cards.map(card => {
      if (card.uniqueId === id && !card.isFlipped && flippedCards.length < 2) {
        return { ...card, isFlipped: true };
      }
      return card;
    });

    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves - 1);
      if (moves === 0) {
        alert('Se acabó el tiempo');
        return 0;
      }

      const [firstCard, secondCard] = newFlippedCards.map(cardId => newCards.find(card => card.uniqueId === cardId));

      if (firstCard.imageFront === secondCard.imageFront) {
        setPoints(points + 1);
        setCards(newCards.map(card => {
          if (card.uniqueId === firstCard.uniqueId || card.uniqueId === secondCard.uniqueId) {
            return { ...card, isMatched: true };
          }
          return card;
        }));
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(newCards.map(card => {
            if (card.uniqueId === firstCard.uniqueId || card.uniqueId === secondCard.uniqueId) {
              return { ...card, isFlipped: false };
            }
            return card;
          }));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
    setMoves(0);
    setPoints(0);
    apiCartas(event.target.value);
  };

  return (
    <div className="App">
      <article className='tablero'>
        <h3 className='text-center fontBricolage-bolder'>Memory Game</h3>
        <Cartas cards={cards} onCardClick={handleCardClick} difficulty={difficulty} />
        <div className='stats d-flex mt-3'>
          <p className='text-retro'>Movimientos: {moves}</p>
          <div className='d-flex flex-row align-item-center'>
            <label className='text-retro'>Puntos:</label>
            <p className='text-retro'>{points}</p>
          </div>
          <p className='text-retro'>Tiempo: {tiempo}</p>
          <div className='d-flex flex-row align-item-center'>
            <label className='text-retro'>Dificultad:</label>
            <select className='select-retro' value={difficulty} onChange={handleDifficultyChange}>
              <option value="facil">Fácil</option>
              <option value="medio">Medio</option>
              <option value="dificil">Difícil</option>
            </select>
            <button className='btn-retro' onClick={() => apiCartas(difficulty)}>Reiniciar</button>
          </div>
        </div>
      </article>
    </div>
  );
}
export default App;
