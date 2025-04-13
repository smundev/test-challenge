const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const crypto = require('crypto');
const notes = [];

// @route   POST api/notes
// @desc    Create a note
// @access  Public
router.post(
  '/',
  [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, description } = req.body;
    const note = {
      id: crypto.randomUUID(),
      title,
      description,
      createdAt: new Date().toISOString()
    };
    notes.push(note);

    res.status(201).json({
      success: true,
      data: note
    });
  }
);

// @route   GET api/notes
// @desc    Get all notes
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes
  });
});

// @route   GET api/notes/:id
// @desc    Get note by ID
// @access  Public
router.get('/:id', (req, res) => {
  const note = notes.find((note) => note.id === req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      error: 'Note not found'
    });
  }

  res.status(200).json({
    success: true,
    data: note
  });
});

// @route   PUT api/notes/:id
// @desc    Update a note
// @access  Public
router.put(
  '/:id',
  [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const noteIndex = notes.findIndex((note) => note.id === req.params.id);

    if (noteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Note not found'
      });
    }

    const updatedNote = {
      ...notes[noteIndex],
      title: req.body.title,
      description: req.body.description,
      updatedAt: new Date().toISOString()
    };

    notes[noteIndex] = updatedNote;

    res.status(200).json({
      success: true,
      data: updatedNote
    });
  }
);

// @route   DELETE api/notes/:id
// @desc    Delete a note
// @access  Public
router.delete('/:id', (req, res) => {
  const noteIndex = notes.findIndex((note) => note.id === req.params.id);

  if (noteIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Note not found'
    });
  }

  notes.splice(noteIndex, 1);

  res.status(200).json({
    success: true,
    data: null
  });
});

module.exports = router;
