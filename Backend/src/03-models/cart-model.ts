import { Document, model, Schema } from "mongoose";
import { UserModel } from "./user-model";


//**************************************************************************
//ָָָָָָָָָָָָָָָָָ********************* סל הקניות של היוזר ********************************
//**************************************************************************

//1. יצירת אינטרפייס עם שדות
export interface ICartModel extends Document {

    //שדה אשר מגיע ממודל אחר 
    userId: Schema.Types.ObjectId

    //שדה מסוג בוליאן
    isClosed: boolean
}

//יצירת ולידציות למודל
const CartSchema = new Schema<ICartModel>({

    userId: Schema.Types.ObjectId,

    //false כאן אנו קובעים שהערך הדיפולטיבי של שדה זה הוא 
    isClosed: {
        type: Boolean,
        default: false
    }

}, {
    //versionKey: false, // Don't create __v field for versioning
    //מייצר שדה גירסה בדאטה בייס
    versionKey: false,

    //מאפשר לקשר למודל זה שדות ממודלים אחרים
    toJSON: { virtuals: true },

    //id: false // Don't duplicate _id into id field
    //לא נקבל באופן אוטומטי עוד שדה של איידי
    id: false,

    //When you enable timestamps, Mongoose adds createdAt and updatedAt properties to your schema. By default,
    //createdAt and updatedAt are of type Date. When you update a document, Mongoose automatically increments updatedAt.
    timestamps: true
})

//Virtual Fields: 
//הקיים במודל הנוכחי יקבל את  userId ופה אנו נקבע שהשדה (user-model) user מקובץ ה UserModelמקשר את מודל ה
//במודל המקושר _id הערך של השדה 
CartSchema.virtual('user', {
    ref: UserModel,
    localField: 'userId',
    foreignField: '_id',

    //גורמת למידע להגיע כאובייקט ולא כמערך
    justOne: true

})

//cart-item-model הסבר ב 
export const CartModel = model<ICartModel>('CartModel', CartSchema, 'carts')
