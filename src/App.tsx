import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Topics from './pages/Topics'
import TopicDetail from './pages/TopicDetail'
import MasterMethod from './pages/MasterMethod'
import QuestionBank from './pages/QuestionBank'
import MockExam from './pages/MockExam'
import Review from './pages/Review'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import './App.css'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="topics" element={<Topics />} />
          <Route path="topics/divide-and-conquer/master-method" element={<MasterMethod />} />
          <Route path="topics/:topicId" element={<TopicDetail />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="mock-exam" element={<MockExam />} />
          <Route path="review" element={<Review />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="documents" element={<Documents />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
