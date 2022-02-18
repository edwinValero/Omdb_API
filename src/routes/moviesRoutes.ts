import { Router } from 'express';

import MoviesController from '../controllers/moviesController';

class MovieRoutes {
  router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    const moviesController = new MoviesController();
    this.router.get(
      '/search',
      moviesController.searchMovie.bind(moviesController)
    );
  }
}

export default new MovieRoutes().router;
