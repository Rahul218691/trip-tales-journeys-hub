import { CreateStoryData, GetCommentsParams, GetCommentsResponse, GetStoriesParams, GetStoriesResponse, Story, AddCommentData } from "@/types/story";
import http from './api';
import { AxiosHeaders } from 'axios';


export const getStories = async (params: GetStoriesParams): Promise<GetStoriesResponse> => {
  const queryParams = new URLSearchParams();

  // Required params
  queryParams.append('page', params.page.toString());
  queryParams.append('limit', params.limit.toString());

  // Optional params
  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.tripType && params.tripType.length > 0) {
    params.tripType.forEach(type => queryParams.append('tripType', type));
  }
  if (params.transportation) {
    queryParams.append('transportation', params.transportation);
  }
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params.isMyStories) {
    queryParams.append('isMyStories', 'true');
  }
  if (params.userId) {
    queryParams.append('userId', params.userId);
  }

  const response = await http.get<GetStoriesResponse>(`/api/stories?${queryParams.toString()}`);
  return response;
};

export const createStory = async (data: CreateStoryData): Promise<string> => {
  const formData = new FormData();

  const storyType = data.isPublic ? 'public' : 'private'

  // Append text fields
  formData.append("title", data.title);
  formData.append("location", data.location);
  formData.append("budget", data.budget);
  formData.append("travelDate", data.travelDate.toISOString());
  formData.append("tripType", data.tripType);
  formData.append("storyType", storyType);
  formData.append("content", data.content);
  formData.append("transportation", data.transportation)
  
  // Append optional fields if they exist
  if (data.locationMapUrl) {
    formData.append("locationMapLink", data.locationMapUrl);
  }

  // Append arrays as JSON strings
  formData.append("highlights", JSON.stringify(data.highlights));
  formData.append("tips", JSON.stringify(data.tips));

  // Append cover image as array
  formData.append("coverImage", data.coverImage);

  // Handle images
  data.images.forEach((image) => {
    formData.append(`storyImages`, image);
  });

  // Handle videos
  data.videos.forEach((video) => {
    formData.append(`storyVideos`, video);
  });

  const response = await http.post<{ message: string }>("/api/create/story", formData, {
    headers: new AxiosHeaders({
      "Content-Type": "multipart/form-data",
    }),
  });

  return response.message;
};

/**
 * Get story details by ID
 * @param storyId - The ID of the story whose details to fetch
 * @returns Promise with the story data
 */

export const getStoryDetails = async (storyId: string): Promise<Story> => {
  try {
    const response = await http.get<Story>(`/api/story/${storyId}`);
    return response;
  } catch (error) {
    console.error("Error fetching story:", error);
    throw error;
  }
};


export const getStoryComments = async (params: GetCommentsParams): Promise<GetCommentsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', params.page.toString());
  queryParams.append('limit', params.limit.toString());
  const response = await http.get<GetCommentsResponse>(`/api/comments/${params.storyId}?${queryParams.toString()}`);
  return response;
};

export const updateStoryViewCount = async (storyId: string): Promise<void> => {
  try {
    await http.patch(`/api/story/view/${storyId}`);
  } catch (error) {
    console.error("Error updating story view count:", error);
    throw error;
  }
};

export const likeUnlikeStory = async (storyId: string): Promise<void> => {
  try {
    await http.patch(`/api/story/like/${storyId}`);
  } catch (error) {
    console.error("Error updating story view count:", error);
    throw error;
  }
}

export const addComment = async(data: AddCommentData): Promise<AddCommentDataResponse> => {
  try {
    const response = await http.post<AddCommentDataResponse>(`/api/create/comment`, data)
    return response
  } catch (error) {
    console.error("Error adding story comment:", error);
    throw error;
  }
}