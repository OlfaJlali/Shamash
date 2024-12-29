const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Replace with your actual secret key
    req.user = decoded; // Attach decoded user info to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};

module.exports = authenticate;
