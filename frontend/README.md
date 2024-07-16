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



----- Docker things ---- 
docker-compose up --build
docker run -p 3000:3000 frontend-app
docker build -t frontend-app .

---- runs
npm run dev
npm start
When you run npm run dev locally for your frontend:

    Development Environment: It uses the development server provided by react-scripts or any custom setup you have configured. This includes hot reloading and other development tools.

    Isolation: It runs the frontend development server independently of any backend services unless your frontend makes API calls to a backend that's also running locally or in another environment.

    If you're trying to run a development server for your frontend application using npm scripts, the command you typically use is npm run dev or npm start depending on how it's configured in your package.json file.
Running npm run dev for Frontend

Assuming you're inside the frontend directory of your project structure (main_folder/frontend), here's what you can do:

    Navigate to the frontend directory:

    Open your terminal or command prompt and change directory to your frontend directory:

    sh

cd path/to/main_folder/frontend

Run the development server:

Use npm run dev or npm start, depending on how your package.json is configured:

sh

npm run dev

or

sh

    npm start

        If you've configured npm run dev or npm start correctly in your package.json, this command will start the development server for your React application.

    Accessing Your Application:

    Once the development server starts, you can access your frontend application in a web browser:
        Open a browser and go to http://localhost:3000 (assuming your React app runs on port 3000 by default).

Differences from Docker Compose

When you run npm run dev locally for your frontend:

    Development Environment: It uses the development server provided by react-scripts or any custom setup you have configured. This includes hot reloading and other development tools.

    Isolation: It runs the frontend development server independently of any backend services unless your frontend makes API calls to a backend that's also running locally or in another environment.

Integrating with Docker Compose

If you choose to run your frontend and backend services using Docker Compose (as previously discussed), you'll run the entire application stack (frontend, backend, and any other services) within Docker containers. This provides a more consistent and reproducible environment across different machines and deployments.

Local Development: Running npm run dev or npm start locally in your frontend directory starts the development server for your React application.

Docker Compose: Docker Compose orchestrates multiple containers (e.g., frontend, backend, database) together, providing a unified environment for development, testing, and deployment.

docker-compose up --build
docker-compose down

Frontend: Open a web browser and go to http://localhost:3000 to see your React frontend.
Backend: If your frontend makes API calls to the backend, ensure it uses http://backend:5001 (assuming backend is the service name defined in docker-compose.yml).


Also !!
Yes, before deploying your frontend application using Docker, it's generally a good practice to create a production build of your application using 
npm run build