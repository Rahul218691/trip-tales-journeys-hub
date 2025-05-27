export interface Story {
  id: string;
  title: string;
  location: string;
  locationMapUrl?: string;
  budget: string;
  travelDate: Date;
  tripType: string;
  isPublic: boolean;
  content: string;
  coverImage: string;
  images: string[];
  videos: string[];
  highlights: string[];
  tips: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  transportation: string;
}

export interface CreateStoryData {
  title: string;
  location: string;
  locationMapUrl?: string;
  budget: string;
  travelDate: Date;
  tripType: string;
  isPublic: boolean;
  content: string;
  coverImage: File;
  images: File[];
  videos: File[];
  highlights: string[];
  tips: string[];
  transportation: string;
}

export interface CreateStoryResponse {
  message: string;
}
