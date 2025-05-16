import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from '../middlewares/validar-campos.js';
import { savePublication, getPublication, deletePublication, updatePublication, getByCourse } from './publication.controller.js';

const router = Router();

router.post(
    "/",
    [
        validarCampos
    ],
    savePublication
);

router.get("/", getPublication);

router.delete(
    "/:id",
    [
        check("id", "It is not a valid id").isMongoId(),
        validarCampos  
    ],
    deletePublication
);

router.put(
    "/:id",
    [
        check("id", "It is not a valid id").isMongoId(),
        validarCampos 
    ],
    updatePublication
);

router.get("/curso", getByCourse);
    
export default router;