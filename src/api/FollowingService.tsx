import { IFollowing } from "../models/IFollowing";
import { IUser } from "../models/IUser";
import supabase from "../supabase/supabaseClient";

async function fetchFollowingList(
  currentUserId: string
): Promise<IFollowing[]> {
  try {
    const { data, error } = await supabase
      .from("following")
      .select("following_id,user_id")
      .eq("user_id", currentUserId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchFollowingCount(currentUserId: string): Promise<number> {
  try {
    const { error, count } = await supabase
      .from("following")
      .select("*", { count: "exact" })
      .eq("user_id", currentUserId);
    if (error) {
      throw error;
    }
    return count ?? 0;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchFollowerCount(currentUserId: string): Promise<number> {
  try {
    const { error, count } = await supabase
      .from("following")
      .select("*", { count: "exact" })
      .eq("following_id", currentUserId);
    if (error) {
      throw error;
    }
    return count ?? 0;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function handleFollow({
  profileId,
  currentUserId,
  isFollowing,
}: {
  profileId: string;
  currentUserId: string;
  isFollowing: boolean;
}): Promise<IUser[]> {
  try {
    if (isFollowing) {
      const { data, error } = await supabase
        .from("following")
        .delete()
        .eq("following_id", profileId)
        .eq("user_id", currentUserId);
      if (error) {
        throw error;
      }
      return data || [];
    } else {
      const { data, error } = await supabase.from("following").insert([
        {
          following_id: profileId,
          user_id: currentUserId,
        },
      ]);
      if (error) {
        throw error;
      }
      return data || [];
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const FollowingService = {
  fetchFollowingList,
  handleFollow,
  fetchFollowingCount,
  fetchFollowerCount,
};
export default FollowingService;
