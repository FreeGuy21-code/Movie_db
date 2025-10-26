const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Movie = require('../models/Movie');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /api/movies/search - Search movies with filters
router.get('/search', [
  query('q').optional().isString().trim().escape(),
  query('year').optional().isNumeric(),
  query('genre').optional().isString().trim().escape(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('sort').optional().isIn(['title', 'year', 'imdbRating']).withMessage('Sort must be title, year, or imdbRating'),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      q: searchQuery,
      year,
      genre,
      page = 1,
      limit = 10,
      sort = 'title'
    } = req.query;

    let query = {};

    // Text search
    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: 'i' };
    }

    // Year filter
    if (year) {
      query.year = year;
    }

    // Genre filter
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    // Sorting
    let sortOption = {};
    if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'year') {
      sortOption = { year: -1 };
    } else if (sort === 'imdbRating') {
      sortOption = { imdbRating: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const movies = await Movie.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select('title year imdbID type poster genre');

    const total = await Movie.countDocuments(query);

    res.json({
      Search: movies.map(movie => ({
        Title: movie.title,
        Year: movie.year,
        imdbID: movie.imdbID,
        Type: movie.type,
        Poster: movie.poster
      })),
      totalResults: total.toString(),
      Response: 'True'
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      Response: 'False',
      Error: 'Failed to search movies'
    });
  }
});

// GET /api/movies/:id - Get movie details by IMDb ID
router.get('/:id', [
  param('id').isString().trim().escape(),
  handleValidationErrors
], async (req, res) => {
  try {
    const movie = await Movie.findOne({ imdbID: req.params.id });

    if (!movie) {
      return res.status(404).json({
        Response: 'False',
        Error: 'Movie not found'
      });
    }

    res.json({
      Title: movie.title,
      Year: movie.year,
      Rated: movie.rated,
      Released: movie.released,
      Runtime: movie.runtime,
      Genre: movie.genre,
      Director: movie.director,
      Writer: movie.writer,
      Actors: movie.actors,
      Plot: movie.plot,
      Language: movie.language,
      Country: movie.country,
      Awards: movie.awards,
      Poster: movie.poster,
      Ratings: movie.ratings,
      Metascore: movie.metascore,
      imdbRating: movie.imdbRating,
      imdbVotes: movie.imdbVotes,
      imdbID: movie.imdbID,
      Type: movie.type,
      DVD: movie.dvd,
      BoxOffice: movie.boxOffice,
      Production: movie.production,
      Website: movie.website,
      Response: 'True'
    });
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({
      Response: 'False',
      Error: 'Failed to get movie details'
    });
  }
});

// POST /api/movies - Add a new movie (for seeding/admin purposes)
router.post('/', [
  body('title').isString().trim().notEmpty(),
  body('year').isString().trim().notEmpty(),
  body('imdbID').isString().trim().notEmpty(),
  body('type').isString().trim().notEmpty(),
  handleValidationErrors
], async (req, res) => {
  try {
    const movieData = req.body;

    // Transform field names to match our schema
    const transformedData = {
      title: movieData.Title || movieData.title,
      year: movieData.Year || movieData.year,
      imdbID: movieData.imdbID,
      type: movieData.Type || movieData.type,
      poster: movieData.Poster || movieData.poster || 'N/A',
      genre: movieData.Genre || movieData.genre,
      director: movieData.Director || movieData.director,
      actors: movieData.Actors || movieData.actors,
      plot: movieData.Plot || movieData.plot,
      language: movieData.Language || movieData.language,
      country: movieData.Country || movieData.country,
      awards: movieData.Awards || movieData.awards,
      ratings: movieData.Ratings || movieData.ratings || [],
      imdbRating: movieData.imdbRating,
      imdbVotes: movieData.imdbVotes,
      runtime: movieData.Runtime || movieData.runtime,
      rated: movieData.Rated || movieData.rated,
      released: movieData.Released || movieData.released,
      writer: movieData.Writer || movieData.writer,
      boxOffice: movieData.BoxOffice || movieData.boxOffice,
      production: movieData.Production || movieData.production,
      website: movieData.Website || movieData.website
    };

    const movie = new Movie(transformedData);
    await movie.save();

    res.status(201).json({
      message: 'Movie added successfully',
      movie: movie
    });
  } catch (error) {
    console.error('Add movie error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Movie with this IMDb ID already exists' });
    }
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

module.exports = router;
