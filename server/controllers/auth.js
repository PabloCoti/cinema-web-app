const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.validateToken = (req, res) => {
    const token = req.cookies.authToken;

    if (!token)
        return res.status(401).json({ message: "Access token required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ valid: true, user: decoded });
    } catch (error) {
        res.status(401).json({ valid: false, message: "Invalid or expired token" });
    }
};

exports.logOut = (req, res) => {
    res.clearCookie("authToken").json({ message: "Logged out successfully" });
};

exports.signUp = async (req, res) => {
    try {
        const { name, lastName, email, password } = req.body;

        let user = await User.findOne({ where: { 'email': email } });
        if (user) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, lastName, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error while creating user' });
    }
};

exports.signIn = async (req, res) => {
    try {
        const { email, password, remember } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: remember ? "9999h" : "1h" }
        );

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
            maxAge: remember ? undefined : 3600000,
        });

        res.status(200).json({ message: "Logged in successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error logging in" });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'lastName', 'email', 'role', 'isActive'] });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        console.log('updates', updates);


        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update(updates);
        res.status(200).json({ message: 'User updated successfully', user });
        console.log('User updated successfully', user);

    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};
