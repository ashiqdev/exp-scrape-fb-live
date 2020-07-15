const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const SiteSchema = new mongoose.Schema({
  requested: {
    type: Boolean,
    required: true,
  },

  processedOn: {
    type: Date,
  },

  title: {
    type: String,
    trim: true,
  },

  screenshotPath: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Site', SiteSchema);
