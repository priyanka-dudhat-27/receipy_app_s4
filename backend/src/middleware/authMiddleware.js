import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ message: 'You have to login first', status: 0 });
    }
    const token = authorization.replace('Bearer ', '');

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = payload;
        const userData = await User.findById(_id);
        if (userData) {
            req.user = userData;
            next();
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token, please login again', status: 0 });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired, please login again', status: 0 });
        } else {
            return res.status(500).json({ message: 'Something went wrong', status: 0 });
        }
    }
};