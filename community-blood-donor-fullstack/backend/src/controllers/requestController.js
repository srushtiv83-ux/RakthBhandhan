import BloodRequest from "../models/BloodRequest.js";

export async function createRequest(req,res){
  try {
    const {bloodGroup, units, hospital, location} = req.body;

    if(!bloodGroup || !hospital || !location) {
      return res.status(400).json({message:"bloodGroup, hospital, and location are required"});
    }

    const parsedUnits = Number(units);
    if(!Number.isFinite(parsedUnits) || parsedUnits <= 0) {
      return res.status(400).json({message:"units must be a positive number"});
    }

    const r = await BloodRequest.create({
      ...req.body,
      requesterId:req.user?.id,
      units: parsedUnits,
    });

    res.status(201).json(r);
  } catch (e) {
    res.status(400).json({message:e.message});
  }
}

export async function listRequests(req,res){
  const r = await BloodRequest.find().sort({createdAt:-1});
  res.json(r);
}

export async function updateStatus(req,res){
  const r = await BloodRequest.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true});
  if(!r) return res.status(404).json({message:"Request not found"});
  res.json(r);
}
