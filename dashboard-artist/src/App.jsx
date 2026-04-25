import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Stratex from './pages/Stratex'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"             element={<Dashboard />}     />
          <Route path="/projects"     element={<Projects />}      />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/stratex"      element={<Stratex />}       />
          <Route path="/settings"     element={<Settings />}      />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
