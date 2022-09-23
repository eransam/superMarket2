import ErrorModel from "../03-models/error-model"
import { IOrderModel, OrderModel } from "../03-models/order-model";
import cartsLogic from '../05-logic/carts-logic';

// פונ אשר מוסיפה הזמנה 
async function addOrder(order: IOrderModel): Promise<IOrderModel> {
    const errors = order.validateSync()
    if (errors) throw new ErrorModel(400, errors.message)
    
    //לאחר קבלת פרטי ההזמנה ולפני הסגירה של הסל אני נסגור את הסל בעזרת 
    //cartsLogic.closeCart הפונקציה 
    await cartsLogic.closeCart(order.cartId.toString())
    
    //ולאחר מכן אנו נשמור את פרטי ההזמנה בדאטה בייס לאחר שעודכן שהיא נסגרה
    return await order.save();

}

//פונ אשר מביאה לנו את כל האובייקטים ובגלל שלאובייקטים האלה יש פרופרטי אשר מקבל ערך
//populate ננטדלים אחרים אנו נשתמש ב
async function getAllOrders(): Promise<IOrderModel[]> {
    return OrderModel.find().populate('cart').populate('user').exec()
}

//פונ אשר סופרת הזמנות
//מחזירה את מספר האובייקטים .count
async function countOrders(): Promise<number> {
    return OrderModel.find().count().exec()
}

export default {
    addOrder,
    getAllOrders,
    countOrders,
}