const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getSession = (req, res) => {
    res.json({ user: req.user });
};

exports.logout = (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out successfully' });
};

exports.signUp = async (req, res) => {
    try {
        const { name, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, lastName, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { 'email': email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const { name, lastName, email, role } = req.query;
        const query = {};

        if (name) query.name = name;
        if (lastName) query.lastName = lastName;
        if (email) query.email = email;
        if (role) query.role = role;

        const users = await User.find(query, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};
