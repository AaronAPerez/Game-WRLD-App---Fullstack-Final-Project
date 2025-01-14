const PREFIX = 'game_wrld_';

export const storage = {
  getToken: () => localStorage.getItem(`${PREFIX}token`),
  setToken: (token: string) => localStorage.setItem(`${PREFIX}token`, token),
  getUser: () => {
    const user = localStorage.getItem(`${PREFIX}user`);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: any) => localStorage.setItem(`${PREFIX}user`, JSON.stringify(user)),
  clear: () => {
    localStorage.removeItem(`${PREFIX}token`);
    localStorage.removeItem(`${PREFIX}user`);
  }
};