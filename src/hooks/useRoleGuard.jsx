import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppContext } from "../AppContext";

const useRoleGuard = ({ roles = [], redirectTo = "/login" } = {}) => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!roles.length) return;

    if (!user) {
      navigate(redirectTo, { replace: true, state: { from: location.pathname } });
      return;
    }

    if (user.role && !roles.includes(user.role)) {
      navigate("/login", { replace: true, state: { error: "Access denied for this role." } });
    }
  }, [user, roles, redirectTo, navigate, location]);

  return { user };
};

export default useRoleGuard;

