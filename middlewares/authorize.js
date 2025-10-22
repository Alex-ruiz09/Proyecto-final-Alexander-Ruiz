const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        message: `Acceso denegado. Se requieren los roles: ${roles.join(', ')}` 
      });
    }
    
    next();
  };
};

export default authorize;