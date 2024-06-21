import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Spinner from "./components/Spinner";
import AppHeader from "./components/home/AppHeader";
import UserProvider from "./components/UserProvider";

const Home = lazy(() => import("./pages/Home"));
const CreateBooks = lazy(() => import("./pages/CreateBooks"));
const ShowBook = lazy(() => import("./pages/ShowBook"));
const DeleteBooks = lazy(() => import("./pages/DeleteBook"));
const EditBook = lazy(() => import("./pages/EditBook"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));

function App() {
  return (
    // <Suspense fallback={<Spinner />}>
    <UserProvider>
      <Routes>
        <Route element={<AppHeader />}>
          <Route path="/" element={<Home />} />
          <Route path="/:username/:id" element={<ShowBook />} />
          <Route path="/:username/:id/edit" element={<EditBook />} />
          <Route path="/:username/:id/delete" element={<DeleteBooks />} />
          <Route path="/new" element={<CreateBooks />} />
        </Route>
        <Route path="/:username" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </UserProvider>
    // </Suspense>
  );
}

export default App;
