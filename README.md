
# Omdb_API

## Previous requirements

- install typescript globally `npm install -g typescript`.
- Run `npm i`
- Create database in MYSQL `CREATE DATABASE omdb_api;`
- Modify credentials in ormconfig.json file
- Run `npm run build`
- Run `npm run start`


## example curl

`curl --location --request GET 'localhost:3000/movies/search?name=her&year=2000&page=1'`