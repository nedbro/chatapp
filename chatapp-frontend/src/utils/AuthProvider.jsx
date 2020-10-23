import Axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_URL } from "./Constants";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [signedInUser, setSignedInUser] = useState(null);

  useEffect(() => {
    Axios.get(SERVER_URL + "/auth/me", { withCredentials: true })
      .then((resp) => {
        if (resp.data) {
          setSignedInUser(resp.data);
        }
      })
      .catch(console.warn);
  }, []);

  return (
    <AuthContext.Provider value={{ signedInUser, setSignedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};
