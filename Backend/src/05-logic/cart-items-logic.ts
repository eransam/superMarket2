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

//אנו נכניס לתוך הפונק הזו 2 פרמטרים , את האובייקט שנרצה להוסיף ואת היוזר איידי
async function addItem(item: ICartItemModel, userId: string): Promise<ICartItemModel> {

    //נבצע ולידציה  על הפרמטרים
    const errors = item.validateSync()
    if (errors) throw new ErrorModel(400, errors.message)

    //cartId במידה ולא קיים ערך בפרופרטי
    // זה אומר  שליוזר אין עדיין קארד עם מוצרים ולכן קודם כל אנו צריכים לייצר לו קארד
    if (!item.cartId) {
        //newCart כך נייצר קארד חדש ונכניס אותו לתוך המשתנה
        const newCart = await cartsLogic.addCart(new CartModel({ userId, isClosed: false }))
        // item.cartId לאחר שיצרנו קארד חדש ליוזר שלנו אנו נכניס את הפרופקטי איידי של הקארד שיצרנו ל
        //
        item.cartId = newCart._id;
        // וכך אנו נישמור אובייקט חדש לקארד(סל) של היוזר 
        return item.save()
    }

    //Case where cart exists:
    if (item.cartId) {
        // find the item in the cart and update the item
        await CartItemModel.updateOne({ cartId: item.cartId, productId: item.productId }, { $set: { quantity: item.quantity, total: item.total } }).exec()
        let found = await CartItemModel.findOne({ cartId: item.cartId, productId: item.productId }).exec()

        // add item that does not exist in cart: 
        if (!found) {
            // Add new item to the cart
            return item.save()
        } else {
            return found;
        }
    }
}

//Delete item - when user presses x on item on the cart :
// if you delete the item then that means the productID and the cartId gets deleted with it  
async function deleteItem(productId: string, cartId: string): Promise<void> {

    const deletedItem = await CartItemModel.deleteOne({ productId, cartId }).exec()

    if (!deletedItem) throw new ErrorModel(404, `Resource with productId ${productId} or cartId ${cartId} not found`)
}

// delete collection 
async function deleteAllItemsByCart(cartId: string): Promise<void> {

    const deletedCartItems = await CartItemModel.deleteMany({ cartId })

    if (!deletedCartItems) throw new ErrorModel(404, `Resources with _id ${cartId} not found`)
}


export default {
    getAllItemsByCart,
    addItem,
    deleteItem,
    deleteAllItemsByCart
}