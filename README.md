# Full stack aplication for trip managing website
*This is a learning project mostly in backend and docker but also in frontend and connecting services*
# Overview

## Stack:
 - **Bakcend:** Node.js + express + esp6 modules
 - **Frontend:** Vite(React) + Typescript

## The services:
 - **redis** - for better communication between containers (rn socketio and backend)
 - **mongoDB** - database curren schemas User, Trip and ExpiredTokens
 - **socketio** - the realtime communication, could be part of backend but for practice it's not
 - **backend**
 - **frontend**

<details>

<summary><h2>Structure:</h2></summary>

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


## Features
*The functions were implemented focused mostly on reusability, readibility and good pracitses - one file - one resposibility*
 - **MAIN FUNCTION:** creatign trips with places on different days and sharing them
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

## Special Thanks:
 - **claude.ai** - by Anthropic - much better at explaining code then my uni profs
 - **yt** - ofc
 - **brevo** - for free tier of 200 emails/day

## TODO:

- [ ] deployment
- [ ] readme frontend
- [ ] readme backend
- [ ] check .env in frontend
- [ ] forgotten password page (one time magic link to change pass)

