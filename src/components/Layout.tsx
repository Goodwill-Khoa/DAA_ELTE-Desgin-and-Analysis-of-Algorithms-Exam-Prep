import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import './Layout.css'

export default function Layout() {
  return (
    <div className="layout">
      <NavBar />
      <main className="layout-main" id="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="layout-footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <strong>ELTE MSc – Design and Analysis of Algorithms</strong>
              <span className="text-muted"> · Exam Prep Site</span>
            </div>
            <div className="text-muted text-small">
              Instructor: <a href="mailto:szabolaszlo@inf.elte.hu">Dr. László Szabó</a> · szabolaszlo@inf.elte.hu
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
