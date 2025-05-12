import {Schema, model} from "mongoose";

const CommentsSchema = Schema({

    publicationC: {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
        required: true
    },  
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        default: "anonymous"
    },
    status: {
        type: Boolean,
        default: true,
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model('Comment', CommentsSchema)