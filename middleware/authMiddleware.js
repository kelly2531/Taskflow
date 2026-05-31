const jwt = require('jsonwebtoken');
const SECRET = 'taskflow_secret';
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Acesso negado' });
    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch{
        res.status(401).json({ error: 'Token inválido' });
    }
}
module.exports = authMiddleware;
