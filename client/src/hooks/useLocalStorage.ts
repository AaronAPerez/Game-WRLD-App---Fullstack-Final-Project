import { useEffect } from 'react';
import { useCollection } from '@/contexts/CollectionContext';

export const useCollectionPersistence = () => {
  const { state, dispatch } = useCollection();

  useEffect(() => {
    const savedCollection = localStorage.getItem('gameCollection');
    if (savedCollection) {
      const { collectedGames, collections } = JSON.parse(savedCollection);
      collectedGames.forEach(gameId => {
        dispatch({ type: 'ADD_TO_COLLECTION', gameId });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gameCollection', JSON.stringify(state));
  }, [state]);

  return null;
};