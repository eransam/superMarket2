import { CategoryModel, ICategoryModel } from "../03-models/category-model"
import ErrorModel from "../03-models/error-model"
import { IProductModel, ProductModel } from "../03-models/product-model"
import { v4 as uuid } from 'uuid'
import path from "path"
import safeDelete from "../01-utils/safe-delete"
import { CateModel, ICateModel } from "../03-models/cate-model"





//פונ אשר מחזירה תמונה של מוצר ישן כדי לעדכן את המוצר החדש עם אותה תמונה 
async function getOneProduct(_id: string): Promise<IProductModel> {

    //שהוכנס כפרמטר אנו מוצאים את האובייקט המבוקש ומכניסים אותו למשתנה שלנו  _id כאן אנו יוצרים משתנה ובעזרת ה
    const product = await ProductModel.findById(_id).populate('category').exec()
    
    // במידה ואין אובייקט עם ערך איידי כזה אנו נחזיר שגיאה
    if (!product) throw new ErrorModel(404, `Resource with _id ${_id} not found.`)
    
    // במידה ויש אובייקט כזה אנו נחזיר אותו
    return product
}




//CategoryModel פונ אשר מחזירה את כל האובייקטים הנמצאים בקולקשין שבתוך המודל 
async function getAllCate(): Promise<ICateModel[]> {
    return CateModel.find().exec()
}





//פונ אשר מוסיפה מוצר
//מקבלים אובייקט במודל "פרודקט" ועושים עליו ולידציה
async function addCate(cate: ICateModel): Promise<ICateModel> {
    console.log("cate in addCate: " , cate);
    
    return cate.save()
}






export default {
    getOneProduct,
    getAllCate,
    addCate
}