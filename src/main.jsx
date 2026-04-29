import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { UserProfileProvider } from "./context/UserProfileContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { WatchlistProvider } from "./context/WatchlistContext.jsx";
import { ReviewsProvider } from "./context/ReviewsContext.jsx";
import { SocialProvider } from "./context/SocialContext.jsx";
import { NotificationsProvider } from "./context/NotificationsContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthContextProvider>
          <UserProfileProvider>
            <FavoritesProvider>
              <WatchlistProvider>
                <ReviewsProvider>
                  <SocialProvider>
                    <NotificationsProvider>
                      <BrowserRouter>
                        <App />
                      </BrowserRouter>
                    </NotificationsProvider>
                  </SocialProvider>
                </ReviewsProvider>
              </WatchlistProvider>
            </FavoritesProvider>
          </UserProfileProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
