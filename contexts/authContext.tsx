import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { ActivityIndicator, View, Text } from "react-native";
import { setUser } from "@/store/slices/userSlice";
import { AuthContextType, UserType } from "@/types";
import { InteractionManager } from "react-native";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const stored = await AsyncStorage.getItem("userData");
        const parsed = stored ? JSON.parse(stored) : null;

        if (parsed?.token) {
          setUserState(parsed);
          dispatch(setUser(parsed));
          InteractionManager.runAfterInteractions(() => {
            router.replace("/(tabs)/home");
          });
        } else {
          InteractionManager.runAfterInteractions(() => {
            router.replace("/(auth)/welcome");
          });
        }
      } catch (err) {
        console.error("Auth check error", err);
        InteractionManager.runAfterInteractions(() => {
          router.replace("/(auth)/welcome");
        });
      } finally {
        setLoading(false);
      }
    };

    checkUserData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#A259FF" />
        <Text style={{ color: "#fff", marginTop: 10 }}>Checking authentication...</Text>
      </View>
    );
  }

  const contextValue: AuthContextType = {
    user,
    setUser: setUserState,
    login: () => Promise.resolve(),         // placeholder
    register: () => Promise.resolve(),      // placeholder
    updateUserData: () => {},              // placeholder
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
