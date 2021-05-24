module.exports = {
    "type": "sqlite",
    "database": process.env.DATABASE_URL,
    "synchronize": true,
    "logging": false,
    "entities": [
       "src/database/entity/**/*.ts"
    ],
    "migrations": [
       "src/database/migration/**/*.ts"
    ],
    "subscribers": [
       "src/database/subscriber/**/*.ts"
    ],
    "cli": {
       "entitiesDir": "src/database/entity",
       "migrationsDir": "src/database/migration",
       "subscribersDir": "src/database/subscriber"
    }
}