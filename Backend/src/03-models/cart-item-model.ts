import { Document, model, Schema } from "mongoose";
import { CartModel } from "./cart-model";
import { ProductModel } from "./product-model";



//*********************************************************************************************
//ָָָָָָָָָָָָָָָָָ********************* המוצרים אשר נמצאים בתוך הסל של היוזר********************************
//*********************************************************************************************



//מודל של הקארד אשר מכיל את הפרופרטיס המוזכרים מטה
export interface ICartItemModel extends Document {
    quantity: number
    total: number

    //אומר שערך הפרופרטי הזה מגיע ממודל אחד Schema.Types.ObjectId
    productId: Schema.Types.ObjectId
    cartId: Schema.Types.ObjectId
}

//כאן אנו יוצרים ולידציות למודל זה 
const CartItemSchema = new Schema<ICartItemModel>({
    quantity: {
        type: Number,
        required: [true, "Missing quantity"],
        min: [0, "Quantity can't be negative"],
        max: [100, "Quantity can't exceed 100 items"]
    },


    total: {
        type: Number,
        min: [0, "Total can't be negative"],

    },

    //כאן אנו שוב מעדכנים ששדות אלה הם ממודל אחר
    productId: Schema.Types.ObjectId,
    cartId: Schema.Types.ObjectId

}, {
    //כאן אנו רושמים פקודה אשר מאשרת להכניס לתוך המודל הזה שדות ממודלים
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
})

//Virtual Fields: 
//אשר אנו רוצים לקשר שדות שלו במודל הנוכחי ProductModel כך אנו מצביעים על מודל אחר 
CartItemSchema.virtual('product', {
    ref: ProductModel,

    //כאן אנו מבציעים על השדה שהזנו במודל הנוכחי
    localField: 'productId',

    //(ProductModel) וכאן אנו קובעים שערכו יהיה ערך השדה הזה של המודל המקושר 
    //_id יהיה הערך של השדה  productId וכך ערכו של השדה 
    foreignField: '_id',

    //גורמת למידע להגיע כאובייקט ולא כמערך
    justOne: true
})

//Virtual Fields:
//כנ''ל 
CartItemSchema.virtual('cart', {
    ref: CartModel,
    localField: 'cartId',
    foreignField: '_id',
    justOne: true

})

//כך אנו מייצאים את המודל הזה החוצה
//CartItemModel = שם המודל 
//ICartItemModel = האינטרפייס של המודל שבתוכו יש את כל השדות
//CartItemSchema = הולידציה של שדות המודל
//items = לאיזה קולקשיין בדאטה בייס הוא מקושר
export const CartItemModel = model<ICartItemModel>('CartItemModel', CartItemSchema, 'items')

