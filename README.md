# TP_IASC

## Insctructions to run the app

1. Create an `environments` folder.
2. Create your `.env` files:
   1. `.env.app` expects the following vars:
       - MONGO_USERNAME=some_username
       - MONGO_PASSWORD=some_pass
       - MONGO_PORT=27017
       - MONGO_SERVICE_URL=db
       - MONGO_DB_NAME=test
       - PORT=8080
       - DB_CONNECTION_TIMEOUT=120000
       - TOKEN_TTL=10m
       - TOKEN_SECRET=some_secret
   2. `.env.db` expects the following vars:
        - MONGO_USERNAME=some_username
        - MONGO_PASSWORD=some_pass
        - MONGO_PORT=27017
        - MONGO_DB_NAME=test
3. Run `docker compose up`.
