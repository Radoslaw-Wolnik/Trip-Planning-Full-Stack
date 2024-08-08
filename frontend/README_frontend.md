# Frontend documentation

## Introduction

This is the frontend for our trip managing website. For more general information, see the [main README](../README.md).


## Features
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


## Technologies Used

- React (with Vite)
- TypeScript
- ESLint for linting
- Google Maps API

## Development Workflow

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Run tests: `npm test`
4. Build for production: `npm run build`

#### Important
default build for vite is saved in diff folder then build - change in vite.config.ts

## Project Structure

<details>
<summary>see structure tree</summary>

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
 - build swapped from deafult dir to build
 - custom hooks: useAuth(AuthContext) and useModal(ModalContext)
 - src/services/api connection to the backend
 - src/layouts/LandingPageLayout main layout for website
 - src/comopnents/ProtectedRoute to hide protected routes
 - src/config/enviorement enviorement variables
 - src/types.ts global typing 
</details>

## Contributing

If you'd like to contribute to the frontend of this project, please follow these guidelines:

1. Ensure your code follows the project's coding standards and conventions.
2. Write or update tests for any new or modified components or functionality.
3. Run the frontend tests using npm test.
4. If you introduce new dependencies, ensure they are properly versioned and compatible with the project's requirements.
5. Submit a pull request with a clear description of your changes and their purpose.

We value contributions that improve the overall user experience, code quality, and learning aspects of the frontend application.

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
