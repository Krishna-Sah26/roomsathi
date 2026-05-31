import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { FaEnvelope, FaEye, FaEyeSlash, FaGoogle, FaLock, FaShieldAlt } from "react-icons/fa"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../firebase"
import API from "../services/api"
import BrandLogo from "../components/BrandLogo"
import Footer from "../components/Footer"
import ThemeToggle from "../components/ThemeToggle"
import { useTheme } from "../hooks/useTheme"

const isValidGmail = (value) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(value.trim())

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()
  const routeRole = new URLSearchParams(location.search).get("role")
  const routeMessage = location.state?.message || ""

  // Login form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState(routeRole === "owner" ? "owner" : "user")
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotNewPassword, setForgotNewPassword] = useState("")
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotMessage, setForgotMessage] = useState("")
  const [forgotStep, setForgotStep] = useState("request")
  const [forgotCode, setForgotCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Send login request and store the JWT payload
  const handleLogin = async () => {
    try {
      if (!isValidGmail(email)) {
        setFormError("Please use a valid @gmail.com email")
        return
      }

      setFormError("")
      setLoading(true)

      const { data } = await API.post("/auth/login", {
        email,
        password,
        role,
      })

      localStorage.setItem("userInfo", JSON.stringify(data))
      alert("Login Successful")

      navigate(data.role === "owner" ? "/owner-dashboard" : "/user-dashboard")
    } catch (error) {
      alert(error?.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const { data } = await API.post("/auth/google", {
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        role,
      })

      localStorage.setItem("userInfo", JSON.stringify(data))
      alert("Login Successful")

      navigate(data.role === "owner" ? "/owner-dashboard" : "/user-dashboard")
    } catch (error) {
      alert(error?.response?.data?.message || "Google login failed")
    }
  }

  const handleForgotPassword = async () => {
    try {
      setForgotMessage("")
      setForgotLoading(true)

      if (forgotStep === "request") {
        const { data } = await API.post("/auth/forgot-password/request", {
          email: forgotEmail || email,
        })

        setForgotMessage(data?.message || "Verification code generated successfully")
        setForgotCode(data?.verificationCode || "")
        setForgotStep("verify")
        return
      }

      const { data } = await API.post("/auth/forgot-password/verify", {
        email: forgotEmail || email,
        code: forgotCode,
        newPassword: forgotNewPassword,
        confirmPassword: forgotConfirmPassword,
      })

      setForgotMessage(data.message || "Password updated successfully")
      setForgotEmail("")
      setForgotCode("")
      setForgotNewPassword("")
      setForgotConfirmPassword("")
      setForgotStep("request")
    } catch (error) {
      setForgotMessage(error?.response?.data?.message || "Unable to reset password")
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className={theme === "dark" ? "min-h-screen bg-slate-950 text-slate-100" : "min-h-screen bg-[#f5f5ff] text-slate-900"}>
      {/* Page header */}
      <header className={theme === "dark" ? "border-b border-slate-800 bg-slate-950/90 backdrop-blur" : "border-b border-slate-200 bg-white/90 backdrop-blur"}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <BrandLogo
            to="/"
            size="lg"
            textClassName={theme === "dark" ? "text-xl text-white" : "text-xl text-blue-700"}
          />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="hidden text-sm font-medium text-slate-600 md:block">
              Local Guide
            </span>
            <button
              type="button"
              onClick={() =>
                navigate("/login?role=owner", {
                  state: { message: "Please login as an owner first to add a room" },
                })
              }
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Add Room
            </button>
          </div>
        </div>
      </header>

      {/* Auth card */}
      <main className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <div className={theme === "dark" ? "overflow-hidden rounded-2xl bg-slate-900 shadow-[0_20px_55px_rgba(15,23,42,0.35)] ring-1 ring-slate-800" : "overflow-hidden rounded-2xl bg-white shadow-[0_20px_55px_rgba(15,23,42,0.08)] ring-1 ring-slate-200"}>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left promo panel */}
            <section
              className="relative hidden min-h-[450px] overflow-hidden bg-cover bg-center lg:flex"
              style={{
                backgroundImage:
                  "url('https://i1-e.pinimg.com/736x/27/db/a1/27dba12f1dc534cb8f3e0de2ca2e7f27.jpg')",
              }}
              >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-800/12 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-blue-700/35 via-blue-700/10 to-transparent" />
              <div className="relative z-10 flex flex-col justify-end p-8 text-white">
                <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-semibold tracking-[0.22em] backdrop-blur-md">
                  TRUSTED BY 5,000+ USERS
                </div>
                <h2 className="max-w-xl text-3xl font-bold leading-tight">
                  Find your perfect stay in Birgunj.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-blue-100">
                  Secure, verified, and community-driven room rental platform designed specifically for the heart of the Terai.
                </p>
              </div>
            </section>

            {/* Right auth form */}
            <section className={theme === "dark" ? "bg-slate-900 p-5 md:p-8 lg:p-10" : "bg-white p-5 md:p-8 lg:p-10"}>
              {/* Auth tabs */}
              <div className={theme === "dark" ? "mb-6 flex items-center gap-8 border-b border-slate-800 text-lg font-semibold" : "mb-6 flex items-center gap-8 border-b border-slate-200 text-lg font-semibold"}>
                <Link to={`/login${location.search}`} className="border-b-3 border-blue-700 pb-3 text-blue-700">
                  Login
                </Link>
                <Link to={`/register${location.search}`} className="pb-3 text-slate-400 transition hover:text-slate-700">
                  Register
                </Link>
              </div>

              <h2 className={theme === "dark" ? "text-2xl font-bold tracking-tight text-white" : "text-2xl font-bold tracking-tight"}>
                Welcome Back
              </h2>
              <p className={theme === "dark" ? "mt-2 text-sm text-slate-400" : "mt-2 text-sm text-slate-500"}>
                Access your verified listings and saved favorites.
              </p>

              {routeMessage ? (
                <div className={theme === "dark" ? "mt-4 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300" : "mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-slate-700"}>
                  {routeMessage}
                </div>
              ) : null}

              {/* Validation note */}
              <div className={theme === "dark" ? "mt-4 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300" : "mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-slate-600"}>
                Login only works with a valid <span className="font-semibold">@gmail.com</span> account.
              </div>

              {formError ? (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                  {formError}
                </div>
              ) : null}

                            {/* Email field */}
              <div className="mt-6">
                <label className={theme === "dark" ? "mb-1.5 block text-xs font-semibold tracking-wide text-slate-200" : "mb-1.5 block text-xs font-semibold tracking-wide text-slate-800"}>
                  Email Address
                </label>
                <div className={theme === "dark" ? "flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 shadow-sm" : "flex items-center rounded-lg border border-slate-300 bg-[#f7f7ff] px-3 py-2.5 shadow-sm"}>
                  <FaEnvelope className="mr-2.5 text-slate-400 text-sm" />
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={theme === "dark" ? "w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500" : "w-full bg-transparent text-sm outline-none placeholder:text-slate-400"}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="mt-4">
                <label className={theme === "dark" ? "mb-1.5 block text-xs font-semibold tracking-wide text-slate-200" : "mb-1.5 block text-xs font-semibold tracking-wide text-slate-800"}>
                  Password
                </label>
                <div className={theme === "dark" ? "flex items-center rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 shadow-sm" : "flex items-center rounded-lg border border-slate-300 bg-[#f7f7ff] px-3 py-2.5 shadow-sm"}>
                  <FaLock className="mr-2.5 text-slate-400 text-sm" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={theme === "dark" ? "w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500" : "w-full bg-transparent text-sm outline-none placeholder:text-slate-400"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-slate-400 text-sm"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Role selector */}
              <div className="mt-4">
                <label className={theme === "dark" ? "mb-1.5 block text-xs font-semibold tracking-wide text-slate-200" : "mb-1.5 block text-xs font-semibold tracking-wide text-slate-800"}>
                  Login as
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className=" cursor-pointer w-full rounded-lg border border-slate-300 bg-[#f7f7ff] px-3 py-2.5 text-sm outline-none"
                >
                  <option value="user">Seeker</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              {/* Real login button */}
              <button
                onClick={handleLogin}
                className= " cursor-pointer mt-6 w-full rounded-lg bg-blue-700 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className={theme === "dark" ? "h-px flex-1 bg-slate-800" : "h-px flex-1 bg-slate-200"} />
                <span className={theme === "dark" ? "text-xs font-semibold tracking-[0.24em] text-slate-500" : "text-xs font-semibold tracking-[0.24em] text-slate-400"}>
                  OR CONTINUE WITH
                </span>
                <div className={theme === "dark" ? "h-px flex-1 bg-slate-800" : "h-px flex-1 bg-slate-200"} />
              </div>

              <button
                type="button"
                onClick={googleLogin}
                className=" cursor-pointer flex w-full items-center justify-center gap-2.5 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                <FaGoogle className="text-red-500 text-sm" />
                Google Account
              </button>

              <div className={theme === "dark" ? "mt-6 flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5 text-xs text-slate-300" : "mt-6 flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600"}>
                <FaShieldAlt className="mt-0.5 shrink-0 text-orange-700 text-sm" />
                <p>
                  Your data is secured with banking-grade encryption and stored locally in Nepal.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />

      {forgotOpen ? (
        <div className="  fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className=" text-lg font-semibold text-slate-900">Reset Password</h3>
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="text-sm text-slate-500"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(event) => setForgotEmail(event.target.value)}
                placeholder="Your Gmail address"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              />
              {forgotStep === "verify" ? (
                <input
                  type="text"
                  value={forgotCode}
                  onChange={(event) => setForgotCode(event.target.value)}
                  placeholder="Verification code"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
                />
              ) : null}
                            <input
                type="password"
                value={forgotNewPassword}
                onChange={(event) => setForgotNewPassword(event.target.value)}
                placeholder="New password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              />
              <input
                type="password"
                value={forgotConfirmPassword}
                onChange={(event) => setForgotConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              />

              {forgotMessage ? (
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {forgotMessage}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={forgotLoading}
                className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-70"
              >
                {forgotLoading ? "Working..." : forgotStep === "request" ? "Send Verification Code" : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Login
