const { MovieGenre } = require('../models');

exports.listMovieGenres = async (req, res) => {
    try {
        const filters = req.query || {};
        const movieGenres = await MovieGenre.findAll({ where: filters });

        res.status(200).json(movieGenres);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie genres' });
    }
};