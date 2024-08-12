import jwt from "jsonwebtoken"

export const generateToken = ({
    payload = {},
    signature = process.env.JWT_TOKEN_SIGNATURE,
    expireIn = 60 * 60
}) => {
    try {
        const token = jwt.sign(payload, signature, { expiresIn: parseInt(expireIn) });
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
}

export const verifyToken = ({
    token,
    signature = process.env.JWT_TOKEN_SIGNATURE,
}) => {
    try {
        console.log(token);
        token = token.trim(); 
        const decodedToken = jwt.verify(token, signature);
        return decodedToken;
    } catch (error) {
        console.error('Error verifying token:', error);
        return error;
    }
}