import { response } from "express";
import Publication from '../publications/publication.model.js';
import Comment from './comment.model.js'

export const saveComment = async (req, res) => {
    try {
        const data = req.body;
        const publication = await Publication.findById(data.publicationId);

        if (!publication) {
            return res.status(404).json({
                success: false,
                msg: 'Publication not found'
            });
        }

        const comment = await Comment.create({
            publicationC: publication._id,
            comment: data.comment,
            author: data.author 
        });

        await Publication.findByIdAndUpdate(publication._id, {
            $push: { comments: comment._id }
        });

        return res.status(200).json({
            msg: 'Comment registered successfully!',
            commentDetails: {
                comment: comment.comment, 
                author: comment.author
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error to create the comment',
            error: error.message
        });
    }
};

export const getComment = async (req, res) => {
    const {limite = 10, desde = 0} = req.query;
    const query = {status: true};

    try {
        

        const comment = await Comment.find(query)
            .populate({path: 'publicationC', match: { status: true }, select: 'title' })
            .skip(Number(desde))
            .limit(Number(limite));

        const total = await Comment.countDocuments(query);

        res.status(200).json({
            succes: true,
            total,
            comment
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener comentario',
            error: error.message
        })
    }
} 

export const deleteComment = async (req, res) => {

    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                succes: false,
                message: 'Comentario no encontrado'
            });
        }

        await Comment.findByIdAndUpdate(id, {status: false});

        res.status(200).json({
            succes: true,
            message: 'Comentario eliminado'
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al eliminar comentario',
            error: error.message
        })
    }
}


export const updateComment = async (req, res  = response) => {
    try {
        const {id} = req.params;
        const {_id, title, ...data} = req.body;
        const comment1 = await Comment.findById(id);

        if (!comment1) {
            return res.status(404).json({
                succes: false,
                message: 'Comentario no encontrado'
            });
        }

        const comment = await Comment.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            succes: true,
            msj: 'Comentario actualizada exitosamente',
            comment
        })

    } catch (error) {
        res.status(500).json({
            succes: false,
            msj: "Error al actualizar",
            error: error.message
        })
    }
}  