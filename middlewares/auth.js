import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o inválido' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id).select('-contraseña');
    
    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    
    if (!req.user.isActive) {
      return res.status(401).json({ message: 'Usuario inactivo' });
    }
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token no válido' });
    } else {
      return res.status(401).json({ message: 'Error de autenticación' });
    }
  }
};

export default auth;