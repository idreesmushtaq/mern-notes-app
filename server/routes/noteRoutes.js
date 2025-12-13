const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


const {
    createNote,
    getNotes,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavorite,
    uploadImage,

} = require('../controllers/noteControllers'); 

// Correct routes
router.get("/", protect, getNotes);
router.post("/", protect, createNote);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);
router.put("/:id/togglePin", protect, togglePin);
router.put("/:id/toggleFavorite", protect, toggleFavorite);
router.post("/:id/upload", protect, upload.single('image'), uploadImage);  

module.exports = router;
