const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");


const {
    createNote,
    getNotes,
    updateNote,
    deleteNote,
} = require('../controllers/noteControllers'); 

// Correct routes
router.get("/", protect, getNotes);
router.post("/", protect, createNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);

module.exports = router;
