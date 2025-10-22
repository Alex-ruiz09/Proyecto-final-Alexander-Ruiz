import AcademicLoad from '../models/AcademicLoad.js';

// @desc    Obtener todas las cargas académicas por año
// @route   GET /api/carga-academica/año/:año
// @access  Rector, Coordinador, Secretaria
export const getLoadsByYear = async (req, res) => {
    try {
        const { year } = req.params; // ✅ Ahora recibe 'year' en lugar de 'año'
        // const { colegio } = req.usuario;

        const loads = await AcademicLoad.find({ 
            año: parseInt(year), // ✅ Mantiene 'año' para la base de datos
            // colegio: colegio,
            isActive: true 
        })
        /* .populate('profesor', 'nombre apellido email')
        .populate('materia', 'nombre codigo')
        .populate('grupo', 'nombre grado')
        .populate('colegio', 'nombre'); */

        res.json({
            success: true,
            data: loads,
            count: loads.length
        });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            success: false,
            message: 'Error al obtener cargas académicas',
            // error: error.message
        });
    }
};


// @desc    Obtener carga académica por ID
// @route   GET /api/carga-academica/:id
// @access  Rector, Coordinador, Secretaria
export const getLoadById = async (req, res) => {
    try {
        const { id } = req.params;
        const load = await AcademicLoad.findById(id)
            /* .populate('profesor', 'nombre apellido email')
            .populate('materia', 'nombre codigo area')
            .populate('grupo', 'nombre grado jornada')
            .populate('colegio', 'nombre direccion'); */

        if (!load) {
            return res.status(404).json({
                success: false,
                message: 'Academic load not found'
            });
        }

        res.json({
            success: true,
            data: load
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting academic load',
            error: error.message
        });
    }
};

// @desc    Obtener asignaciones por profesor
// @route   GET /api/profesores/:profesorId/carga-academica
// @access  Rector, Coordinador, Secretaria
export const getLoadsByProfessor = async (req, res) => {
    try {
        const { professorId } = req.params;
        const { year } = req.query;
        const { school } = req.user;

        const filter = { 
            professor: professorId,
            school: school,
            isActive: true 
        };

        if (year) filter.año = parseInt(year);

        const cargas = await CargaAcademica.find(filtro)
            .populate('materia', 'nombre codigo area')
            .populate('grupo', 'nombre grado jornada')
            .populate('colegio', 'nombre');

        res.json({
            success: true,
            data: cargas,
            count: cargas.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting professor loads',
            error: error.message
        });
    }
};


// @desc    Obtener asignaciones por grupo
// @route   GET /api/grupos/:grupoId/carga-academica
// @access  Rector, Coordinador, Secretaria
 export const getLoadsByGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { year } = req.query;
        const { school } = req.user;

        const filter = { 
            group: groupId,
            school: school,
            isActive: true 
        };

        if (anio) filtro.año = parseInt(anio);

        const cargas = await CargaAcademica.find(filtro)
            /* .populate('profesor', 'nombre apellido email especialidad')
            .populate('materia', 'nombre codigo area')
            .populate('colegio', 'nombre');*/
        res.json({
            success: true,
            data: cargas,
            count: cargas.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting group loads',
            error: error.message
        });
    }
};

// @desc    Crear nueva carga académica
// @route   POST /api/carga-academica
// @access  Solo Secretaria
export const createAcademicLoad = async (req, res) => {
    try {
        const { school, professor, subject, group, year, hoursIntensity, percentage } = req.body;
        // const school = req.user.school;

        // Verificar si ya existe la asignación
        const existingLoad = await AcademicLoad.findOne({
            professor,
            subject,
            group,
            year,
            school,
            isActive: true
        });

        if (existingLoad) {
            return res.status(400).json({
                success: false,
                message: 'An active assignment already exists for this professor, subject and group in the specified year'
            });
        }

        const newLoad = new AcademicLoad({
            school,
            professor,
            subject,
            group,
            year,
            hoursIntensity,
            percentage,
            isActive: true
        });

        const savedLoad = await newLoad.save();
        await savedLoad.populate('professor', 'name lastName');
        await savedLoad.populate('subject', 'name');
        await savedLoad.populate('group', 'name');

        res.status(201).json({
            success: true,
            message: 'Academic load successfully created',
            data: savedLoad
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'An identical assignment already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error creating academic load',
            error: error.message
        });
    }
};

// @desc    Actualizar carga académica
// @route   PUT /api/carga-academica/:id
// @access  Solo Secretaria
export const updateAcademicLoad = async (req, res) => {
    try {
        const { id } = req.params;
        const { hoursIntensity, percentage } = req.body;

        const updatedLoad = await AcademicLoad.findByIdAndUpdate(
            id,
            { 
                hoursIntensity, 
                percentage 
            },
            { new: true, runValidators: true }
        )
       /*  .populate('profesor', 'nombre apellido')
        .populate('materia', 'nombre')
        .populate('grupo', 'nombre');
 */
        if (!cargaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Carga académica no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Academic load successfully updated',
            data: cargaActualizada
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating academic load',
            error: error.message
        });
    }
};

// @desc    Activar carga académica
// @route   PUT /api/carga-academica/:id/activar
// @access  Solo Secretaria
export const activateAcademicLoad = async (req, res) => {
    try {
        const { id } = req.params;

        const activatedLoad = await AcademicLoad.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        )
        .populate('profesor', 'nombre apellido')
        .populate('materia', 'nombre')
        .populate('grupo', 'nombre');

        if (!cargaActivada) {
            return res.status(404).json({
                success: false,
                message: 'Carga académica no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Academic load successfully activated',
            data: cargaActivada
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error activating academic load',
            error: error.message
        });
    }
};

// @desc    Desactivar carga académica
// @route   PUT /api/carga-academica/:id/desactivar
// @access  Solo Secretaria
export const deactivateAcademicLoad = async (req, res) => {
    try {
        const { id } = req.params;

        const deactivatedLoad = await AcademicLoad.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        )
        /* .populate('profesor', 'nombre apellido')
        .populate('materia', 'nombre')
        .populate('grupo', 'nombre'); */

        if (!cargaDesactivada) {
            return res.status(404).json({
                success: false,
                message: 'Carga académica no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Carga académica desactivada exitosamente',
            data: cargaDesactivada
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deactivating academic load',
            error: error.message
        });
    }
};

// @desc    Eliminar carga académica
// @route   DELETE /api/carga-academica/:id
// @access  Solo Secretaria
export const deleteAcademicLoad = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedLoad = await AcademicLoad.findByIdAndDelete(id);

        if (!deletedLoad) {
            return res.status(404).json({
                success: false,
                message: 'Academic load not found'
            });
        }

        res.json({
            success: true,
            message: 'Carga academica elimiada correctamente',
            data: deletedLoad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la carga académica',
            error: error.message
        });
    }
};

/*module.exports = {
    obtenerCargasPorAnio,
    obtenerCargaPorId,
    obtenerCargasPorProfesor,
    obtenerCargasPorGrupo,
    crearCargaAcademica,
    actualizarCargaAcademica,
    activarCargaAcademica,
    desactivarCargaAcademica,
    eliminarCargaAcademica
};*/