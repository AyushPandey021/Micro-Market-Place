import jwt from "jsonwebtoken";

function createAuthMiddleware(roles = ["user"]) {
    return function authMiddleware(req, res, next) {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                });
            }

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Insufficient permissions"
                });
            }

            req.user = decoded;
            next();
        });
    };

}

export default createAuthMiddleware;