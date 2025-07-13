import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Smoothly scroll to top on route change
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [location.pathname]); // only depend on pathname

  return null;
};

export default ScrollToTop;
