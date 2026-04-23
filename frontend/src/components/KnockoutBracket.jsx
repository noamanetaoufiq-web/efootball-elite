import React from 'react';

const KnockoutBracket = ({ matches }) => {
    const semis = matches.filter(m => m.stageLabel === 'Semi-Final');
    const final = matches.find(m => m.stageLabel === 'Final');

    return (
        <div className="knockout-container">
            <h2 className="section-title">Tournament Bracket</h2>
            
            <div className="bracket-layout">
                {/* Semi-Finals Column */}
                <div className="bracket-column">
                    <h3 className="column-label">Semi-Finals</h3>
                    {semis.map(match => (
                        <div key={match._id} className={`match-card ${match.status}`}>
                            <div className="player-row">
                                <img src={match.player1.teamLogo} alt="" className="mini-logo" />
                                <span>{match.player1.name}</span>
                                <span className="score">{match.status === 'finished' ? match.score1 : '-'}</span>
                            </div>
                            <div className="divider" />
                            <div className="player-row">
                                <img src={match.player2.teamLogo} alt="" className="mini-logo" />
                                <span>{match.player2.name}</span>
                                <span className="score">{match.status === 'finished' ? match.score2 : '-'}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Connectors (CSS only) */}
                <div className="bracket-connectors">
                    <div className="line" />
                </div>

                {/* Final Column */}
                <div className="bracket-column">
                    <h3 className="column-label">Grand Final</h3>
                    {final ? (
                        <div className={`match-card final ${final.status}`}>
                             <div className="player-row">
                                <img src={final.player1.teamLogo} alt="" className="mini-logo" />
                                <span>{final.player1.name}</span>
                                <span className="score">{final.status === 'finished' ? final.score1 : '-'}</span>
                            </div>
                            <div className="divider" />
                            <div className="player-row">
                                <img src={final.player2.teamLogo} alt="" className="mini-logo" />
                                <span>{final.player2.name}</span>
                                <span className="score">{final.status === 'finished' ? final.score2 : '-'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-slot">Waiting for winners...</div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .knockout-container {
                    padding: 2rem;
                    background: rgba(255,255,255,0.05);
                    border-radius: 15px;
                    margin-top: 2rem;
                }
                .bracket-layout {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    gap: 3rem;
                }
                .bracket-column {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                    flex: 1;
                }
                .column-label {
                    text-align: center;
                    color: #ffd700;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    margin-bottom: 1rem;
                }
                .match-card {
                    background: #1a1a2e;
                    border: 1px solid #30363d;
                    border-radius: 8px;
                    padding: 0.5rem;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                }
                .match-card.finished {
                    border-color: #ffd700;
                }
                .match-card.final {
                    border-width: 2px;
                    transform: scale(1.1);
                }
                .player-row {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    padding: 0.5rem;
                }
                .mini-logo {
                    width: 24px;
                    height: 24px;
                    object-fit: contain;
                }
                .score {
                    margin-left: auto;
                    font-weight: bold;
                    color: #ffd700;
                    background: rgba(0,0,0,0.3);
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                .divider {
                    height: 1px;
                    background: #30363d;
                }
                .empty-slot {
                    text-align: center;
                    padding: 2rem;
                    border: 2px dashed #30363d;
                    border-radius: 8px;
                    color: #8b949e;
                }
            `}} />
        </div>
    );
};

export default KnockoutBracket;
