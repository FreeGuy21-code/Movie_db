const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  year: {
    type: String,
    required: true,
    index: true
  },
  imdbID: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: 'N/A'
  },
  genre: {
    type: String,
    index: true
  },
  director: String,
  actors: String,
  plot: String,
  language: String,
  country: String,
  awards: String,
  ratings: [{
    source: String,
    value: String
  }],
  imdbRating: String,
  imdbVotes: String,
  runtime: String,
  rated: String,
  released: String,
  writer: String,
  boxOffice: String,
  production: String,
  website: String,
  response: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Add text index for full-text search
movieSchema.index({ title: 'text', plot: 'text', actors: 'text', director: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
