import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import NoticeBoard from './components/NoticeBoard';
import LoginSection from './components/LoginSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import BottomBar from './components/BottomBar';

import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import ForgotPassword from './pages/ForgotPassword';
import MobileChange from './pages/MobileChange';
import TrackApplicationPage from './pages/TrackApplicationPage';
import FaqPage from './pages/FaqPage';
import OneTimeRegPage from './pages/OneTimeRegPage';
import ContactPage from './pages/ContactPage';

import CandidateProfile from './pages/CandidateProfile';
import AddQualification from './pages/AddQualification';
import ApplicableSchemes from './pages/ApplicableSchemes';
import NoticeBoardPage from './pages/NoticeBoardPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import TrackStudentPage from './pages/TrackStudentPage';
import ApplicationVerificationPage from './pages/ApplicationVerificationPage';
import AdminPortal from './pages/AdminPortal';

import './assets/css/responsee.css';
import './assets/css/components.css';
import './assets/css/template-style.css';
import './assets/css/custom.css';
import './assets/css/adminbsb/bootstrap.min.css';
import './assets/css/adminbsb/materialize.css';
import './assets/css/adminbsb/style.css';
import './assets/css/adminbsb/themes/all-themes.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  if (currentPath === '/login') return <StudentLogin navigate={navigate} />;
  if (currentPath === '/register') return <StudentRegister navigate={navigate} />;
  if (currentPath === '/forgot-password') return <ForgotPassword navigate={navigate} />;
  if (currentPath === '/mobile-change') return <MobileChange navigate={navigate} />;
  if (currentPath === '/track-application') return <TrackApplicationPage navigate={navigate} />;
  if (currentPath === '/faq') return <FaqPage navigate={navigate} />;
  if (currentPath === '/otr') return <OneTimeRegPage navigate={navigate} />;
  if (currentPath === '/contact') return <ContactPage navigate={navigate} />;

  if (currentPath === '/admin') return <AdminPortal navigate={navigate} />;

  if (currentPath === '/portal' || currentPath === '/portal/') return <CandidateProfile navigate={navigate} />;
  if (currentPath === '/portal/profile') return <CandidateProfile navigate={navigate} />;
  if (currentPath === '/portal/track') return <TrackStudentPage navigate={navigate} />;
  if (currentPath === '/portal/applications') return <ApplicationVerificationPage navigate={navigate} />;
  if (currentPath === '/portal/qualifications') return <AddQualification navigate={navigate} />;
  if (currentPath === '/portal/schemes') return <ApplicableSchemes navigate={navigate} />;
  if (currentPath === '/portal/notices') return <NoticeBoardPage navigate={navigate} />;
  if (currentPath === '/portal/change-password') return <ChangePasswordPage navigate={navigate} />;

  return (
    <div className="size-1140 vc-init" style={{ minHeight: '100vh', paddingBottom: '50px' }}>
      <div className="content" style={{ minHeight: 'calc(100vh - 30px)', padding: '0px' }}>
        <header>
          <TopBar />
          <Navbar navigate={navigate} />
        </header>
        <section style={{ paddingTop: '100px' }}>
          <AboutSection />
          <NoticeBoard />
          <LoginSection navigate={navigate} />
          <ContactSection />
        </section>
        <Footer />
        <BottomBar navigate={navigate} />
      </div>
    </div>
  );
}

export default App;
