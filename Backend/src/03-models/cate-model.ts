import { Document, model, Schema } from "mongoose";

export interface ICateModel extends Document {
    arr: [];
}

//סכמת ולידציה
const CateSchema = new Schema<ICateModel>({

}, {

    //versionKey: false, // Don't create __v field for versioning
    //מייצר שדה גירסה בדאטה בייס
    versionKey: false
})


export const CateModel = model<ICateModel>('CateModel', CateSchema, 'cate')