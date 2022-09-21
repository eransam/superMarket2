import { CategoryModel, ICategoryModel } from "../03-models/category-model"
import ErrorModel from "../03-models/error-model"
import { IProductModel, ProductModel } from "../03-models/product-model"
import { v4 as uuid } from 'uuid'
import path from "path"
import safeDelete from "../01-utils/safe-delete"


//Get all Categories
//המקושרים באובייקטים הנמצאים  ProductModel כך אנו נזמן את על האובייקטים הנמתאים בתוך הקולקשיין הנמצא ב
//(.populate('category')) category בקולקשיין 
async function getAllProducts(): Promise<IProductModel[]> {
    return ProductModel.find().populate('category').exec()
}

//Count products
//ProductModel פונ' אשר סופרת את כמות האובייקטים בקולקשיין הנמצא תחת 
async function countProducts(): Promise<number> {
    return ProductModel.find().count().exec()
}

//This function will be used later to get old imageName for updating product 
// _id פונק אשר מקבלת כפרמטר 
async function getOneProduct(_id: string): Promise<IProductModel> {
    //שהוכנס כפרמטר אנו מוצאים את האובייקט המבוקש ומכניסים אותו למשתנה שלנו  _id כאן אנו יוצרים משתנה ובעזרת ה
    const product = await ProductModel.findById(_id).populate('category').exec()
    // במידה ואין אובייקט עם ערך איידי כזה אנו נחזיר שגיאה
    if (!product) throw new ErrorModel(404, `Resource with _id ${_id} not found.`)
    // במידה ויש אובייקט כזה אנו נחזיר אותו
    return product
}

//Get all Categories
async function getAllCategories(): Promise<ICategoryModel[]> {
    return CategoryModel.find().exec()
}

// Add product 
//מקבלים אובייקט במודל "פרודקט" ועושים עליו ולידציה
async function addProduct(product: IProductModel): Promise<IProductModel> {
    const errors = product.validateSync()
    if (errors) throw new ErrorModel(400, errors.message)

    // Handle Images
    //image במידה וקיים ערך תחת הפרופרטי 
    if (product.image) {

        //extension אנו נכניס את ערך הסיומת של קובץ התמונה שהוכנס לתוך המשתנה 
        const extension = product.image.name.substring(product.image.name.lastIndexOf('.'))
        
        //extension ונוסיף לה את הסיומת שתחת המשתנה uuidניקח את שם התמונה שהוכנס וניתן לה שם ייחודי בעזרת ה
        //imageName וכך גם ניצור ערך תחת הפרופרטי 
        product.imageName = uuid() + extension

        //שאצלנו בפרוייקט imagesלאחר מכן ניקח את קובץ התמונה ונעביר אותה לתיקיית ה
        await product.image.mv(path.join(__dirname, '..', 'upload', 'images', product.imageName))
         
        //Do not save image in Mongo:
        // לאחר שהעברנו את התמונה לתיקייה בפרוייקט שלנו אנו נמחק אותה כדי שלא תתפוס מקום 
        // בדאטה בייס שלנו
         product.image = undefined
    }
    // כך אנו נישמור את האובייקט שלנו בדאטה בייס
    return product.save()
}






//Update product
// פונ' שמקבלת אובייקט מסוג פרודקט-מודל
async function updateProduct(product: IProductModel): Promise<IProductModel> {
    const errors = product.validateSync()
    if (errors) throw new ErrorModel(400, errors.message)
    //Handle Images
    // כאן אנו ניקח את המוצר הקיים שאנו רוצים לעדכן אותו 
    const dbProduct = await getOneProduct(product._id)
    // נזין את שם התמונה הקיימת של המוצר בתוך האובייקט שאנו רוצים לעדכן במידה והיוזר לא רוצה לשנות את התמונה הקיימת
    product.imageName = dbProduct.imageName
    // במידה והיוזר מעדכן תמונה 
    if (product.image) {
        // אנו נימחק את התמונה הישנה 
        safeDelete(path.join(__dirname, '..', 'upload', 'images', product.imageName))
        // ניצור שם תמונה חדש בכך שפה נוציא את סיומת התשונה למשתנה
        const extension = product.image.name.substring(product.image.name.lastIndexOf('.'))
        // ניצור שם תמונה חדש עם הסיומת המקורית
        product.imageName = uuid() + extension
        // ואז נישלח את התמונוה החדשה לתיקייה בפרוייקט שלנו בעזרת הנתיב המדוייק
        await product.image.mv(path.join(__dirname, '..', 'upload', 'images', product.imageName))
        //נימחק את קובץ התמונה כדי שלא יכנס לדאטה בייס עצמו
        product.image = undefined
    }




    
    // ProductModel על אובייקט מסוג findByIdAndUpdate כאן אנו יוצרים משתנה ומחילים את הפונ ' ה
    //ולאחר מכן אנו product._id ופונ' זו לוקחת את האובייקט שאותו אנו רוצים לעדכן בעזרת האיידי שלו כך 
    //וכך האובייקט המעודכן יחליף את האובייקט המקורי בדאטה בייס product נציב את האובייקט המעודכן 
    const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec()
    if (!updatedProduct) throw new ErrorModel(404, `Resource with _id ${product._id} not found.`)
    return updatedProduct
}

export default {
    getAllProducts,
    countProducts,
    getOneProduct,
    getAllCategories,
    addProduct,
    updateProduct
}