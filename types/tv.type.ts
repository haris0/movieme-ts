export interface ITv {
  origin_country: string[];
  genre_ids: number[];
  id: number;
  original_language: string;
  poster_path: string;
  vote_average: number;
  overview: string;
  vote_count: number;
  backdrop_path: string;
  name: string;
  first_air_date: Date;
  original_name: string;
  popularity: number;
  media_type: 'tv';
}

export interface ITvListRes {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}
