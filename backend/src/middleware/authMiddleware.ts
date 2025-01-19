import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  email: string;

}


declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
  
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

  
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Use Bearer scheme.'
      });
    }

   
    const token = authHeader.split(' ')[1];

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

  
    req.user = decoded;

    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.'
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: 'Internal server error.'
    });
  }
};


// export const requireRole = (requiredRole: string) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required.'
//       });
//     }

//     
//     if (req.user.role !== requiredRole) {
//       return res.status(403).json({
//         success: false,
//         message: 'Access denied. Insufficient permissions.'
//       });
//     }

//     next();
//   };
// };


/*
// Protect a single route
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

// Protect a route with role requirement
app.get('/admin', authMiddleware, requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin!' });
});

// Protect all routes in a router
const protectedRouter = express.Router();
protectedRouter.use(authMiddleware);

protectedRouter.get('/profile', (req, res) => {
  res.json({ user: req.user });
});
*/