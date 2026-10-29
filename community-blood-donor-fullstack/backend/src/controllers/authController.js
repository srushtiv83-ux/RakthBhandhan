import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Donor from "../models/Donor.js";

const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key";
const VALID_ROLES = new Set(["DONOR", "REQUESTER", "VOLUNTEER", "ADMIN"]);

function normalizeRole(role) {
  return VALID_ROLES.has(role) ? role : "DONOR";
}

export async function register(req,res){
  try {
    const {name,email,password,bloodGroup="O+",role="DONOR",phone}=req.body;
    const trimmedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if(!trimmedName || !normalizedEmail || !password) {
      return res.status(400).json({message:"Name, email and password are required"});
    }

    const safeRole = normalizeRole(role);

    if(await User.findOne({email: normalizedEmail})) {
      return res.status(409).json({message:"Email already registered"});
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hash,
      bloodGroup,
      role: safeRole,
      phone,
    });

    if(safeRole === "DONOR") {
      await Donor.create({userId: user._id, bloodGroup});
    }

    const token = jwt.sign({id:user._id, role:safeRole}, JWT_SECRET, {expiresIn:"7d"});
    res.status(201).json({
      token,
      user:{id:user._id, name: trimmedName, email: normalizedEmail, role:safeRole, bloodGroup},
    });
  } catch (e) {
    res.status(500).json({message:e.message});
  }
}

export async function login(req,res){
  try {
    const {email,password}=req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if(!normalizedEmail || !password) {
      return res.status(400).json({message:"Email and password are required"});
    }

    const user = await User.findOne({email: normalizedEmail});
    if(!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({message:"Invalid credentials"});
    }

    const token = jwt.sign({id:user._id, role:user.role}, JWT_SECRET, {expiresIn:"7d"});
    res.json({
      token,
      user:{id:user._id, name:user.name, email:user.email, role:user.role, bloodGroup:user.bloodGroup},
    });
  } catch (e) {
    res.status(500).json({message:e.message});
  }
}
