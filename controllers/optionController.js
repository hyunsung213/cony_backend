const { Option } = require("../models");

exports.createOption = async (req, res) => {
  try {
    const option = await Option.create(req.body);

    res.json(option);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllOptions = async (req, res) => {
  try {
    const options = await Option.findAll();
    res.json(options);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOptionById = async (req, res) => {
  try {
    const option = await Option.findByPk(req.params.id);
    if (option) res.json(option);
    else res.status(404).json({ error: "Option not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOption = async (req, res) => {
  try {
    const [updated] = await Option.update(req.body, {
      where: { optionId: req.params.id },
    });
    if (updated) res.json({ message: "Option updated" });
    else res.status(404).json({ error: "Option not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOption = async (req, res) => {
  try {
    const deleted = await Option.destroy({
      where: { optionId: req.params.id },
    });
    if (deleted) res.json({ message: "Option deleted" });
    else res.status(404).json({ error: "Option not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
