import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, TOKEN_KEY } from '../utils/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState([]);
  const [walls, setWalls] = useState([]);
  const [board, setBoard] = useState([]);
  const [ticker, setTicker] = useState([]);

  const setUser = useCallback((u) => {
  setMe(prev => {
    if (sessionStorage.getItem('justLoggedOut')) return null;
    const tok = (prev && prev.sessionToken) || (u && u.sessionToken) || '';
    const next = { ...prev, ...u };
    if (!next.sessionToken) next.sessionToken = tok;
    if (next.sessionToken) {
      try { localStorage.setItem(TOKEN_KEY, next.sessionToken); } catch {}
    }
    return next;
  });
}, []);

const clearUser = useCallback(() => {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
  try { sessionStorage.setItem('justLoggedOut', '1'); } catch {}
  setMe(null);
}, []);
      const d = await api('getInitialData', me ? me.id : null);
      setShop(d.shopItems || []);
      setWalls(d.offerwalls || []);
      setBoard(d.leaderboard || []);
      if (d.user) setUser(d.user);
      if (d.activityTicker) setTicker(d.activityTicker);
      return d;
    } catch (e) {
      console.error(e);
    }
  }, [me, setUser]);

  useEffect(() => {
    const tok = localStorage.getItem(TOKEN_KEY);
    if (!tok) {
      setLoading(false);
      return;
    }
    api('loginWithToken', tok)
      .then(r => {
        if (r && r.success) setUser(r.user);
        else clearUser();
      })
      .catch(clearUser)
      .finally(() => setLoading(false));
  }, [setUser, clearUser]);

  const value = {
    me, setUser, clearUser, loading,
    shop, walls, board, ticker,
    refreshData, setShop, setWalls, setBoard, setTicker
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
