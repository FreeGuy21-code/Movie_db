const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Movie = require('../models/Movie');
require('dotenv').config();

// Sample movie data (you can expand this with more movies)
const sampleMovies = [
  {
    Title: "The Shawshank Redemption",
    Year: "1994",
    Rated: "R",
    Released: "14 Oct 1994",
    Runtime: "142 min",
    Genre: "Drama",
    Director: "Frank Darabont",
    Writer: "Stephen King, Frank Darabont",
    Actors: "Tim Robbins, Morgan Freeman, Bob Gunton",
    Plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    Language: "English",
    Country: "United States",
    Awards: "Nominated for 7 Oscars. 21 wins & 43 nominations total",
    Poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "9.3/10" },
      { Source: "Rotten Tomatoes", Value: "91%" },
      { Source: "Metacritic", Value: "82/100" }
    ],
    Metascore: "82",
    imdbRating: "9.3",
    imdbVotes: "2,800,000",
    imdbID: "tt0111161",
    Type: "movie",
    DVD: "21 Dec 1999",
    BoxOffice: "$28,767,189",
    Production: "N/A",
    Website: "N/A",
    Response: "True"
  },
  {
    Title: "The Godfather",
    Year: "1972",
    Rated: "R",
    Released: "24 Mar 1972",
    Runtime: "175 min",
    Genre: "Crime, Drama",
    Director: "Francis Ford Coppola",
    Writer: "Mario Puzo, Francis Ford Coppola",
    Actors: "Marlon Brando, Al Pacino, James Caan",
    Plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    Language: "English, Italian, Latin",
    Country: "United States",
    Awards: "Won 3 Oscars. 31 wins & 31 nominations total",
    Poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "9.2/10" },
      { Source: "Rotten Tomatoes", Value: "97%" },
      { Source: "Metacritic", Value: "100/100" }
    ],
    Metascore: "100",
    imdbRating: "9.2",
    imdbVotes: "1,900,000",
    imdbID: "tt0068646",
    Type: "movie",
    DVD: "09 Oct 2001",
    BoxOffice: "$134,966,411",
    Production: "N/A",
    Website: "N/A",
    Response: "True"
  },
  {
    Title: "The Dark Knight",
    Year: "2008",
    Rated: "PG-13",
    Released: "18 Jul 2008",
    Runtime: "152 min",
    Genre: "Action, Crime, Drama",
    Director: "Christopher Nolan",
    Writer: "Jonathan Nolan, Christopher Nolan",
    Actors: "Christian Bale, Heath Ledger, Aaron Eckhart",
    Plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    Language: "English, Mandarin",
    Country: "United States, United Kingdom",
    Awards: "Won 2 Oscars. 159 wins & 163 nominations total",
    Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "9.0/10" },
      { Source: "Rotten Tomatoes", Value: "94%" },
      { Source: "Metacritic", Value: "84/100" }
    ],
    Metascore: "84",
    imdbRating: "9.0",
    imdbVotes: "2,700,000",
    imdbID: "tt0468569",
    Type: "movie",
    DVD: "09 Dec 2008",
    BoxOffice: "$534,987,076",
    Production: "N/A",
    Website: "N/A",
    Response: "True"
  },
  {
    Title: "Pulp Fiction",
    Year: "1994",
    Rated: "R",
    Released: "14 Oct 1994",
    Runtime: "154 min",
    Genre: "Crime, Drama",
    Director: "Quentin Tarantino",
    Writer: "Quentin Tarantino",
    Actors: "John Travolta, Uma Thurman, Samuel L. Jackson",
    Plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    Language: "English, Spanish, French",
    Country: "United States",
    Awards: "Won 1 Oscar. 70 wins & 75 nominations total",
    Poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.9/10" },
      { Source: "Rotten Tomatoes", Value: "92%" },
      { Source: "Metacritic", Value: "94/100" }
    ],
    Metascore: "94",
    imdbRating: "8.9",
    imdbVotes: "2,100,000",
    imdbID: "tt0110912",
    Type: "movie",
    DVD: "19 May 1998",
    BoxOffice: "$107,928,762",
    Production: "N/A",
    Website: "N/A",
    Response: "True"
  },
  {
    Title: "Inception",
    Year: "2010",
    Rated: "PG-13",
    Released: "16 Jul 2010",
    Runtime: "148 min",
    Genre: "Action, Sci-Fi, Thriller",
    Director: "Christopher Nolan",
    Writer: "Christopher Nolan",
    Actors: "Leonardo DiCaprio, Jonah Hill, Margot Robbie",
    Plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    Language: "English, Japanese, French",
    Country: "United States, United Kingdom",
    Awards: "Won 4 Oscars. 157 wins & 220 nominations total",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    Ratings: [
      { Source: "Internet Movie Database", Value: "8.8/10" },
      { Source: "Rotten Tomatoes", Value: "87%" },
      { Source: "Metacritic", Value: "74/100" }
    ],
    Metascore: "74",
    imdbRating: "8.8",
    imdbVotes: "2,400,000",
    imdbID: "tt1375666",
    Type: "movie",
    DVD: "07 Dec 2010",
    BoxOffice: "$292,587,330",
    Production: "N/A",
    Website: "N/A",
    Response: "True"
  }
];

async function seedDatabase() {
  try {
    // Connect to persistent MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-search';

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Insert sample data
    for (const movieData of sampleMovies) {
      const movie = new Movie({
        title: movieData.Title,
        year: movieData.Year,
        imdbID: movieData.imdbID,
        type: movieData.Type,
        poster: movieData.Poster,
        genre: movieData.Genre,
        director: movieData.Director,
        actors: movieData.Actors,
        plot: movieData.Plot,
        language: movieData.Language.split(', ')[0], // Take first language to avoid MongoDB error
        country: movieData.Country,
        awards: movieData.Awards,
        ratings: movieData.Ratings.map(r => ({ source: r.Source, value: r.Value })),
        imdbRating: movieData.imdbRating,
        imdbVotes: movieData.imdbVotes,
        runtime: movieData.Runtime,
        rated: movieData.Rated,
        released: movieData.Released,
        writer: movieData.Writer,
        boxOffice: movieData.BoxOffice,

        website: movieData.Website
      });
      await movie.save();
      console.log(`Added movie: ${movie.title}`);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase();
