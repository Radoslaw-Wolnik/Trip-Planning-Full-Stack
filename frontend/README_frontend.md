# Frontend documentation

## Introduction
*This is frontend for trip managing website*  
*Go to [main README](../README.md) for more general information*  


#### FUNCTIONS
 - connect to the backend (api)
 - session tracking (Auth)
 - user login/logout/registration
 - list of trips (users and shared)
 - profile page (with profile picture, user created trips, change password)
 - detail trip page with edit mode and possibility to colaborate real time and sharing link (view only) and inviting to edit for other users in service
 - login/logout/others modal that is on top of any page
 - protected pages that when accessed without credentials will show login/register modal
 - home/about
 - see shared trip (view only)
 - header with navbar and footer and inside any page that is accessed


#### DISCLAIMER  
default build for vite is saved in diff folder then build - change in vite.config.ts

#### additional for dev
in react strict mode dont use Marker insted use MarkerF 

## Technologies Used:
 - **Framework:** React
 - **Language:** TypeScript
 - **Build Tool:** Vite
 - **Compiler:** SWC
 - **Linter:** ESLint

## Docker containers:
 - **frontend** - client

<details>
<summary><h2>Structure:</h2></summary>

```bash
my-fullstack-app/
├── backend/
│   ├── Dockerfile
│   ├── Dockerfile.socketio
│   └── ...
├── frontend/
│   ├── .env
│   ├── .eslintrc.cjs
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README_frontend
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
│   │   ├── index.html         # should be here but its not
│   │   └── ...
│   └─── src/
│       ├── App.js
│       ├── index.css
│       ├── main.tsx
│       ├── types.ts
│       ├── vite-env.d.ts
│       ├── assets/             # website assets - can be in public
│       │   ├── ...
│       │   └── buy.json
│       ├── components/
│       │   ├── CreateTripForm.tsx
│       │   ├── Footer.tsx
│       │   ├── Header.tsx
│       │   ├── LoginForm.tsx
│       │   ├── Map.tsx
│       │   ├── Modal.tsx
│       │   ├── Product.tsx
│       │   ├── ProtectedRoute.tsx
│       │   ├── RecoveryPasswordForm.tsx
│       │   ├── ShareTrip.tsx
│       │   ├── SingUpForm.tsx
│       │   └── TripList.tsx
│       ├── config/
│       │   └── enviorement.ts
│       ├── context/
│       │   ├── AuthContext.tsx
│       │   ├── TripContext.tsx  # delete
│       │   └── ModalContext.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   └── useModal.ts           
│       ├── layouts/
│       │   └── LandingPageLayout.tsx           
│       ├── pages/
│       │   ├── About.tsx
│       │   ├── Home.tsx
│       │   ├── MainFunction.tsx
│       │   ├── Profile.tsx
│       │   ├── SharedTripView.tsx
│       │   ├── TripDetail.tsx
│       │   ├── TripListPage.tsx
│       │   └── VerifyEmail.tsx            
│       ├── services/
│       │   └── api.ts          
│       ├── style/              # there is not much, it will be all changed
│       │   ├── ...
│       │   ├── All.css
│       │   ├── Fototer.css
│       │   └── Modal.css 
│       └── utils/
│           └── imageUtils.ts
├── docker-compose.yml
└── ...
```

#### Key takes:
 - 
 - 
 - 
</details>

## TODO 
 - [ ] check the enviorement variables and idk if use process.sth... or import envioremnt and envioremnet.sth (will use scnd one)
 - [ ] recover acc - forgotten password page (one time magic link to change pass)
####
 - [ ] when adding poin i dont want to just click on map i want to see things first (from google map you can click and it pops with details about place that you can check, photos etc i want that when clicking on map) and then an add button that adds to the list
 - [ ] more defined day up over the map to change day that yure adding to place
 - [ ] add function to drag place up in the list or down and it should properly change the number
 - [ ] after deleting place change the order of other places (decrement numbers)
####
 - [ ] Tailwind CSS make the site prettier  (or Saas)


## Additional info for future mby important not sure
Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

#### Expanding the ESLint configuration

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

----- Docker things ---- 
docker-compose up --build
docker run -p 3000:3000 frontend-app
docker build -t frontend-app .