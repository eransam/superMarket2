import cyber from '../02-middleware/cyber';
import ErrorModel from '../03-models/error-model';
import { ICredentialsModel } from './../03-models/credentials-model';
import { IUserModel, UserModel } from './../03-models/user-model';

//עם משתמשים קיימים בעת הרשמה של משתמש חדש socialSecurityNumber ו username פונ אשר בודקת כפילות של 
async function checkValidEmailAndSSN(user: IUserModel): Promise<boolean> {

    //כאשר משתמש רוצה להרשם אנו בודקים כך האם קיים עוד יוזר עם שם משתמש זהה במערכת 
    //existsUsername ובמידה ויש אנו נכניס אותו לתוך המשתנה 
    const existsUsername = await UserModel.findOne({ username: user.username }).exec()

    //בפונקציה זו false במידה וקיים משתמש עם אותו שם משתמש אנו נחזיר את הערך 
    if (existsUsername) 

    return false

    //שלו socialSecurityNumber סמידה ולא קיים יוזר עם שם משתמש זהה אנו נמשיך בהרשמה ונצפין את הפרופרטי 
    const hashedSocialtoCheck = cyber.hash(user.socialSecurityNumber)

    // socialSecurityNumber ולאחר מכן אנו נעשה עוד בדיקה האם קיים עוד יוזר עם אותו ערך של הפרופרטי 
    //false ובמידה וקיים אנו נחזיר 
    const existsSocialSecurityNumber = await UserModel.findOne({ socialSecurityNumber: hashedSocialtoCheck }).exec()
    if (existsSocialSecurityNumber)
     return false

    //זהה ליוזר אחר הקיים במערך פונקציה זו  socialSecurityNumber ובמידה ולא קיים שם משתמש ו
    //true תחזיר 
    return true
}






//פונקציה אשר מבצעת הרשמה בכך שמקבלת אובייקט יוזר חדש, מבצעת את כל הולידציות, שומרת אותו בדאטה בייס ומחזירה טוקן 
async function register(user: IUserModel): Promise<string> {

    //על אובייקט היוזר הנכנס IUserModelכך אנו מפעילים את הולידציות אשר קבענו בתוך המודל בקובץ ה
    const errors = user.validateSync()

    //במידה ויש שגיאות ולידציה אנו נזרוק שגיאות כך
    if (errors) throw new ErrorModel(400, errors.message)

    // כאן אנו בודקים האם כבר קיים משתמש במערכת עם שם משתמש זהה כדי שלא יהיו כפילויות
    const existsUsername = await UserModel.findOne({ username: user.username }).exec()
    if (existsUsername) throw new ErrorModel(400, `Username ${user.username} is already taken. Please make sure that you are not registered already or please choose a different username`)

    //וגם בודקים האם קיים עוד ערך זזה במערכת כדי שלא יהיו כפילויות socialSecurityNumber כאן אנו מצפינים את הפרופרטי 
    const hashedSocialtoCheck = cyber.hash(user.socialSecurityNumber)
    const existsSocialSecurityNumber = await UserModel.findOne({ socialSecurityNumber: hashedSocialtoCheck }).exec()
    if (existsSocialSecurityNumber) throw new ErrorModel(400, `Social Security Number you have entered already exists. Please make sure that you are not registered already or please try again`)

    //שהוכנס ע''י המשתמש החדש password כאן אנו מצפינים את הפרופרטי 
    user.password = cyber.hash(user.password)

    //ומחזירים אותו מוצפן כערך לאותו פרופרטי socialSecurityNumber כאן אנו מצפינים את הערך הנמצא תחת הפרופרטי 
    user.socialSecurityNumber = cyber.hash(user.socialSecurityNumber)

    //כך אנו שומרים את היוזר החדש במידה ועבר את כל הולידציות בדאטה בייס שלנו בעזרת הפקודה 
    //.save() המובנת 
    await user.save()

    //בשל אבטחת המידע אנו לא נראה שפרטים רגישים יהיו בתוך הטוקן שניצור אז לפני יצירת הטוקן אנו נמחק את פרטים אלו מהאובייקט 
    //ורק אז ניצור טוקן
    //*אין צורך לדאוג ממחיקת ערכי הפרופרטי האלו מכיוון שכבר הוכנסו לדאטה בייס*
    user.password = undefined
    user.socialSecurityNumber = undefined

    //כך ניצור טוקן אשר מורכב מפרטי היוזר החדש
    const token = cyber.getNewToken(user)

    //וכך נחזיר את הטוקן שיצרנו 
    return token

}

//login פונ' אשר מבצעת כניסת 
async function login(credentials: ICredentialsModel): Promise<string> {

    //ICredentialsModel אשר בתוכו יצרנו את  credentials-model כאן אנו נבצע על הפרמטר את הולידציות אשר רשמנו בקובץ ה 
    const errors = credentials.validateSync()
    if (errors) throw new ErrorModel(400, errors.message)

    //password כך אנו נשנה ונצפין את הערך שהוכנס בתוך הפרופרטי 
    credentials.password = cyber.hash(credentials.password)

    //אנו נכסים לתוך המשתנה יותר את האובייקט מהדאטה בייס עם הנתונים התואמים find בעזרת הפקודה השמורה 
    //אנו נרשום את האובייקט  find מטעמי אבטחה אנו לא נרצה לחשוף שוב את הפרופרטיז הרגישים אז בארגונט השני של הפונקציה 
    // שזה בעצם אומר שכל פרופרטי שנשווה אותו ל0 לא יוצג שזה בעצם כמו פעולה המחיקה { password: 0, socialSecurityNumber: 0 }
    const users = await UserModel.find({ username: credentials.username, password: credentials.password }, { password: 0, socialSecurityNumber: 0 }).exec()
    
    //כדי לחלץ את המידע ממערך users[0] מחזירה את הערך כמערך ולכן כאשר אנו נרצה לחלץ את הערכים אנו נכניס למשתנה שלנו את הערך כך findפונ ה
    const user = users[0]

    //אם לא קיים יוזר כזה אנו נזרוק שגיאה
    if (!user) throw new ErrorModel(401, `Incorrect username or password`)

    //וכך בעצם אנו נייצר עוד תוקן עם פרטי היוזר ללא הפרופרטיז הרגישים
    const token = cyber.getNewToken(user)

    //וכך הפונ' תחזיר להו טוקן במידה ויוזר יעשה לוגין
    return token

}

export default {
    register,
    login,
    checkValidEmailAndSSN
}