import { createContext, useContext, useState } from "react";
import { supabase } from "../supabaseClient";

const SocialContext = createContext();

export function SocialProvider({ children }) {
  const followUser = async (followerId, followingId) => {
    try {
      const { error } = await supabase.from("user_followers").insert({
        follower_id: followerId,
        following_id: followingId,
      });
      if (error) return { success: false, error };
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const unfollowUser = async (followerId, followingId) => {
    try {
      const { error } = await supabase
        .from("user_followers")
        .delete()
        .eq("follower_id", followerId)
        .eq("following_id", followingId);
      if (error) return { success: false, error };
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const getFollowers = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_followers")
        .select("follower_id")
        .eq("following_id", userId);
      if (error) return { success: false, error };
      return { success: true, data: data || [], count: data?.length || 0 };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const getFollowing = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_followers")
        .select("following_id")
        .eq("follower_id", userId);
      if (error) return { success: false, error };
      return { success: true, data: data || [], count: data?.length || 0 };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const isFollowing = async (followerId, followingId) => {
    try {
      const { data } = await supabase
        .from("user_followers")
        .select("id")
        .eq("follower_id", followerId)
        .eq("following_id", followingId)
        .maybeSingle();
      return !!data;
    } catch (err) {
      return false;
    }
  };

  return (
    <SocialContext.Provider
      value={{ followUser, unfollowUser, getFollowers, getFollowing, isFollowing }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error("useSocial must be used within a SocialProvider");
  }
  return context;
}
