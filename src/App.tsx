import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import { ProtectedRoute } from "./components/ProtectedRoute"
import Home from "./pages/Home"
import Spinner from "./components/Spinner"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const ScanCrop = lazy(() => import("./pages/ScanCrop"))
const Irrigation = lazy(() => import("./pages/Irrigation"))
const Advisory = lazy(() => import("./pages/Advisory"))
const MyFarm = lazy(() => import("./pages/MyFarm"))
const Reports = lazy(() => import("./pages/Reports"))
const Profile = lazy(() => import("./pages/Profile"))
const Login = lazy(() => import("./pages/Login"))
const SignUp = lazy(() => import("./pages/SignUp"))

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute><ScanCrop /></ProtectedRoute>} />
          <Route path="/irrigation" element={<ProtectedRoute><Irrigation /></ProtectedRoute>} />
          <Route path="/advisory" element={<ProtectedRoute><Advisory /></ProtectedRoute>} />
          <Route path="/farm" element={<ProtectedRoute><MyFarm /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}