import {Schema, model} from "mongoose";

const PublicationSchema = Schema({

    title: {
        type: String,
        required: true
    },
    maintext: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: "Peralta"
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    }],
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

export default model('Publication', PublicationSchema)