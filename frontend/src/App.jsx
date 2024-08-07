import React, { Suspense, lazy } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Spinner from "./components/Spinner";
import AppHeader from "./components/AppHeader";
import UserProvider from "./components/UserProvider";
import getBookLoader from "./utils/getBookLoader";
import { showBookLoader } from "./pages/ShowBook";
import { homeBooksLoader } from "./pages/Home";

const Home = lazy(() => import("./pages/Home"));
const CreateBooks = lazy(() => import("./pages/CreateBooks"));
const ShowBook = lazy(() => import("./pages/ShowBook"));
const DeleteBooks = lazy(() => import("./pages/DeleteBook"));
const EditBook = lazy(() => import("./pages/EditBook"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

// API Endpoint
// export const api = "http://localhost:5000";
export const api = "https://bookhub-ik4s.onrender.com";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AppHeader />}>
        <Route index element={<Home />} loader={homeBooksLoader} />
        <Route
          path=":username/:id"
          element={<ShowBook />}
          loader={showBookLoader}
        />
        <Route path="new" element={<CreateBooks />} />
        <Route
          path=":username/:id/edit"
          element={<EditBook />}
          loader={getBookLoader}
        />
        <Route
          path=":username/:id/delete"
          element={<DeleteBooks />}
          loader={getBookLoader}
        />
      </Route>
      <Route path="*" element={<PageNotFound />} />
      <Route path="/:username" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </>
  )
);

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <UserProvider>
        <RouterProvider router={router} fallbackElement={<Spinner />} />
      </UserProvider>
    </Suspense>
  );
}

export default App;
