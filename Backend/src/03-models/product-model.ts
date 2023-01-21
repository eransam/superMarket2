import { UploadedFile } from "express-fileupload";
import { Document, model, Schema } from "mongoose";
import { CategoryModel } from "./category-model";

//אינטרפייס ושדות
export interface IProductModel extends Document {
    name: string
    price: number
    imageName: string
    //שדה המכיל קובץ
    image: UploadedFile
    //שדה אשר מקבל ערך משדה של מודל חיצוני
    categoryId: Schema.Types.ObjectId
}

//סכמת ולידציה
const ProductSchema = new Schema<IProductModel>({
    name: {
        type: String,
        required: [true, "Missing name"],
        minlength: [2, "Name too short"],
        maxlength: [100, "Name too long"],
        
        //מוחק רווחים ושדות מיותרים
        trim: true,

        //פקודה זו גורמת לערך המוזן בשדה זה להיות ייחודי בדאטה בייס
        //זאת אומרת שלא יוכל להיות אובייקט אחר עם שם זהה לשם אובייקט שכבר קיים במערכת 
        unique: true

    },
    price: {
        type: Number,
        required: [true, "Missing price"],
        min: [0, "Price can't be negative"],
        max: [1000, "Price can't exceed 1000"]

    },
    imageName: {
        type: String,
    },
    image: {
        type: Object,
    },
    categoryId: Schema.Types.ObjectId

}, {

    //מייצר שדה גירסה בדאטה בייס
    versionKey: false,

    //cart-item-model הסבר ב 
    toJSON: { virtuals: true },

    //id: false // Don't duplicate _id into id field
    //לא נקבל באופן אוטומטי עוד שדה של איידי
    id: false
})

//cart-item-model הסבר ב 
ProductSchema.virtual('category', {
    ref: CategoryModel,
    localField: 'categoryId',
    foreignField: '_id',
    justOne: true

})

//cart-item-model הסבר ב 
export const ProductModel = model<IProductModel>('ProductModel', ProductSchema, 'products')

