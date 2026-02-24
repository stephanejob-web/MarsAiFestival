import { Request, Response } from "express";

export const welcome = (req: Request, res: Response): void => {
    res.json({ message: "Bienvenue sur l'API MarsAiFestival !" });
};
