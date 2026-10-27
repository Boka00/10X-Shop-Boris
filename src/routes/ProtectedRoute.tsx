import type { ReactNode } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({children}: {children: ReactNode}) => {

    const { user } = useAuth();
    const location = useLocation();

    if(!user.isLoggedIn) return <Navigate to="/login" state={{from: location}} replace/>
    
    return <>{children}</>

}

export default ProtectedRoute