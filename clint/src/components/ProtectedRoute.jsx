import { Navigate } from "react-router-dom"

function ProtectedRoute({
  children,
  allowedRoles = null,
  redirectTo = "/login",
  message = "Please login first",
}) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null")
  const userRole = userInfo?.role

  if (!userInfo?.token) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ message, role: allowedRoles?.[0] || "user" }}
      />
    )
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          message: "Please login with the correct account type",
          role: allowedRoles[0],
        }}
      />
    )
  }

  return children
}

export default ProtectedRoute
