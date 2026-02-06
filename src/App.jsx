import { useState, useCallback } from 'react';
import './App.css';
import GridOverlay from './components/GridOverlay';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ConverterCard from './components/ConverterCard';
import ConfirmModal from './components/ConfirmModal';

function App() {
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
      <GridOverlay />
      <Navbar />
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

export default App;
