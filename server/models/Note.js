const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
    title: {
        type:String,
        required:true,
    },
    content: {
        type:String,
        required:true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    pinned: { type: Boolean, default: false },
    favourite: { type: Boolean, default: false},
    color: { type: String, default: 'white' },
    tags: [{ type: String }],
    category: {type: String, default: '' },
    image: {
        url: { type: String, default: '' },
        public_id: { type: String, default: '' },
    },
    },
     {
    timestamps: true,
     

});

noteSchema.index({title: 'text', content: 'text'});

module.exports = mongoose.model('Note' , noteSchema);