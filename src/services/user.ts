import http from "./api";
import { AxiosHeaders } from "axios";
import { User } from "@/types/auth";


export interface UpdateProfileData {
  username: string;
  bio: string;
  profile?: File;
}

/**
 * Get user profile by ID
 * @param userId - The ID of the user whose profile to fetch
 * @returns Promise with the profile data
 */
export const getProfile = async (userId: string): Promise<User> => {
  try {
    const response = await http.get<User>(`/api/profile/${userId}`);
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

/**
 * Update user profile
 * @param data - The profile data to update
 * @returns Promise with the updated profile data
 */
export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  try {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("bio", data.bio);
    
    if (data.profile) {
      formData.append("profile", data.profile);
    }

    const headers = new AxiosHeaders();
    headers.set("Content-Type", "multipart/form-data");

    const response = await http.post<User>("/api/profile/update", formData, {
      headers,
    });

    return response;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
