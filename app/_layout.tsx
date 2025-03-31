// import { auth } from "@/config/firebase";
import { AuthProvider} from "@/contexts/authContext";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
// import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Provider } from 'react-redux';
import store from '@/store'

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

function StackLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(modals)/transactionModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/walletModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/categoryModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/profileModal"
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="(modals)/searchModal"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}> {/* Wrap with Redux Provider */}
      <AuthProvider> 
        <StackLayout />
      </AuthProvider>
    </Provider>
  );
}
