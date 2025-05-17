import { response } from "express";
import Publication from './publication.model.js';
import Comment from '../comments/comment.model.js'

export const savePublication = async (req, res) => {
    try {

        const data = req.body;

        const publication = new Publication({
            ...data,
        });

        await publication.save();

        res.status(200).json({
            succes: true,
            publication
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al crear la publicacion',
            error: error.message
        })
    }
}

export const getPublication = async (req, res) => {
    const { limite = 10, desde = 0 } = req.query;
    const query = { status: true };

    try {
        const [total, publication] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .populate({ path: 'comments', match: { status: true }, select: 'comment author createdAt' })
                .skip(Number(desde))
                .limit(Number(limite))
        ])

        res.status(200).json({
            succes: true,
            total,
            publication
        })
    } catch (error) {
        res.status(500).json({
            succes: false,
            msg: 'Error al obtener la publicacion',
            error: error.message
        })
    }
}

export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const publication = await Publication.findById(id);

        if (!publication) {
            return res.status(404).json({
                success: false,
                message: 'Publicación no encontrada'
            });
        }

        const updatedPublication = await Publication.findByIdAndUpdate(id, { status: false }, { new: true });

        await Comment.updateMany({ publicationC: id }, { status: false });

        res.status(200).json({
            success: true,
            message: 'Publicación y sus comentarios eliminados exitosamente',
            publication: updatedPublication
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la publicación',
            error
        });
    }
};


export const updatePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, ...data } = req.body;


        const publication = await Publication.findByIdAndUpdate(id, data, { new: true });

        if (!publication) {
            return res.status(404).json({
                succes: false,
                message: 'Publicación no encontrada'
            });
        }

        res.status(200).json({
            succes: true,
            message: 'Publicación actualizada exitosamente',
            publication
        });

    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Error al actualizar la publicación",
            error: error.message
        });
    }
};

export const getByCourse = async (req, res) => {
    const { limite = 10, desde = 0, course } = req.query;
    const query = { status: true };

    if (course) {
        query.course = course;
    }

    try {
        const [total, publication] = await Promise.all([
            Publication.countDocuments(query),
            Publication.find(query)
                .populate({ path: 'comments', match: { status: true }, select: 'comment author' })
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            succes: true,
            message: 'Publicación por curso obtenida exitosamente',
            total,
            publication
        });
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Error al obtener la publicación",
            error: error.message
        });
    }
};
