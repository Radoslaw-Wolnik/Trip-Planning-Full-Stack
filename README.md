# React + TypeScript + Vite
------------------------------------------------- AUTO GEN -------------------------------------------------


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list


------------------------------------------------- SETUP -------------------------------------------------


PS C:\Users\rados\Github\blog> npm create vite@latest blog --template react-ts
Need to install the following packages:
create-vite@5.2.3
Ok to proceed? (y) y


> npx
> create-vite blog react-ts

√ Select a framework: » React
√ Select a variant: » TypeScript + SWC

Scaffolding project in C:\Users\rados\Github\blog\blog...

Done. Now run:

  cd blog
  npm install
  npm run dev

PS C:\Users\rados\Github\blog>


Insted of stinky old npm create-react-app we will use Vite (fancy)
React + Typescript (Javascript with types) + SWC - compiler for javascript to make it more efficient

install ESLint extention to VSCode to make necessary highlights to syntax
also some folks dont use TypeScript insted they use Prettier: 
alterations to do so:
> npm rm @types/react @types/react-dom   #- removes typescript
> npm i -D -E prettier #- install prettier
> create file .prettierrc and paste following: 
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
> npm i -D eslint-config-prettier
> package.json  # change
"format": "prettier --write ./src",

install Prettier plugin for VS Code.

entire tutorial: 
https://medium.com/@nedopaka/setup-a-react-vite-project-with-swc-prettier-vitest-2024-62ecff357c7b
but we're not doing that here

------------------------------------------------- PROJECT -------------------------------------------------


> npm run dev
to start development server on https://localhost:5173/

------------------------------------------------- LINKS -------------------------------------------------
https://www.youtube.com/watch?v=SLfhMt5OUPI - navbar + footer proper way
https://www.youtube.com/watch?v=Vv36C02RMlY - javascrit grocery store project GeeksForGeeks
https://www.youtube.com/watch?v=pfaSUYaSgRo - Taiwind CSS tutorial
https://www.youtube.com/watch?v=F2JCjVSZlG0&list=PL41PQx5PPbt6OheJQkg-QNROfx9j75MuR
https://www.youtube.com/watch?v=sfmL6bGbiN8&list=PL41PQx5PPbt6OheJQkg-QNROfx9j75MuR&index=2
https://www.youtube.com/watch?v=L02BfvA7mgA&list=PL41PQx5PPbt6OheJQkg-QNROfx9j75MuR&index=4


----- navbar
https://www.geeksforgeeks.org/how-to-create-a-simple-responsive-footer-in-react-js/
https://devzibah.hashnode.dev/how-to-avoid-redundancy-through-the-use-of-layout-components-in-react
https://dev.to/dindustack/hide-show-navbar-and-footer-in-react-application-1nip
https://blog.logrocket.com/create-responsive-navbar-react-css/



-----
docker-compose up --build
docker run -p 3000:3000 frontend-app
docker build -t frontend-app .

for development:
docker-compose -f docker-compose.yml up --build
docker-compose up --build

for production:
docker-compose -f docker-compose.prod.yml up --build


Structure:
my-fullstack-app/
├── backend/
│   ├── Dockerfile            # Docker file for backend
│   ├── package.json          # packages
│   ├── package-lock.json
│   ├── .env                    # Environment variables for backend
│   ├── Dockerfile
│   ├── init-mongo.js
│   ├── populateDB.js
│   ├── node_modules/
│   │   ├── ...
│   │   └── ...
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── bin/
│   │   │   └── www.js.reference
│   │   ├── config/
│   │   │   ├── enviorement.js
│   │   │   └── databse.js
│   │   ├── controllers/
│   │   │   └── userController.js
│   │   ├── public/
│   │   │   ├── images/
│   │   │   ├── javascripts/
│   │   │   └── stylesheets/
│   │   │       └── style.css
│   │   ├── middleware
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── api/
│   │   │   │   └── index.js    # API routes
│   │   │   ├── userRouts.js
│   │   │   └── roadtipRoutes.js
│   │   ├── models/             # Database models (if using an ORM)
│   │   │   ├── Roadtrip.js
│   │   │   └── User.js
│   │   └── views/
│   │       ├── error.pug
│   │       ├── index.pug
│   │       └── layout.pug
│   └── README.md
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── index.html
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
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
│   │   ├── App.js              # Main component
│   │   ├── main.tsx            
│   │   ├── assets/             # website assets - can be in public
│   │   │   ├── ...
│   │   │   └── buy.json
│   │   ├── components/         # React components
│   │   │   ├── ...
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Product.tsx
│   │   │   ├── RecoveryPasswordForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   ├── context/
│   │   │   ├── ...
│   │   │   └── ModalContext.tsx           
│   │   ├── hooks/
│   │   │   ├── ...
│   │   │   └── useModal.ts           
│   │   ├── layouts/
│   │   │   └── LandingPageLayout.tsx           
│   │   ├── pages/
│   │   │   ├── ...
│   │   │   ├── About.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Settings.tsx
│   │   │   ├── Friends.tsx
│   │   │   ├── MainFunction.tsx
│   │   │   └── Home.tsx            
│   │   ├── services/
│   │   │   └── apiService.ts          
│   │   ├── styles/             # CSS or SCSS styles
│   │   ├── utils/
│   │   │   └── helpers.ts
│   │   └── vite-env.d.ts       # vite enviorement settings
│   └── README.md
├── .dockerignore               # global docker ignore 
├── .gitgnore                   # global git ignore
├── docker-compose-prod.yml     # docker compose for production
├── docker-compose.yml          # docker compose for development
├── .env
└── README.md



frontend - client
backend - server

prev database postgress:
    environment:
      - DB_HOST=website1-db
      - DB_USER=user1
      - DB_PASS=password1
      - DB_NAME=db1

db:
    image: postgres:latest
    environment:
      POSTGRES_USER: user1
      POSTGRES_PASSWORD: password1
      POSTGRES_DB: db1
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:


Check for potential caching issues:
Docker can sometimes cache layers, which might lead to outdated dependencies. Try rebuilding your images from scratch:
> docker-compose down -v             # removes all volumes
> docker-compose build --no-cache    # build without cache
> docker-compose up --force-recreate # force recreate

> docker-compose exec backend sh
> docker-compose up --build


Starting with MongoDB 4.4, the mongo shell has been replaced by mongosh. If you have MongoDB Shell installed, you should use mongosh instead of mongo.
> mongosh --host localhost --port 27017 -u myuser -p mypassword --authenticationDatabase mydatabase


monodb populateDB.js:
1. Ensure your MongoDB and backend services are running:
2. run in new console [I]:
> docker-compose exec backend node seed.js

To check if it was succesfull:
docker-compose exec mongo mongosh -u <your_username> -p <your_password>
use <your_database_name>
db.users.find()
db.roadtrips.find()

Also to make it esier i can add to scripts in package.json:
"populate": "node populateDB.js"
and run:
> docker-compose exec backend npm run populate