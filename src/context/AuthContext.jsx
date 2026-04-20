import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign up
  const signUpNewUser = async (email, password) => {
    console.log("Attempting to sign up user:", email);
    console.log("Supabase URL:", supabaseUrl);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: window.location.origin + "/Login",
        },
      });

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase signup error:", error);
        return { success: false, error };
      }

      // Check if user needs email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        console.log("User registered but needs email confirmation");
        return {
          success: true,
          data,
          needsConfirmation: true,
          message: "Please check your email to confirm your account",
        };
      }

      console.log("Signup successful:", data);
      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Current session:", session?.user?.email);
      setSession(session);

      supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Auth state changed:", session?.user?.email);
        setSession(session);
      });
    });
  }, []);

  // Sing outx

  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error("There was a promlem signing out error.", error);
    }
  };

  // Clear test session
  const clearTestSession = async () => {
    await supabase.auth.signOut();
    // Clear any local storage data
    localStorage.clear();
    console.log("Test session cleared");
  };

  return (
    <AuthContext.Provider value={{ session, signUpNewUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
