import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const signIn = async (req, res) => {
        const {email, password} = req.body;
        try{
            const existingUser = await User.findOne({email});
            if(!existingUser) return res.status(404).json({message:"User doesn't exist!"});

            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
            if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials!"});
            
            const token = jwt.sign({email: existingUser.email, id: existingUser._id}, 'test', {expiresIn: '1h'});
            res.status(200).json({
                result: existingUser, token
            });
            console.log('signIn: ' + existingUser);
            console.log('signIn: ' + token);
        }
        catch(error){
            res.status(500).json({message: 'Something went wrong!'});
        }
}

export const signUp = async (req, res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body;
    
    try {
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message:"User already exists!"});
        if(password !== confirmPassword) return res.status(400).json({message:"Password doesn't match!"});

        const hashPass = await bcrypt.hash(password, 12);
        const result = await User.create({
            email, password: hashPass, name: `${firstName} ${lastName}`
        });
        const token = jwt.sign({email: result.email, id: result._id}, 'test', {expiresIn: '1h'});

        res.status(200).json({
            result, token
        });
        console.log('signUp: ' + result);
        console.log('signUp: ' + token);
    } catch (error) {
        res.status(500).json({message: 'Something went wrong!'});
    }
}