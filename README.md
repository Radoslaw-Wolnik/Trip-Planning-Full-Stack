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