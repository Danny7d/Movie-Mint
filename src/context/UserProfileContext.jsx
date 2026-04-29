import { createContext, useContext } from "react";
import { supabase } from "../supabaseClient";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const createOrUpdateProfile = async (userId, username, email) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: userId,
          username: username,
          email: email,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating/updating profile:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: err };
    }
  };

  const findUserByUsername = async (username) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("user_id, email, username")
        .eq("username", username)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return { success: false, error: { message: "Username not found" } };
        }
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: err };
    }
  };

  const getProfileByUserId = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        return { success: false, error };
      }

      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: err };
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        return { available: false, error };
      }

      // If data is null, the username is available
      return { available: !data, error: null };
    } catch (err) {
      return { available: false, error: err };
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        createOrUpdateProfile,
        findUserByUsername,
        getProfileByUserId,
        checkUsernameAvailability,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
