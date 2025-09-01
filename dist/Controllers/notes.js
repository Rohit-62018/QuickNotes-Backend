"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getnotes = exports.deleteNote = exports.addnotes = void 0;
const user_1 = require("../Models/user");
const user_2 = require("../Models/user");
const addnotes = async (req, res) => {
    try {
        const { content } = req.body;
        const note = await user_1.Note.create({ content });
        const user = await user_2.User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        user.notes.push(note.id);
        await user.save();
        const userWithNotes = await user_2.User.findById(req.user._id).populate("notes");
        return res.status(201).json({
            message: "Note created ",
            success: true,
            notes: userWithNotes?.notes
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
exports.addnotes = addnotes;
const deleteNote = async (req, res) => {
    try {
        const { id } = req.body;
        await user_2.User.findByIdAndUpdate(req.user._id, { $pull: { notes: id } });
        await user_1.Note.findByIdAndDelete(id);
        const userWithNotes = await user_2.User.findById(req.user._id).populate("notes");
        return res.status(201).json({
            message: "Note deleted",
            success: true,
            notes: userWithNotes?.notes,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
exports.deleteNote = deleteNote;
const getnotes = async (req, res) => {
    try {
        const userWithNotes = await user_2.User.findById(req.user._id).populate("notes");
        return res.status(201).json({
            message: "Note created ",
            success: true,
            user: {
                notes: userWithNotes?.notes,
                email: req.user.email,
                name: userWithNotes?.name
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", success: false });
    }
};
exports.getnotes = getnotes;
