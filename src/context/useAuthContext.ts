import { create } from "zustand";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { axiosInstance } from "../services/api-client";

interface AuthState {
  isAuthenticated: boolean;
  user: JwtPayload | null;
  userId: string | null | undefined;
  authTokens: string | null;
  authTokensRefresh: string | null;
  setAuthTokens: (tokens: string, refreshToken: string) => void;
  setUser: (user: JwtPayload) => void;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
}

interface CustomJwtPayload extends JwtPayload {
  user_id?: string;
}

const willTokenExpireSoon = (token: string, threshold: number): boolean => {
  const decodedToken = jwtDecode<JwtPayload>(token);
  if (decodedToken && typeof decodedToken.exp === "number") {
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime + threshold;
  }
  return true;
};

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("authTokensRefresh");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axiosInstance.post("api/token/refresh/", {
      refresh: refreshToken,
    });
    const newAccessToken = response.data["access"];
    if (newAccessToken) {
      localStorage.setItem("authTokens", newAccessToken);
      return newAccessToken;
    }
  } catch (error) {
    console.error("Failed to refresh token", error);
  }
  return null;
};

const useAuthStore = create<AuthState>((set) => {
  const storedTokens = localStorage.getItem("authTokens");
  const storedRefreshToken = localStorage.getItem("authTokensRefresh");
  const decodedUser = storedTokens
    ? jwtDecode<CustomJwtPayload>(storedTokens)
    : null;
  const userId = decodedUser ? decodedUser.user_id : null;
  let intervalId: number | null = null;

  const checkToken = async () => {
    const tokens = localStorage.getItem("authTokens");
    if (tokens) {
      if (willTokenExpireSoon(tokens, 60 * 3)) {
        // Check if token will expire in the next 4 minutes
        const newTokens = await refreshToken();
        if (newTokens) {
          const newUser = jwtDecode<CustomJwtPayload>(newTokens);
          const newUserId = newUser.user_id ?? null;
          set({
            authTokens: newTokens,
            user: newUser,
            userId: newUserId,
            isAuthenticated: true,
          });
        } else {
          set({
            isAuthenticated: false,
            authTokens: null,
            authTokensRefresh: null,
            user: null,
            userId: null,
          });
          if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } else {
        const currentUser = jwtDecode<CustomJwtPayload>(tokens);
        const currentUserId = currentUser.user_id ?? null;
        set({
          user: currentUser,
          userId: currentUserId,
          isAuthenticated: true,
        });
      }
    } else {
      set({
        isAuthenticated: false,
        authTokens: null,
        authTokensRefresh: null,
        user: null,
        userId: null,
      });
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  };

  const initializeInterval = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    intervalId = window.setInterval(checkToken, 1000 * 60);
  };

  if (storedTokens) {
    if (willTokenExpireSoon(storedTokens, 0)) {
      set({
        isAuthenticated: false,
        authTokens: null,
        authTokensRefresh: null,
        user: null,
        userId: null,
      });
    } else {
      initializeInterval();
    }
  }

  return {
    isAuthenticated: !!storedTokens,
    user: decodedUser,
    userId: userId,
    authTokens: storedTokens,
    authTokensRefresh: storedRefreshToken,
    setAuthTokens: (tokens, refreshToken) => {
      localStorage.setItem("authTokens", tokens);
      localStorage.setItem("authTokensRefresh", refreshToken);
      const user = jwtDecode<CustomJwtPayload>(tokens);
      const userId = user.user_id;
      set({
        authTokens: tokens,
        authTokensRefresh: refreshToken,
        isAuthenticated: true,
        user: user,
        userId: userId,
      });
      initializeInterval();
    },
    setUser: (user) => set({ user }),
    login: (token: string, refreshToken: string) => {
      localStorage.setItem("authTokens", token);
      localStorage.setItem("authTokensRefresh", refreshToken);
      const user = jwtDecode<CustomJwtPayload>(token);
      const userId = user.user_id;
      set({
        isAuthenticated: true,
        authTokens: token,
        authTokensRefresh: refreshToken,
        user: user,
        userId: userId,
      });
      initializeInterval();
    },
    logout: () => {
      localStorage.removeItem("authTokens");
      localStorage.removeItem("authTokensRefresh");
      set({
        isAuthenticated: false,
        authTokens: null,
        authTokensRefresh: null,
        user: null,
        userId: null,
      });
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
  };
});

export default useAuthStore;
