const { Note } = require("../models");

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create(req.body);
    console.log(note);
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (note) res.json(note);
    else res.status(404).json({ error: "Note not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const [updated] = await Note.update(req.body, {
      where: { noteId: req.params.id },
    });
    if (updated) res.json({ message: "Note updated" });
    else res.status(404).json({ error: "Note not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const deleted = await Note.destroy({
      where: { noteId: req.params.id },
    });
    if (deleted) res.json({ message: "Note deleted" });
    else res.status(404).json({ error: "Note not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
