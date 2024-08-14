import React from 'react';
import cartaDetras from './img/cartadetras.png';
import './App.css';

function Cartas({ cards, onCardClick, difficulty }) {
    return (
        <div className={`cartas-container ${difficulty}`}>
            {cards.map((card, index) => (
                <div 
                    className={`carta ${card.isFlipped ? 'flipped' : ''}`} 
                    key={card.uniqueId} 
                    onClick={() => onCardClick(card.uniqueId)}
                >
                    <img 
                        src={card.isFlipped || card.isMatched ? card.imageFront : cartaDetras} 
                        alt="Carta" 
                        className="img object-image-cover" 
                        width={200}
                        height={200}
                    />
                </div>
            ))}
        </div>
    );
}

export default Cartas;