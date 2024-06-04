const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CatSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 100 },
});

CatSchema.virtual('url').get(function () {
    return `/categories/${this._id}`;
});

module.exports = mongoose.model('Category', CatSchema);
