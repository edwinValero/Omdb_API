interface IOmdbMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}
interface IOmdbMovies {
  Search: IOmdbMovie[];
  totalResults: number;
}

export default class OmdbMovies {
  Search: IOmdbMovie[];
  totalResults: number;

  constructor({ Search, totalResults }: IOmdbMovies) {
    this.Search = Search;
    this.totalResults = totalResults;
  }

  public static fromJson(payload: string): OmdbMovies {
    return new OmdbMovies(JSON.parse(payload));
  }
}
