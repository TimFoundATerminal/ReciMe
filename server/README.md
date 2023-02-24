# Backend REST API

## What is this?
This is a REST API created using expressjs and sqlite. You send it HTTP requests and it stores, updates or gets data from the sqlite db.
Essentially it is just an interface for using the database. 

## Setup
Make sure you are in the `server` directory. Otherwise `cd server`

#### Install dependecies
`npm i`

Copy `db-blank.sqlite` and rename it to `db.sqlite` 

This is a blank database with the correct scheme setup. Do not delete `db-blank.sqlite` as others will need this in bitbucket to run this setup. 

#### Start the server

`node app.js`

This will start the server at `localhost:3000` or `127.0.0.1:3000`. Try `localhost:3000` in your browser and you should see `Cannot GET /`.

#### Open the documentation
Navigate to `localhost:3000/docs`

This contains documentation for all the endpoints and schema. This should be all you need to use this API. Note `/api` before all endpoints. 

#### Note on localhost with external device
Since `localhost` is local to the device it will not work on an external device. There are Two solutions to this. 
1. Use a virtual device on your local machine
2. Find your ip using `ipconfig` (win) or `ifconfig` (mac/linux). Use this ip instead of `localhost`. e.g. if my ip is `192.168.0.69` this api url will be`192.168.0.69:3000/api` 