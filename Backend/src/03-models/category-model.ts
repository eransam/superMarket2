import { Document, model, Schema } from "mongoose";

export interface ICategoryModel extends Document {
    name: string
}

//סכמת ולידציה
const CategorySchema = new Schema<ICategoryModel>({
    name: {
        type: String,
        required: [true, "Missing name"],
        minlength: [2, "Name too short"],
        maxlength: [100, "Name too long"],
        trim: true,
        unique: true
    }
}, {

    //versionKey: false, // Don't create __v field for versioning
    //מייצר שדה גירסה בדאטה בייס
    versionKey: false
})

// //cart-item-model הסבר ב 
export const CategoryModel = model<ICategoryModel>('CategoryModel', CategorySchema, 'categories')