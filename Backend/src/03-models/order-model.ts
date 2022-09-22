import { Document, model, Schema } from "mongoose";
import { CartModel } from "./cart-model";
import { UserModel } from "./user-model";
import CityEnum from "./city-enum";

//אינטרפייסעם שדות
export interface IOrderModel extends Document {
    finalPrice: number
    shipCity: CityEnum
    shipStreet: string
    shipDate: Date
    creditCard: number

    //שדות אשר ערכיהם מגיעים ממודלים חיצוניים
    userId: Schema.Types.ObjectId
    cartId: Schema.Types.ObjectId
}

//סכמת ולידציה
const OrderSchema = new Schema<IOrderModel>({
    finalPrice: {
        type: Number,
        min: [0, "Final price can't be negative"],
        max: [100000, "Final price can't exceed 100,000"]

    },
    shipCity: {
        type: String,
        required: [true, "Missing ship city"],
        minlength: [2, "Ship city too short"],
        maxlength: [100, "Ship city too long"],

        //כאן אנו יוצרים שדה השסוג שלו הוא האינטרפייס שיצרנו באופן עצמי 
        //CityEnum שזה אומר ששדה זה יכול להכיל רק את הערכים הקבועים אשר נמצאים התוך ה 
        enum: CityEnum

    },
    shipStreet: {
        type: String,
        required: [true, "Missing ship street"],
        minlength: [2, "Ship street too short"],
        maxlength: [100, "Ship street too long"],

        //מוחק רווחים ותווים מיותרים
        trim: true,

    },
    shipDate: {
        type: Date,
        required: [true, "Missing shipping date"],
    },

    creditCard: {
        type: Number,
        required: [true, "Missing credit card"],

        //מכילה תבנית רגקס אשר שדה זה יהיה חייב לעמוד באותה תבנית match הפקודה 
        match: [/^[0-9]{14,16}$/, "Credit card must be a minimum of 14 numbers and max 16 numbers"],
        trim: true

    },

    //כאן אנו נעדכן שוב ששדות אלו מגיעים ממודלים חיצוניים
    userId: Schema.Types.ObjectId,
    cartId: Schema.Types.ObjectId

}, {

    //מייצר שדה גירסה בדאטה בייס
    versionKey: false,
    
    //פקודה אשר אנו חייבים לכתוב כדי לקשר למודל זה מודלים חיצוניים
    toJSON: { virtuals: true },
    
    //id: false // Don't duplicate _id into id field
    //לא נקבל באופן אוטומטי עוד שדה של איידי
    id: false,
    
    //Mongoose adds createdAt and updatedAt properties to your schema. By default,
    timestamps: true
})

//Virtual Fields: 
////cart-item-model הסבר ב 
OrderSchema.virtual('user', {
    ref: UserModel,
    localField: 'userId',
    foreignField: '_id',
    justOne: true
})

////cart-item-model הסבר ב 
OrderSchema.virtual('cart', {
    ref: CartModel,
    localField: 'cartId',
    foreignField: '_id',
    justOne: true
})


////cart-item-model הסבר ב 
export const OrderModel = model<IOrderModel>('OrderModel', OrderSchema, 'orders')