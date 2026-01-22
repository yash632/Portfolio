import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const home = document.querySelector(".home");
    if (home) {
      home.scrollTop = 0;
    }
  }, [pathname]); // 🔥 tab / route change detect yahin se hota hai

  return null;
};

export default ScrollToTop;
