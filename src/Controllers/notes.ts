import { Note } from "../Models/user";
import { AuthRequest } from "../middlewares/isAuth";
import { User } from "../Models/user";
import { Response } from "express";

export const addnotes = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const note = await Note.create({ content });
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    user.notes.push(note.id);
    await user.save();
    const userWithNotes = await User.findById(req.user._id).populate("notes");
    return res.status(201).json({
      message: "Note created ",
      success: true,
      notes:userWithNotes?.notes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
}

export const deleteNote = async(req:AuthRequest,res:Response)=>{
    try{
      const {id} = req.body;
      await User.findByIdAndUpdate(req.user._id,{$pull:{notes:id}})
      await Note.findByIdAndDelete(id);
      const userWithNotes = await User.findById(req.user._id).populate("notes");
      return res.status(201).json({
        message: "Note deleted",
        success: true,
        notes:userWithNotes?.notes,
      });
    }catch(error){
        return res.status(500).json({message:"Internal server error",success:false})
    }
}

export const getnotes = async (req: AuthRequest, res: Response) => {
  try {
    const userWithNotes = await User.findById(req.user._id).populate("notes");
    return res.status(201).json({
      message: "Note created ",
      success: true,
      user:{
        notes:userWithNotes?.notes,
        email:req.user.email,
        name:userWithNotes?.name
      }
    });
    
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
}