# Full stack aplication for trip managing website
*This is a learning project mostly in backend and docker but also in frontend and connecting services*  
*For more in depth info go to [backend](backend/README_backend.md) or [frontend](frontend/README_frontend.md)*

# Table of Contents

- [Introduction](#Introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Services](#services)
- [Structure](#structure)  
####
- [Todo](#todo)
- [Contributing](#contributing)
- [License](#license)

## Introduction
*The main focus of this project is learning but also reusability and readibility*
#### MAIN FUNCTIONS:
 - creatign trips with places on different days and sharing them
 - creating accounts
 - colaborating with others
#### NECESSARY:
 - user registration + email verification (email sending)
 - forgotten password (email)
 - session tracking using JWS tokens
 - user things (change profile picture, change password)
 - trip things (create, delete, invite to edit, share view only, add place, delete place, change the order of places)
 - real time editing of trips using socket.io by multiple users at the same time
 - backend <-> frontend connection
 - backend <-> socketio connection (helped by redis)
 - backend <-> mongoDB connection
 - google maps ofc (btw dont use Marker in stric mode insted use MarkerF)

## Installation
``` bash
git clone https://github.com/Radoslaw-Wolnik/Trip-Planning-Full-Stack.git Trip-Planning
cd Trip-Planning/backend
npm install
cd ../frontend
npm install
```

## Usage
<details>
<summary>

#### setting env variables:
</summary>

``` bash
# /main-dir/.env:
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=rootpassword
MONGO_INITDB_DATABASE=mydatabase
MONGO_INITDB_USER=myuser
MONGO_INITDB_PASSWORD=mypassword

# /main-dir/frontend/.env:
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key

# /main-dir/backend/.env.development:
DB_HOST=mongo:27017
DB_NAME=mydatabase
DB_USER=myuser
DB_PASS=mypassword

JWT_SECRET=mysecret
PORT=5000
FRONTEND=http://localhost:5173
SOCKET_URL=http://socketio:5001
REDIS_URL=redis://redis:6379

EMAIL_HOST=service-stmp-link
EMAIL_PORT=service-port
EMAIL_USER=your_service_username
EMAIL_PASS=your_secret_key
EMAIL_FROM=verified_email
```
</details>

#### docker-compose
```bash
cd Trip-Planning
docker-compose up --build
docker-compose exec backend node seed.js
```

#### if in trouble, purge and restart  
mostly if some modules are not installed by docker but they are in your package-lock.json
```bash
docker-compose down -v             # removes all volumes
docker-compose build --no-cache    # build without cache
docker-compose up --force-recreate # force recreate
```

#### downscaling
if one wants to use project without email verification one needs to comment out  
/main-dir/backend/src/userController
login: to not check if verified email in db
register: to not send an email

## Technologies Used:
 - **Bakcend:** Node.js + express + ES6 modules
 - **Frontend:** Vite(React) + Typescript

## Docker Containers:
 - **redis** - for better communication between containers (rn socketio and backend)
 - **mongoDB** - database curren schemas User, Trip and ExpiredTokens
 - **socketio** - the realtime communication, could be part of backend but for practice it's not
 - **backend** - server
 - **frontend** - client

<details>
<summary>

## Structure:
</summary>

```bash
  main dir/
  ├── backend/
  │   ├── node_modules/
  │   │   ├── ...
  │   │   └── ...
  │   ├── src/
  │   │   ├── app.js
  │   │   ├── server.js
  │   │   ├── ...
  │   │   └── ...
  │   ├── uploads/
  │   │   ├── ...
  │   │   └── ...
  │   ├── .env.development
  │   ├── .env.production
  │   ├── Dockerfile
  │   ├── Dockerfile.socketio
  │   ├── init-mongo.js
  │   ├── nodemon.json
  │   ├── package-lock.json
  │   ├── package.json
  │   ├── populateDB.js
  │   └── README_backend.md
  ├── frontend/
  │   ├── build/
  │   │   ├── ...
  │   │   └── ...
  │   ├── node_modules/
  │   │   ├── ...
  │   │   └── ...
  │   ├── public/
  │   │   ├── index.html - should be here but its not
  │   │   └── ...
  │   ├── src/
  │   │   ├── index.css
  │   │   ├── App.js
  │   │   ├── main.tsx            
  │   │   ├── ...
  │   │   └── ...
  │   ├── .eslintrc.js
  │   ├── Dockerfile
  │   ├── index.html
  │   ├── package-lock.json
  │   ├── package.json
  │   ├── tsconfig.json
  │   ├── tsconfig.node.json
  │   ├── vite.config.ts
  │   └── README_frontend.md
  ├── .dockerignore
  ├── .env
  ├── .gitgnore
  ├── docker-compose-prod.yml
  ├── docker-compose.yml
  └── README.md
  ```

  ### Key takes:
  - each component have its own Dockerfile: /backend/Dockerfile and /backend/Dockerfile.socketio and /frontend/Dockerfile
  - docker-compose: creates services, currentyly: redis, mongoDB, socketio, backend, frontend
  - nodemon track changes in files for dev purposes (package.json)
  - global gitgnore and dockerignore must have
  - the env files that currently are not best structured but should be: /backend/.env and /frontend/.env and /.env for docker-compose.yml
  - to see the .env contest go to /backend/src/config/enviorement.js, same for frontend, the only one not visible is /.env and idk if it should
  - for more in depth explonation go to /frontend/README or /backend/README
</details>

------------------------------------
## Contributing
lorem ipsum

## Licence
lorem ipsum

## TODO:
- [ ] deployment
- [x] main readme
- [ ] readme frontend
- [ ] readme backend
- [ ] check .env in frontend
- [ ] forgotten password page (one time magic link to change pass)
- [ ] https insted of http i gues security and cryptography lol

## Special Thanks:
 - **claude.ai** - by Anthropic - much better at explaining code then my uni profs
 - **brevo** - for free tier of 200 emails/day
 - **yt** - ofc

