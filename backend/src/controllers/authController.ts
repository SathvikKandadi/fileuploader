import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const auth = new AuthService();

export const login = async (req:Request , res:Response) =>
{
    const {email , password} = req.body;
    try {
        const data = await auth.login(email,password);
        res.status(200).json({user:data.user , token:data.token});
    } catch (error) {
         res.status(500).json({ message: (error as Error).message });
    }
}

export const register = async (req:Request , res:Response) =>
    {
        const {email , password , name} = req.body;
        try {
            const data = await auth.register(email,password , name);
            res.status(200).json({user:data.user , token:data.token});
        } catch (error) {
             res.status(500).json({ message: (error as Error).message });
        }
    }