import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import NewsPage from './pages/News/NewsPage';
import AgoraPage from './pages/Agora/AgoraPage';
import TrendPage from './pages/Trend/TrendPage';
import MyPage from './pages/My/MyPage';
import NewsListPage from './pages/News/NewsListPage';
import NewsDetailPage from './pages/News/NewsDetailPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<NewsPage />} />
          <Route path='/agora' element={<AgoraPage />} />
          <Route path='/trend' element={<TrendPage />} />
          <Route path='/my' element={<MyPage />} />
          <Route path='/news-list' element={<NewsListPage />} />
          <Route path='/news-detail' element={<NewsDetailPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
