import { useParams } from 'react-router-dom';
import GameDetails from './GameDetails';


const GameDetailsWrapper = () => {
  const { id } = useParams();
  
  if (!id) {
    return <div>Game not found</div>;
  }

  return <GameDetails gameId={parseInt(id)} />;
};

export default GameDetailsWrapper;