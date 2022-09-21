import dotenv from 'dotenv'
class Config {

}

class DevelopmentConfig extends Config {
    isDevelopment = true
    logFile = 'logger.log'
    connectionString = "mongodb://localhost:27017/test"
}

class ProductionConfig extends Config {
    isDevelopment = false
    logFile = 'logger.log'
    // connectionString = process.env.MONGODB_URI
    // test כך אנו מקשרים אתהבק שלנו לדאטה בייס בשם  
    connectionString = "mongodb://localhost:27017/test"
}

const config = process.env.NODE_ENV === 'production' ? new ProductionConfig() : new DevelopmentConfig()
export default config