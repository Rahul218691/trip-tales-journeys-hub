import { CreateStoryData } from "@/types/story";
import http from './api';
import { AxiosHeaders } from 'axios';

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
