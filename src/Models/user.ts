import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; 
  notes: mongoose.Types.ObjectId[]; 
}

const NoteSchema: Schema = new Schema({
  content: {
    type: String,
    required: true,
  }
});

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",  
    }
  ],
});

const User = mongoose.model<IUser>("User", UserSchema);
const Note = mongoose.model("Note", NoteSchema);

export { User, Note };