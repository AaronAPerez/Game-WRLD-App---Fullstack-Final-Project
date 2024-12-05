// Custom hook for localStorage

export const useLocalStorage = (key: string) => {
  // setItem: Saves a value to localStorage
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Error: local storage item not saved", error);
    }
  };

  // getItem: Retrieves a value from localStorage
  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.log("Error: local storage item not found", error);
      return undefined;
    }
  };

  // removeItem: Deletes a value from localStorage
  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.log("Error: local storage item not deleted", error);
    }
  };

  // Return object with methods for localStorage
  return { setItem, getItem, removeItem };
};
