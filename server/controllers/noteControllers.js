const Note = require('../models/Note');

// Create a new note
exports.createNote = async  (req, res) => {
    try {
        const {title, content} = req.body;

        const note = await Note.create({
            title, 
            content,
        });

        res.json(note);

    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
};


// Get all notes
exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find().sort({createdAt: -1});
        res.json(notes);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// update a note
exports.updateNote = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, content} = req.body;

        const updated = await Note.findByIdAndUpdate(
            id,
            {title, content},
            {new: true}
        );
        
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
}


// delete a note
exports.deleteNote = async (req, res) => {
    try {
        const {id} = req.params;

        await Note.findByIdAndDelete(id);

        res.json({message: 'Note deleted successfully'});
    }
    catch (error) {
        res.status(500).json({error: error.message});
    }
};