import React, { createContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { AuthContextType, UserType } from "@/types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Check auth state and prepare app
  useEffect(() => {
    const prepareApp = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        const parsed = userData ? JSON.parse(userData) : null;

        if (parsed?.token) {
          setUserState(parsed);
          dispatch(setUser(parsed));
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setIsAppReady(true);
        setLoading(false);
      }
    };

    prepareApp();
  }, [dispatch]);

  // Handle navigation once app is ready
  useEffect(() => {
    if (!isAppReady) return;

    if (user?.token) {
      // Small delay to ensure navigation is mounted
      const timer = setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        router.replace("/(auth)/welcome");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAppReady, user, router]);

  const login = useCallback(async (userData: UserType) => {
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
    setUserState(userData);
    dispatch(setUser(userData));
    router.replace("/(tabs)/home");
  }, [dispatch, router]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("userData");
    setUserState(null);
    dispatch(setUser(null));
    router.replace("/(auth)/welcome");
  }, [dispatch, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#A259FF" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser: setUserState,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;