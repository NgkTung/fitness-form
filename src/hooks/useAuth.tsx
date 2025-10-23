import { useState } from "react";

const useAuth = () => {
  const [isAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  return { isAuthenticated };
};

export default useAuth;
