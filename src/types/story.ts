export interface Story {
  _id: string;
  title: string;
  location: string;
  locationMapLink?: string | null;
  budget: number;
  travelDate: Date;
  tripType: string;
  storyType: string;
  content: string;
  coverImage: {
    url: string;
    secureUrl: string;
  }
  storyImages: {
    url: string;
    secureUrl: string;
  }[];
  storyVideos: {
    url: string;
    secureUrl: string;
  }[];
  highlights: string[];
  tips: string[];
  createdAt: Date;
  transportation: string;
  likes: number;
  views: number;
  storyReadTime: string;
  createdBy: {
    username: string;
    profileImg: string;
  };
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

export interface GetStoriesParams {
  page: number;
  limit: number;
  search?: string;
  tripType?: string[];
  transportation?: string;
  sortBy?: 'recent' | 'popular' | 'commented';
  isMyStories?: boolean;
  userId?: string;
}

export interface StoryResponse {
  _id: string;
  title: string;
  coverImage: {
    url: string;
    secureUrl: string;
  };
  location: string;
  storyReadTime: string;
  likes: number;
  views: number;
  totalComments: number;
  createdBy: {
    username: string;
    profileImg: string;
    profileImgSecureUrl: string;
  };
  createdAt: string;
}

export interface GetStoriesResponse {
  items: StoryResponse[];
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
