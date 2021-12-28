export interface KnownFor {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids: number[];
  id: number;
  media_type: 'movie' | 'tv';
  original_language: 'en';
  original_title?: string;
  overview: string;
  poster_path: string;
  release_date?: Date;
  title: string;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  first_air_date?: Date;
  name: string;
  origin_country?: string[];
  original_name?: string;
}

export interface IPeople {
  adult: boolean;
  gender: number;
  id: number;
  known_for: KnownFor[];
  known_for_department: string;
  name: string;
  popularity: number;
  profile_path: string;
}

export interface IPeopleListRes {
  page: number;
  results: IPeople[];
  total_pages: number;
  total_results: number;
}
