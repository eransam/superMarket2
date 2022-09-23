import ErrorModel from "../03-models/error-model"
import { CartModel, ICartModel } from "../03-models/cart-model"


//userId מחזיר סל ע''י 
async function getCartByUser(userId: string, isClosed: boolean): Promise<ICartModel> {
    const carts = await CartModel.find({ userId, isClosed }).populate('user').exec()
    if (carts.length === 0) return null
    return carts[0]
}



//הוספת סל 
//פונ אשר מקבל פרטי סל חדש, עושה עליו ולידציה ושומרת אותו בדאטה בייס
async function addCart(cart: ICartModel): Promise<ICartModel> {
    const errors = cart.validateSync()
    if (errors) throw new ErrorModel(400, errors.message)
    return cart.save()
}




//פונ אשר סוגרת את הסל לאחר ביצוע של קניית הסל הקיים
async function closeCart(_id: string): Promise<ICartModel> {

    //true ל  isClosed הפונ מקבלת את האיידי של הסל שאנו נרצה לסגור ומשנה לו את הפרופרטי 
    await CartModel.updateOne({ _id }, { $set: { isClosed: true } }).exec()

    //ולאחר מכן פונ זו תחזיר את הסל עם הנתונים והערכים החדשים
    const cart = await CartModel.findOne({ _id }).exec()
    return cart;
}


export default {
    getCartByUser,
    addCart,
    closeCart
}