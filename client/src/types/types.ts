//This script defines all the necessary types 

import { ObjectId } from 'mongodb';


export type snackbarType = {
  open: boolean,
  vertical: string,
  horizontal: string,
  message: string
}


export type TrendingVideoType = {
  poster_path: string,
  media_type: string,
  title?: string,
  original_name?: string,
  adult?: boolean,
  id?: number,
  release_date?: string,
  first_air_date?: string,
}

export type VideoType = {
  poster_path: string,
  media_type: string,
  title?: string,
  name?: string,
  adult?: boolean,
  id?: number,
  videoId?: number,
  release_date?: string,
  first_air_date?: string,
  original_title?: string,
}

type genresType = {
  name?: string;
  id?: number;
}

export type VideoDetailsType = {
  poster_path: string,
  runtime: string,
  title?: string,
  name?: string,
  original_language?: string,
  release_date?: string,
  first_air_date?: string,
  last_air_date?: string,
  original_title?: string,
  status?: string,
  genres?: genresType[],
  overview?: string,
  casts?: genresType[],
  homepage?: string,
  imdb_id?: string
}

export type bookmarkVideoType = {
  videoId: VideoType,
  _id: ObjectId
}

export type DeviceDetails = {
  ip_address: string;
  device_name: string | undefined;
  platform: string | undefined;
}


// the type for a single menu item
export type MenuItem = {
  id: string;
  title: string;
  url?: string;
  icon: string;
  class: string;
}

// the type for the entire menuItems object
export type MenuItems = {
  id: string;
  title: string;
  url?: string;
  icon: string;
  class: string;
  children: MenuItem[];
}

export type BlogCategory = {
  _id: string;
  name: string;
  description?: string;
}

export type Blog = {
  _id: string;
  title: string;
  content: string;
  category: BlogCategory | any;
  author: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  profile_image?: string;
  last_login?: string;
  email_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export type Category = {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}


export type FetchBlogsParams = {
  title: string;
  sortBy: string;
  page: number;
  limit: number;
}