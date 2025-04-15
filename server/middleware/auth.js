const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token)
        return res.status(401).json({ message: "Access token required" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ message: "Invalid token" });

        req.user = user;
        next();
    });
};

exports.verifyAdmin = (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin')
            return res.status(403).json({ error: 'Access denied' });

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

