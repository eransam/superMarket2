import { Document, model, Schema } from "mongoose";


//אינטרפייס עם שדות
export interface ICredentialsModel extends Document {

    username: string
    password: string

}

//שכמת ולידציה
const CredentialsSchema = new Schema<ICredentialsModel>({

    username: {
        type: String,
        unique: true,
        required: [true, "Missing username"],
        minlength: [2, "Username too short"],
        maxlength: [100, "Username too long"],

        //מוחק רווחים לא רצויים וכאלה
        trim: true,

        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "You have entered an invalid email address"]
    },
    password: {
        type: String,
        required: [true, "Missing password"],
        minlength: [2, "Password too short"],
        maxlength: [100, "Password too long"],
        trim: true,
    }
}, {

    //מייצר שדה גירסה בדאטה בייס
    versionKey: false,
})


//cart-item-model הסבר ב 
export const CredentialsModel = model<ICredentialsModel>('CredentialsModel', CredentialsSchema, 'users')