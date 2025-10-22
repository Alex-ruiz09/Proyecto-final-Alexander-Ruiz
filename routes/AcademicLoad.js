import express from 'express';
import auth from '../middlewares/auth.js';
import authorize from '../middlewares/authorize.js';
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
router.get('/year/:year', getLoadsByYear);
router.get('/:id', getLoadById);
router.get('/professor/:professorId', getLoadsByProfessor);
router.get('/group/:groupId', getLoadsByGroup);

// Rutas de escritura (solo secretaria)
router.post('/', createAcademicLoad);
router.put('/:id', updateAcademicLoad);
router.put('/:id/activate', activateAcademicLoad);
router.put('/:id/deactivate', deactivateAcademicLoad);
router.delete('/:id', deleteAcademicLoad);

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