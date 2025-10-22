import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const modelAcademicLoad = new Schema({
    school: {type: mongoose.Schema.Types.ObjectId, ref: "schools", required:[true, 'El colegio es requerido']},
    professor: {type: String, required:[true,'El profesor es requerido']},
    subject: {type: mongoose.Schema.Types.ObjectId, ref: "subjects", required:[true, 'La materia es requerida']},
    group: {type: String, required:[true, 'El grupo es requerido']},
    year: {type: Number, required:[true, 'El año es requerido'],  min: [2000, 'El año debe ser mayor a 2000'], max: [2030, 'El año debe ser menor a 2030']},
    hoursIntensity: {type: String, required: [true, 'La intensidad horaria es requerida'], trim: true},
    percentage: {type: Number,required: [true, 'El porcentaje es requerido'],min: [0, 'El porcentaje no puede ser menor a 0'],max: [100, 'El porcentaje no puede ser mayor a 100']},
    isActive: {type: Boolean, default: true}
}, 
{
    timestamps: true // Agrega createdAt y updatedAt automáticamente

});
modelAcademicLoad.index({
    professor: 1,
    subject: 1, 
    group: 1,
    year: 1
}, { unique: true });
         
export default mongoose.model("modelAcademicLoad", modelAcademicLoad);