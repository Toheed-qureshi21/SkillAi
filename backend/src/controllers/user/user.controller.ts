import { Request, Response } from "express";
import { TryCatch } from "../../utils/TryCatch.js";
import { onboardUserValidator } from "../../validators/user.validator.js";
import { IUser, UserModel } from "../../models/User.schema.js";

export const getUserProfile = TryCatch(async (req: Request, res: Response) => {
  return res.status(200).json({ success: true, user: req.user });
});

export const onboardUserToCompleteProfile = TryCatch(async(req:Request,res:Response)=>{
    // Logic to onboard user and complete profile
    const result = onboardUserValidator.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({success:false,errors:result.error.issues});
    }
    const {industry,specialization,yearsOfExperience,skills,bio} = result.data;
    // Assuming req.user contains the authenticated user's information
    if(!req.user){
        return res.status(401).json({success:false,message:"Unauthorized"});
    }
    const user = req.user as IUser;
    const updatedUser = await UserModel.findByIdAndUpdate(user._id,{
        industry,
        specialization,
        yearsOfExperience,
        isOnboarded:true,
        skills,
        bio
    },{new:true});
    if (!updatedUser) {
    return res.status(404).json({success: false, message: "User not found"});
  }

    return res.status(200).json({success:true,message:"Profile completed successfully",user:updatedUser});
});