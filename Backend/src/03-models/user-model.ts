import { Document, model, Schema } from "mongoose";
import CityEnum from "./city-enum";
import RoleEnum from "./role-enum";

//אינטר פייס ושדות המודל
export interface IUserModel extends Document {
    firstName: string
    lastName: string
    username: string
    password: string
    socialSecurityNumber: string
    street: string
    //שדות מטייפ שאנו יצרנו באופן עצמאי
    city: CityEnum  
    role: RoleEnum  
}

//סכמת ולידציה
const UserSchema = new Schema<IUserModel>({
    firstName: {

        //סוג השדה
        type: String,
        
        //שדה חובה
        required: [true, "Missing  first name"],
        minlength: [2, "First name too short"],
        maxlength: [100, "First name too long"],
        
        //מונע רווחים ותווים מיותרים
        trim: true,

    },
    lastName: {
        type: String,
        required: [true, "Missing last name"],
        minlength: [2, "Last name too short"],
        maxlength: [100, "Last name too long"],
        //מונע רווחים ותווים מיותרים
        trim: true,

    },
    username: {
        type: String,
        required: [true, "Missing username"],
        minlength: [2, "Username too short"],
        maxlength: [100, "Username too long"],
        
        //מונע רווחים ותווים מיותרים
        trim: true,

        //מכילה תבנית רגקס אשר שדה זה יהיה חייב לעמוד באותה תבנית match הפקודה 
        match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, "You have entered an invalid email address"]
    },
    password: {
        type: String,
        required: [true, "Missing password"],
        minlength: [2, "Password too short"],
        maxlength: [128, "Password too long"],
 
        //מונע רווחים ותווים מיותרים
        trim: true
    },
    socialSecurityNumber: {
        type: String,
        required: [true, "Missing SSN"],
        minlength: [11, "SSN too short"],
        maxlength: [128, "SSN too long"],
        
        //מונע רווחים ותווים מיותרים
        trim: true,
        //פקודה זו גורמת לערך המוזן בשדה זה להיות ייחודי בדאטה בייס
        //זאת אומרת שלא יוכל להיות אובייקט אחר עם שם זהה לשם אובייקט שכבר קיים במערכת 
        unique: true
    },
    street: {
        type: String,
        required: [true, "Missing street"],
        minlength: [2, "Street too short"],
        maxlength: [100, "Street too long"],
        trim: true,
    },
    city: {
        type: String,
        required: [true, "Missing city"],
        enum: CityEnum,
        minlength: [2, "City too short"],
        maxlength: [100, "City too long"],
    },
    role: {
        type: Number,
        required: [true, "Missing role"],
        enum: RoleEnum,

        //RoleEnum.User כך שדה זה יקבל באופן דיפולטיבי את הערך הנמצא תחת 
        //הוא הטייפ אותו יצרנו באופן ידני RoleEnum ה 
        default: RoleEnum.User,
        min: [0, "Role can't be negative"],
        max: [1, "Role can't exceed 1"]
    }
}, {

    //מייצר שדה גירסה בדאטה בייס
    versionKey: false,
})


//cart-item-model הסבר ב 
export const UserModel = model<IUserModel>('UserModel', UserSchema, 'users')