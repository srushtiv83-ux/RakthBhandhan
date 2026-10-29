import mongoose from "mongoose";
const schema=new mongoose.Schema({userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},bloodGroup:{type:String,required:true},latitude:Number,longitude:Number,available:{type:Boolean,default:true},totalDonations:{type:Number,default:0},lastDonationDate:Date},{timestamps:true});
export default mongoose.model("Donor",schema);
