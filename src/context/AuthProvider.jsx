import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";

import {
  loginWithEmail,
  logoutUser,
  registerWithEmail,
  sendResetEmail,
} from "../services/authService";

import { getUserProfile } from "../services/userService";

import AuthContext from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (!firebaseUser) {
            setUser(null);
            setProfile(null);
            return;
          }

          setUser(firebaseUser);

          const userProfile = await getUserProfile(
            firebaseUser.uid
          );

          setProfile(userProfile);
        } catch (error) {
          console.error(
            "Failed to load user profile:",
            error
          );

          setProfile(null);
        } finally {
          setAuthLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  const refreshProfile = useCallback(async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setProfile(null);
      return null;
    }

    const userProfile = await getUserProfile(
      currentUser.uid
    );

    setProfile(userProfile);

    return userProfile;
  }, []);

  const register = useCallback(async (data) => {
    const registeredUser = await registerWithEmail(data);

    setUser(registeredUser);

    const userProfile = await getUserProfile(
      registeredUser.uid
    );

    setProfile(userProfile);

    return registeredUser;
  }, []);

  const login = useCallback(async (data) => {
    const loggedInUser = await loginWithEmail(data);

    setUser(loggedInUser);

    const userProfile = await getUserProfile(
      loggedInUser.uid
    );

    setProfile(userProfile);

    return loggedInUser;
  }, []);

  const resetPassword = useCallback(async (email) => {
    return sendResetEmail(email);
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      authLoading,

      isAuthenticated: Boolean(user),

      register,
      login,
      resetPassword,
      logout,
      refreshProfile,
    }),
    [
      user,
      profile,
      authLoading,
      register,
      login,
      resetPassword,
      logout,
      refreshProfile,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;