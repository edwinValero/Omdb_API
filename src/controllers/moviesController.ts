import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Movie } from '../entity/movie';
import omdbClient from '../clients/omdbClient';
import searchCacheService from '../services/searchCacheService';
import OmdbMovies from '../clients/omdbMovies';
import { get, getOffsetFromPage, getPageFromQuery } from '../helper';
import createHttpError, { HttpError } from 'http-errors';

interface ISearchMovies {
  Search: Movie[];
  totalResults: number;
}

export default class MoviesController {
  public async searchMovie(req: Request, res: Response): Promise<Response> {
    const page = getPageFromQuery(req.query);

    try {
      const { nameFilter, yearFilter } = this.checkSerchMovieFilters(req);

      const results = await this.findMoviesAndUpdateCache(
        nameFilter,
        yearFilter,
        page
      );
      return res.json(results);
    } catch (e) {
      if (e instanceof HttpError) {
        return res.status(e.statusCode).json({ error: get(e, 'message') });
      }
      return res.status(500).json({ error: get(e, 'message') });
    }
  }

  private checkSerchMovieFilters(req: Request): {
    nameFilter: string;
    yearFilter: string;
  } {
    const nameFilter = get(req, 'query.name');
    const yearFilter = get(req, 'query.year');
    if (!nameFilter || !yearFilter) {
      throw createHttpError(404, 'name filter or year filter not found');
    }
    if (typeof nameFilter !== 'string' || typeof yearFilter !== 'string') {
      throw createHttpError(500, 'Invalid nameFilter or yearFilter');
    }
    return { nameFilter, yearFilter };
  }

  private async findMoviesAndUpdateCache(
    nameFilter: string,
    yearFilter: string,
    page: number
  ): Promise<ISearchMovies> {
    const searchCacheResult = await searchCacheService.getsearchCache(
      nameFilter,
      yearFilter,
      page
    );

    if (searchCacheResult !== undefined) {
      // Find cached data
      const offset = getOffsetFromPage(page);
      const movies = await getRepository(Movie)
        .createQueryBuilder('movie')
        .where('movie.name LIKE :name AND movie.year LIKE :year', {
          name: `%${nameFilter}%`,
          year: `%${yearFilter}%`,
        })
        .skip(offset)
        .take(10)
        .getMany();
      return { Search: movies, totalResults: searchCacheResult.totalResults };
    } else {
      //Find data in external DB
      const omdb = new omdbClient();
      const omdbMovies = await omdb.findMovies(nameFilter, yearFilter, page);
      const results = await this.createMoviesFromOmdb(omdbMovies);
      await searchCacheService.createSearchCache(
        nameFilter,
        yearFilter,
        page,
        omdbMovies.totalResults
      );
      return { Search: results, totalResults: omdbMovies.totalResults };
    }
  }

  private async createMoviesFromOmdb(omdbMovies: OmdbMovies): Promise<Movie[]> {
    const movies = omdbMovies.Search.map((item) => {
      const entity = {
        name: item.Title,
        imdbID: item.imdbID,
        year: item.Year,
        type: item.Type,
        image: item.Poster,
      };
      return getRepository(Movie).create(entity);
    });

    const movieSavePromises = movies.map((newMovie) =>
      getRepository(Movie).save(newMovie)
    );
    // TODO: what to do when an error occurred
    const results = await Promise.allSettled(movieSavePromises);
    results.forEach((result) => {
      if (result.status === 'rejected') {
        console.log('Movi save rejected:');
        console.log(result.reason);
      }
    });
    return movies;
  }
}
