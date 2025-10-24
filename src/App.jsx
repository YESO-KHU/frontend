import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AgoraStatusProvider } from './contexts/AgoraStatusContext';
import NewsPage from './pages/news/NewsPage';
import AgoraPage from './pages/agora/AgoraPage';
import TrendPage from './pages/trend/TrendPage';
import MyPage from './pages/My/MyPage';
import NewsListPage from './pages/news/NewsListPage';
import NewsDetailPage from './pages/news/NewsDetailPage';
import AgoraCreatePage from './pages/agora/AgoraCreatePage';
import AgoraChatPage from './pages/agora/AgoraChatPage';
import AgoraDetailPage from './pages/agora/AgoraDetailPage';
import SignInPage from './pages/user/SignInPage';
import SignUpPage from './pages/user/SignUpPage';
import AgoraParticipatePage from './pages/agora/AgoraParticipatePage'

const isAuthed = () => !!localStorage.getItem('accessToken');

function RequireAuth({ children }) {
  return isAuthed() ? children : <Navigate to="/signin" replace />;
}

function PublicOnly({ children }) {
  return isAuthed() ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <Provider store={store}>
      <AgoraStatusProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <NewsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/agora"
              element={
                <RequireAuth>
                  <AgoraPage />
                </RequireAuth>
              }
            />
            <Route
              path="/trend"
              element={
                <RequireAuth>
                  <TrendPage />
                </RequireAuth>
              }
            />
            <Route
              path="/my"
              element={
                <RequireAuth>
                  <MyPage />
                </RequireAuth>
              }
            />
            <Route
              path="/news-list"
              element={
                <RequireAuth>
                  <NewsListPage />
                </RequireAuth>
              }
            />
            <Route
              path="/news/:articleId"
              element={
                <RequireAuth>
                  <NewsDetailPage />
                </RequireAuth>
              }
            />
            <Route
              path="/agora/create"
              element={
                <RequireAuth>
                  <AgoraCreatePage />
                </RequireAuth>
              }
            />
            <Route
              path="/agora/chat/:agoraId"
              element={
                <RequireAuth>
                  <AgoraChatPage />
                </RequireAuth>
              }
            />
            <Route
              path="/agora/detail"
              element={
                <RequireAuth>
                  <AgoraDetailPage />
                </RequireAuth>
              }
            />
            <Route
              path="/signin"
              element={
                <PublicOnly>
                  <SignInPage />
                </PublicOnly>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnly>
                  <SignUpPage />
                </PublicOnly>
              }
            />
            <Route
              path="/agora/participate"
              element={
                <RequireAuth>
                  <AgoraParticipatePage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to={isAuthed() ? "/" : "/signin"} replace />} />
          </Routes>
        </Router>
      </AgoraStatusProvider>
    </Provider>
  );
}

export default App;