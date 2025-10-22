import express from 'express';
import auth from '../middlewares/auth.js';
import authorize from '../middlewares/authorize.js';
import { validateFields } from '../middlewares/checkAcademicLoad.js';
import { check } from 'express-validator';
import {
        getLoadsByYear,
        getLoadById,
        getLoadsByProfessor,
        getLoadsByGroup,
        createAcademicLoad,
        updateAcademicLoad,
        activateAcademicLoad,
        deactivateAcademicLoad,
        deleteAcademicLoad
} from '../controllers/AcademicLoad.js';

const router = express.Router();

// Middleware para verificar roles específicos
 const onlySecretary = authorize(['secretary']);
const readOnly = authorize(['principal', 'coordinator', 'secretary']); 

// ✅ RUTAS CORREGIDAS - Sin caracteres especiales
router.get('/year/:year', [
    check('year', 'No es un año válido').isInt({ min: 2000, max: 2030 }).toInt(),
    validateFields
], getLoadsByYear);

router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], getLoadById);

router.get('/professor/:professorId', [
    check('professorId', 'ID de profesor no válido').isMongoId(),
    validateFields
], getLoadsByProfessor);

router.get('/group/:groupId', [
    check('groupId', 'ID de grupo no válido').isMongoId(),
    validateFields
], getLoadsByGroup);

// Rutas de escritura (solo secretaria)
router.post('/', [
    check('school', 'El colegio es requerido y debe ser un ID válido').isMongoId(),
    check('professor', 'El profesor es requerido').notEmpty(),
    check('subject', 'La materia es requerida y debe ser un ID válido').isMongoId(),
    check('group', 'El grupo es requerido').notEmpty(),
    check('year', 'El año es requerido y debe estar entre 2000 y 2030').isInt({ min: 2000, max: 2030 }).toInt(),
    check('hoursIntensity', 'La intensidad horaria es requerida').notEmpty(),
    check('percentage', 'El porcentaje es requerido y debe estar entre 0 y 100').isFloat({ min: 0, max: 100 }).toFloat(),
    validateFields
], createAcademicLoad);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('hoursIntensity').optional().notEmpty().withMessage('La intensidad horaria no puede quedar vacía'),
    check('percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('El porcentaje debe estar entre 0 y 100').toFloat(),
    validateFields
], updateAcademicLoad);

router.put('/:id/activate', [
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], activateAcademicLoad);

router.put('/:id/deactivate', [
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], deactivateAcademicLoad);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    validateFields
], deleteAcademicLoad);

// ✅ RUTAS CORREGIDAS - Sin caracteres especiales
// router.get('/year/:year', auth, readOnly, getLoadsByYear);
// router.get('/:id', auth, readOnly, getLoadById);
// router.get('/professor/:professorId', auth, readOnly, getLoadsByProfessor);
// router.get('/group/:groupId', auth, readOnly, getLoadsByGroup);

// // Rutas de escritura (solo secretaria)
// router.post('/', auth, onlySecretary, createAcademicLoad);
// router.put('/:id', auth, onlySecretary, updateAcademicLoad);
// router.put('/:id/activate', auth, onlySecretary, activateAcademicLoad);
// router.put('/:id/deactivate', auth, onlySecretary, deactivateAcademicLoad);
// router.delete('/:id', auth, onlySecretary, deleteAcademicLoad);
export default router;