import Donor from "../models/Donor.js";

export async function donors(req,res){
  res.json(await Donor.find().populate("userId","name email phone"));
}

export async function availability(req,res){
  const d = await Donor.findOne({userId:req.user.id});
  if(!d) return res.status(404).json({message:"Donor profile not found"});

  if(typeof req.body.available !== "boolean") {
    return res.status(400).json({message:"available must be a boolean"});
  }

  d.available = req.body.available;
  await d.save();
  res.json(d);
}

export async function updateLocation(req,res){
  const d = await Donor.findOne({userId:req.user.id});
  if(!d) return res.status(404).json({message:"Donor profile not found"});

  const { latitude, longitude } = req.body;
  if(latitude === undefined || longitude === undefined) {
    return res.status(400).json({message:"latitude and longitude are required"});
  }

  d.latitude = latitude;
  d.longitude = longitude;
  await d.save();
  res.json(d);
}
