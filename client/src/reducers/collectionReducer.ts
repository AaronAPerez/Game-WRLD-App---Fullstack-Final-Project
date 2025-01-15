export const collectionReducer = (state: CollectionState, action: CollectionAction): CollectionState => {
    switch (action.type) {
      case 'ADD_TO_COLLECTION':
        return {
          ...state,
          collectedGames: [...state.collectedGames, action.gameId]
        };
      
      case 'REMOVE_FROM_COLLECTION':
        return {
          ...state,
          collectedGames: state.collectedGames.filter(id => id !== action.gameId)
        };
      
      case 'CREATE_COLLECTION':
        return {
          ...state,
          collections: [...state.collections, {
            id: Date.now(),
            name: action.name,
            gameIds: []
          }]
        };
      
      case 'ADD_TO_CUSTOM_COLLECTION':
        return {
          ...state,
          collections: state.collections.map(collection =>
            collection.id === action.collectionId
              ? { ...collection, gameIds: [...collection.gameIds, action.gameId] }
              : collection
          )
        };
      
      default:
        return state;
    }
  };