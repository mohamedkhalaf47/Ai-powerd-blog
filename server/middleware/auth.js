import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
	try {
		const authHeader =
			req.headers["Authorization"] || req.headers["authorization"];

		const token = authHeader.split(" ")[1];

		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "Token Not Found" });
		}

		jwt.verify(token, process.env.JWT_SECRET_KEY);

		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({ success: false, message: error.message });
	}
};

export default auth;
