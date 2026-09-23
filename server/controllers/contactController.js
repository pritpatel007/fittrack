const ContactMessage = require('../models/ContactMessage');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    const msg = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message received! We will get back to you soon.' });
  } catch (err) {
    next(err);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort('-createdAt');
    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id, { isRead: true }, { new: true }
    );
    res.json({ success: true, msg });
  } catch (err) {
    next(err);
  }
};
