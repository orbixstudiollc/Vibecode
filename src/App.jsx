import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GridOverlay from './components/GridOverlay';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ConverterCard from './components/ConverterCard';
import ConfirmModal from './components/ConfirmModal';
import LeadDashboard from './pages/LeadDashboard';
import LeadList from './pages/LeadList';
import LeadForm from './pages/LeadForm';
import LeadDetail from './pages/LeadDetail';
import LeadPipeline from './pages/LeadPipeline';
import OutreachPanel from './pages/OutreachPanel';
import LeadCapture from './pages/LeadCapture';

function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState('1,000.00');
  const [receiveAmount, setReceiveAmount] = useState('83,450.00');

  const handleInitiate = useCallback((send, receive) => {
    const formatWithDecimals = (val) => {
      const str = String(val);
      return str.includes('.') ? str : str + '.00';
    };
    setSendAmount(formatWithDecimals(send));
    setReceiveAmount(formatWithDecimals(receive));
    setModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <main>
        <div className="content-wrapper">
          <HeroSection />
          <ConverterCard onInitiate={handleInitiate} />
        </div>
      </main>
      <ConfirmModal
        isOpen={modalOpen}
        onClose={handleClose}
        sendAmount={sendAmount}
        receiveAmount={receiveAmount}
      />
    </>
  );
}

function App() {
  return (
    <>
      <GridOverlay />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<LeadDashboard />} />
        <Route path="/leads" element={<LeadList />} />
        <Route path="/leads/new" element={<LeadForm />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
        <Route path="/leads/:id/edit" element={<LeadForm />} />
        <Route path="/pipeline" element={<LeadPipeline />} />
        <Route path="/outreach" element={<OutreachPanel />} />
        <Route path="/capture" element={<LeadCapture />} />
      </Routes>
    </>
  );
}

export default App;
