const jwt = require('jsonwebtoken')

const protect = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient role.' })
      }
      req.user = decoded
      next()
    } catch (err) {
      res.status(400).json({ message: 'Invalid token' })
    }
  }
}

module.exports = protect
