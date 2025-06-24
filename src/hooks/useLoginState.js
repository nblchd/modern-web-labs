import { useState, useEffect } from 'react';

export function useLoginState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth');
    setIsLoggedIn(token === 'true');
  }, []);

  return isLoggedIn;
}
