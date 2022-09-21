import { NextFunction, Request, Response } from "express";
import ErrorModel from "../03-models/error-model";
import RoleEnum from "../03-models/role-enum";
import cyber from "./cyber";

//פונקציה אשר בודקת האם היוזר הוא אדמין
async function verifyAdmin(request: Request, response: Response, next: NextFunction): Promise<void> {

  //authorization תחת המפתח  request.header כאן אנו נבקש רת הטוקן מה
  const authorizationHeader = request.header('authorization')
  
  //cyber.verifyToken כאן אנו נבדוק האם התוקן שלנו תקין בעזרת הפונקציה 
  const isValid = await cyber.verifyToken(authorizationHeader)

  if (!isValid) {

    //אשר מנתבת את כל הודעות השגיא הלמקום אחד  next במידה והטוקן שלנו לא תקין אנו נשלח הודעת שגיאה דרך הפקודה 
    //error-handler.ts אשר קבענו מראש בקובץ ה 
    next(new ErrorModel(401, 'You are not logged in'))
    return
  }

  //cyber.getUserFromToken כך אנו נחלץ את כל פרטי היוזר מהטוקן שלנו בעזרת הפונקציה 
  const user = cyber.getUserFromToken(authorizationHeader)

  //של היוזר שלנו ונבדוק האם הוא אדמין ובמידה ולא אנו נזרוק שגיאה  role כאן אנו ניגש לפרופרטי 
  if (user.role !== RoleEnum.Admin) {
    next(new ErrorModel(403, `Forbidden: You are not authorized`))
    return
  }

  next()
}

export default verifyAdmin