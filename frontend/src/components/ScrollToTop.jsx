import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollHandler = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // PUSH | POP | REPLACE

  useEffect(() => {
    if (navigationType === "PUSH") {
      // navbar / Link click
      window.scrollTo(0, 0);
    }
    // POP (back/forward) pe kuch mat karo
    // browser khud restore karega
  }, [location.pathname, navigationType]);

  return null;
};

export default ScrollHandler;
