const templateService = require('../../services/chatbox/template');

exports.getTemplates = async (req, res) => {
  try {
    const result = await templateService.getTemplates(req.query.category);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    const result = await templateService.createTemplate(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteTemplate = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ error: 'Template name is required' });
    }

    const result = await templateService.deleteTemplate(name);
    res.status(200).json({ message: 'Template deleted', result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};