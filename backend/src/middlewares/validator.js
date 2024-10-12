import { z } from 'zod';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const registerSchema = z.object({
    name: z.string({
        required_error:"Name is required"
    }),
    email: z.string({
        required_error: "Email is required",
    }).email({
        message: "Invalid email"
    }),
    password: z.string({
        required_error: "Password is required"
    }).min(6,{
        message:"Password must be at least 6 characters"
    })
});

export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required",
    }).email({
        message: "Invalid email"
    }),
    password: z.string({
        required_error: "Password is required"
    }).min(6,{
        message:"Password must be at least 6 characters"
    })
});

export const validateSchema = (schema) => (request,response,next) => {
    try{
        schema.parse(request.body);
        next();
    }catch(error){
        console.log(error);
        return response.status(400).json(error.errors.map(error => error.message));
    }
}

export const authRequired = (request, response, next) => {
    try{
        const {token} = request.cookies;
        console.log(token);
    if(!token){
        return response.status(401).json({message:"Unauthorized"});
    }
    else{
        jwt.verify(token, process.env.SECRET_KEY,(err)=>{
            if(err){
                return response.status(403).json({message:"Invalid token"});
            }
                next();
        });
    }
    }catch(error){
        console.error(error);
    }
}