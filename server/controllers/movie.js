const { Movie, sequelize } = require('../models');
const path = require('path');
const fs = require('fs');

exports.listMovies = async (req, res) => {
    try {
        const movies = await Movie.findAll({
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
};

exports.createMovie = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const movieData = req.body;
        const newMovie = await Movie.create(movieData, { transaction });

        if (req.file) {
            const movieId = newMovie.id.toString();
            const fileName = req.file.originalname;
            const movieFolder = path.join(__dirname, '../public/movies/', movieId);
            fs.mkdirSync(movieFolder, { recursive: true });

            const tempPath = path.join(__dirname, '../public/tmp/', fileName);
            const newFilePath = path.join(movieFolder, fileName);
            fs.renameSync(tempPath, newFilePath);

            newMovie.image = `public/movies/${movieId}/${fileName}`;
            await newMovie.save({ transaction });
        }

        await transaction.commit();
        res.status(201).json(newMovie);
    } catch (error) {
        console.error('Error creating movie:', error.message);

        await transaction.rollback();
        res.status(500).json({ error: 'Failed to create movie' });
    }
};

exports.getMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findByPk(movieId, {
            include: ['Genre']
        });

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie' });
    }
};

exports.updateMovieData = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const movieId = req.params.id;
        const movieData = req.body;

        const movie = await Movie.findByPk(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        await movie.update(movieData, { transaction });

        await transaction.commit();
        res.status(200).json(movie);
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: 'Failed to update movie' });
    }
};

exports.updateMovieImage = async (req, res) => {
    try {
        const movieId = req.params.id;
        const fileName = req.file.originalname;
        const movieFolder = path.join(__dirname, '../public/movies/', movieId);
        fs.mkdirSync(movieFolder, { recursive: true });

        const tempPath = path.join(__dirname, '../public/tmp/', fileName);
        const newFilePath = path.join(movieFolder, fileName);
        fs.renameSync(tempPath, newFilePath);

        const movie = await Movie.findByPk(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        movie.image = `public/movies/${movieId}/${fileName}`;
        await movie.save();

        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update movie image' });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findByPk(movieId);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const movieFolder = path.join(__dirname, '../public/movies/', movieId);
        if (fs.existsSync(movieFolder)) {
            fs.rmSync(movieFolder, { recursive: true, force: true });
        }

        await movie.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete movie' });
    }
}