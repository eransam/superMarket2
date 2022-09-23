import ErrorModel from "../03-models/error-model"
import { ICartItemModel, CartItemModel } from "../03-models/cart-item-model"
import cartsLogic from '../05-logic/carts-logic'
import { CartModel } from "../03-models/cart-model"


//ָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָָ*************************************************************************************************
///////////////////////קובץ זה הוא הלוגיק של סל המוצרים של היוזר/////////////////////////////////
//ָָָָָָָ*************************************************************************************************


//כך אנו ממלאים את הצד השמאלי של העגלה כאשר המשתמש מתחבר מחדש:
async function getAllItemsByCart(cartId: string): Promise<ICartItemModel[]> {

    // items אשר מקושר לקולקשיין CartItemModel כך אנו מחזירים את האובייקט המבוקש ממודל 
    // .populate('cart').populate('product') ובעזרת הפקודה 
    //אנו נחזיר גם באובייקט המבוקש את השדות בעלי הערך מקולקשיינים חיצוניים המקושרים לאובייקט המבוקש 
    //*מקשור ליוזר ספציפי cart כל 
    return CartItemModel.find({ cartId }).populate('cart').populate('product').exec()
}







//אנו נכניס לתוך הפונק הזו 2 פרמטרים , את האובייקט שנרצה להוסיף לסל הקניות ואת היוזר איידי
async function addItem(item: ICartItemModel, userId: string): Promise<ICartItemModel> 
{

    //נבצע ולידציה  על אובייקט האייטם שהוכנס לפני שנוסיף אותו לסל
    const errors = item.validateSync()
    if (errors) throw new ErrorModel(400, errors.message)

    //cartId במידה ולא קיים ערך בפרופרטי
    // זה אומר  שליוזר אין עדיין קארד עם מוצרים ולכן קודם כל אנו צריכים לייצר לו קארד
    if (!item.cartId) {

        //newCart כך נייצר קארד חדש ונכניס אותו לתוך המשתנה
        const newCart = await cartsLogic.addCart(new CartModel({ userId, isClosed: false }))

        // item.cartId לאחר שיצרנו קארד חדש ליוזר שלנו אנו נכניס את הפרופקטי איידי של הקארד שיצרנו ל
        item.cartId = newCart._id;
        // וכך אנו נישמור אובייקט חדש לקארד(סל) של היוזר 
        return item.save()
    }

    //במידה וכבר יש סל ליוזר שלנו
    if (item.cartId) 
    {

        //מביאה לנו את האובייקט הראשון שהיא מוצאת אשר תואם לערכים שנזין בתוכה .updateOne הפונ המובנת 
        //שהזנו productIdוערך ה cartId ובשורת הקוד שלנו היא תביא לנו את האובייקט הראשון עם ערך ה find בדומה לפונ 
        //שזה בעצם אומר שהוא יתפוס לנו את המוצר הראשון שבסל שתואם לערכים שהכנסנו
        //$set בעזרת הפקודה  quantity: item.quantity, total: item.total ויעדכן או יוסיף לו את הפרופרטי האלה 
        await CartItemModel.updateOne({ cartId: item.cartId, productId: item.productId }, { $set: { quantity: item.quantity, total: item.total } }).exec()
        
        //found לאחר מכן אנו נכניס את האייטם החדש המעודכן לתוך המשתנה 
        let found = await CartItemModel.findOne({ cartId: item.cartId, productId: item.productId }).exec()

        //במידה והאייטם חדש ולא מופיע עדיין בסל אנחנו נשמור אותו 
        //ובמידה והוא קיים אנחנו נחזיר אותו
        if (!found) {
            return item.save()
        } else {
            return found;
        }
    }
}







//מחיקת מוצר מהסל
async function deleteItem(productId: string, cartId: string): Promise<void> {

    //אשר רצה על האובייקטים במוצר הרצוי ומחזירה deleteOne כדי למחוק מוצר אנו צריכים להשתמש בפונ 
    //למשתנה שלנו את האובייקט הראשון שמוצאת שתואם לנתונים שהוזנו
    const deletedItem = await CartItemModel.deleteOne({ productId, cartId }).exec()


    if (!deletedItem) throw new ErrorModel(404, `Resource with productId ${productId} or cartId ${cartId} not found`)
}

//מחיקת קולקשיין
async function deleteAllItemsByCart(cartId: string): Promise<void> {

    //מוחקת מהקולקשיין את כל האובייקטים התואמים לנתונים שהוזנו deleteMany פונ ה
    const deletedCartItems = await CartItemModel.deleteMany({ cartId })

    if (!deletedCartItems) throw new ErrorModel(404, `Resources with _id ${cartId} not found`)
}







export default {
    getAllItemsByCart,
    addItem,
    deleteItem,
    deleteAllItemsByCart
}