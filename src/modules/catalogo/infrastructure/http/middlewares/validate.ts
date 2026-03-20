import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodObject } from 'zod';

export const validate = (schema: ZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'error',
          errors: error.issues.map(err=>err.message)
        });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
