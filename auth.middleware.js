const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || ""; // Expect: Bearer <token>
  const token = header.startsWith("Bearer ") ? header.slice(7) : null; // ✅ Fix here
  //console.log("Extracted token:", token);

  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // verify with secret
    req.user = payload; // { id, userName }
    next();
  } catch (e) {
    console.error("JWT Verify Error:", e.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
