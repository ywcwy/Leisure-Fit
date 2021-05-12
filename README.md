# Leisure-Fit
let Leisure-Fit be your training log!


## Features
* register or login via Line
* record your each training
* enroll/cancel training course 
* collect any training-relative article you like 
* get the training location/schedule
* use Line Bot to get the the website and do all the features mentioned above
* use Line Bot to get the training location/schedule by keyword 

## Environment
* Node.js

## Packages
* express
* express-handlebars
* method-override
* body-parser
* express-session
* passport
* passport-line
* passport-jwt
* passport-local
* jsonwebtoken
* connect-flash
* bcryptjs
* dotenv
* imgur
* multer
* moment
* @line/bot-sdk
* linebot
* mysql2
* sequelize
* sequelize-cli

## Database
* MySQL 

## Install (for Mac OS user)
### 1. Open Terminal

### 2. Project Download
```
$git clone https://github.com/ywcwy/Leisure-Fit.git
```
After download, 
```
$cd leisure-fit     // to install the following Packages under this directory
```
### 3. npm Installation
```
$npm init -y     // create and initialize package.json directory
```
### 4. Package Installation
```
$npm install     // install all the Packages
```
### 5. Connect to the Database & create Models & Seeders
```
$npx sequelize db:migrate      // create Models
$npx sequelize db:seed:all     // create Seeders
```

### 6. Project Implement
```
$npm run dev   
```
### 7. Project Start 
```
Express is listening on localhost:3000     // if start working, termianl will show this message
```
### 8. Go to the page "localhost:3000"
