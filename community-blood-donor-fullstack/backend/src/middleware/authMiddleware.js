import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key";

export function auth(req,res,next){
  const header = req.headers.authorization;
  if(!header?.startsWith("Bearer ")) return res.status(401).json({message:"Authentication required"});

  try {
    req.user = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({message:"Invalid token"});
  }
}
