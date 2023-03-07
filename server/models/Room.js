const mongoose = require('mongoose');

const roomSchema = mongoose.Schema(
    {

        roomId: {
            type: Number,
            required: true,
        },

        isFull: {
            type: Boolean,
            require: true,
        }
    }
);

module.exports = mongoose.model('Room', roomSchema);
