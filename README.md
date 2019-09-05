# XenCRUD

Before start dont forget to create file `.env` and add this config:
```
MONGO_DB_CONNECTION='mongodb://admin:admin54321@ds151012.mlab.com:51012/xencrud'
USER_SECRET='1234567890!@#$%^&*()qwertyuiioplkjhgfdsaZXCVBNM<>?'
PORT='3000'
```
  
Install the dependencies and devDependencies and start the server.
```
$ npm install
$ npm start
```

Running test scenario.
```
$ npm test
```

## Endpoints

Health check route:

Route | Method | Description
----- | ---- | -----------
http://localhost:3000/ | - | for check server connection

List of organization routes:

Route | HTTP | Description
----- | ---- | -----------
(*)/orgs/:orgName/comments | POST | post organization comment base on organization name in the parameter
(*)/orgs/:orgName/comments | GET | get all organization comment base on organization name in the parameter
(**)/orgs/:orgName/comments | DELETE | soft delete all organization comment base on organization name in the parameter

List of member routes:

Route | HTTP | Description
----- | ---- | -----------
/signUp | POST | sign up and create new account as member
/signIn | POST | sign in to system
/signOut | POST | sign out from system
(**)/orgs/:orgName/members/ | GET | Get all member data base on organization name in the parameter

### note:
(*) you need to add token in header so you have to login first to get the access token.
- example: `"token": <token string>`

(**) you need to add token in header so you have to login first to get the access token and you need to sign in or sign up you member account as admin (by default you will sign up as user)
```
example sign up as user
{
    "username" : "boy",
    "email": "boy@mail.com",
    "password": "myname94",
    "organization": "xendit"
}

example sign up as admin
{
    "role": "admin",
    "username" : "boy",
    "email": "boy@mail.com",
    "password": "myname94",
    "organization": "xendit"
}
```

API result and detail: `https://documenter.getpostman.com/view/6609718/SVfUt72x?version=latest#38f86ac8-8117-4684-aac5-dda88720b3a7`