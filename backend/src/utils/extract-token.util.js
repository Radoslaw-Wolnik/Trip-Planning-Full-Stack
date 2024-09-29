// utils/tokenExtractor.js
const extractToken = (req) => {
    const authHeader = req.headers['authorization'];
    return authHeader && authHeader.split(' ')[1];
};

export default extractToken;