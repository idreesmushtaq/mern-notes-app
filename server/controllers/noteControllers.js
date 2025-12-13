const Note = require('../models/Note');
const cloudinary = require('../config/cloudinary').default;

// Create a new note
exports.createNote = async  (req, res) => {
    try {
        const {title, content, tags=[], category = "", color} = req.body;

        const note = await Note.create({
            title, 
            content,
            tags: Array.isArray(tags) ? tags : (tags ?  tags.split(",").map(t=>t.trim()) : []),
            category,
            color,
            user: req.user.id 
        });

        res.status(201).json(note);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
};


// Get all notes
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
        q,
        page = 1,
        limit = 10,
        tag,
        category,   
        pinned,
        favorite,
        sortBy = 'pinnedDesc',
    } = req.query;

    const filter = { user: userId };

    if (q) filter.$text = { $search: q };
    if (tag) filter.tags = tag;
    if (category) filter.category = category;
    if (pinned !== undefined) filter.pinned = pinned === 'true';
    if (favorite !== undefined) filter.favorite = favorite === 'true';

    const skip = (page - 1) * limit

    const sortObj = 
        sort === 'pinnedDesc'? { pinned: -1, updatedAt: -1 } : { updatedAt: -1 };

    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter)
        .sort(sortObj).skip(skip).limit(Number(limit));

    res.json({notes, total, page: Number(page), limit: Number(limit)});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server Error'}); 
  }
};


// update a note
exports.updateNote = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, content, tags, category, color} = req.body;

        const note = await Note.findByIdAndUpdate(
            {_id: id, user: req.user.id},
            {title, content, tags, category, color},
            {new: true}
        );
        if (!note) return res.status(404).json({error: 'Note not found'});
        res.json(note);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};


// delete a note
exports.deleteNote = async (req, res) => {
    try {
        const {id} = req.params;

        const note = await Note.findByIdAndDelete( {_id: id, user: req.user.id});
        if (!note) return res.status(404).json({error: 'Note not found'});

        // If the note has an associated image, delete it from Cloudinary
        if (note.image?.public_id) {
            await cloudinary.uploader.destroy(note.image.public_id);
        }

        res.json({message: 'Note deleted successfully'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};

exports.togglePin = async (req, res) => {
    try {
        const {id} = req.params;
        const note = await Note.findOne({_id: id, user: req.user.id});
        if (!note) return res.status(404).json({message:"Note not found"});
        note.pinned = !note.pinned;
        await note.save();
        res.json(note);

    }catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};

exports.toggleFavorite = async (req, res) => {
    try {
        const {id} = req.params;
        const note = await Note.findOne({_id: id, user: req.user.id});
        if (!note) return res.status(404).json({message:"Note not found"});
        note.favorite = !note.favorite;
        await note.save();
        res.json(note);

    }catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
};

// Upload image for a note
// Upload image for a note (multer required)
exports.uploadImage = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // convert to data URI
    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "notes_app",
    });

    // remove old image if exists
    if (note.image?.public_id) {
      await cloudinary.uploader.destroy(note.image.public_id);
    }

    note.image = { url: result.secure_url, public_id: result.public_id };
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};