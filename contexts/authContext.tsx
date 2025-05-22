import React, { createContext, useContext, useEffect, useState } from "react";

import { AuthContextType, UserType } from "@/types";
import { Router, useRouter, useSegments } from "expo-router";
import { useSelector } from "react-redux";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router: Router = useRouter();

  const userState = useSelector((state) => state?.user);
  const userId = userState?.user?.id;
  const token = useState?.user?.token;
  console.log("TTTTTTTT",token)

  useEffect(() => {
      if (token!=null && token != undefined) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/welcome");
        // router.replace("/(tabs)/home")
      }
    },[]);

  const contextValue: AuthContextType = {
    user,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

