import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign up
  const signUpNewUser = async (email, password, username) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: window.location.origin + "/Login",
        },
      });

      if (error) {
        console.error("Supabase signup error:", error);
        return { success: false, error };
      }

      // Create user profile in user_profiles table
      if (data.user) {
        const { error: profileError } = await supabase
          .from("user_profiles")
          .upsert({
            user_id: data.user.id,
            username: username,
            email: email,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Error creating user profile:", profileError);
        }
      }

      // Check if user needs email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        return {
          success: true,
          data,
          needsConfirmation: true,
          message: "Please check your email to confirm your account",
        };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    });
  }, []);

  // Sign in — supports both email and username
  const signIn = async (emailOrUsername, password) => {
    try {
      let loginEmail = emailOrUsername;

      // Check if input looks like an email
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrUsername);

      if (!isEmail) {
        // Input is a username — look up the email from user_profiles
        const { data: profile, error: lookupError } = await supabase
          .from("user_profiles")
          .select("email")
          .eq("username", emailOrUsername)
          .maybeSingle();

        if (lookupError || !profile) {
          return {
            success: false,
            error: { message: "Username not found. Please check and try again." },
          };
        }

        loginEmail = profile.email;
      }

      // Authenticate with the resolved email
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error during sign in:", err);
      return { success: false, error: err };
    }
  };

  // Sign out
  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.error("There was a problem signing out.", error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, signUpNewUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
