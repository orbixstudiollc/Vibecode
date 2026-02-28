import { useState, useEffect, useRef, useCallback } from 'react';

export default function ConfirmModal({ isOpen, onClose, sendAmount, receiveAmount }) {
  const [countdown, setCountdown] = useState(29);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCountdown(29);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            onClose();
            return 29;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  return (
    <div
      className={`modal-overlay${isOpen ? ' active' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-card">
        <div className="timer-container">
          <span className="timer-text">
            QUOTE EXPIRES IN <span>{countdown}</span>S
          </span>
        </div>

        <div className="modal-header">
          <h2 className="modal-title">Confirm Settlement</h2>
          <button className="close-btn" onClick={onClose}>
            &#10005;
          </button>
        </div>

        <div className="details-box">
          <div className="detail-row">
            <span className="label-technical">PAYMENT AMOUNT</span>
            <span className="detail-value">{sendAmount} USDC</span>
          </div>
          <div className="detail-row">
            <span className="label-technical">EXCHANGE RATE</span>
            <span className="detail-value">1 USDC = 83.45 INR</span>
          </div>
          <div className="detail-row">
            <span className="label-technical">EST. SETTLEMENT</span>
            <span className="detail-value highlight">{receiveAmount} INR</span>
          </div>
          <div className="detail-row">
            <span className="label-technical">BANK DESTINATION</span>
            <span className="detail-value">HDFC &bull;&bull;&bull;&bull; 9921</span>
          </div>
        </div>

        <div className="signature-prompt">
          <div className="loading-spinner" />
          <span className="label-technical" style={{ color: 'var(--text-primary)' }}>
            Awaiting Wallet Signature
          </span>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            Please confirm the transaction in your connected wallet browser extension.
          </p>
        </div>

        <div>
          <button className="btn-primary" style={{ width: '100%' }}>
            Processing Transaction
            <div className="btn-arrow">&#9889;</div>
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel Request
          </button>
        </div>

        <div className="modal-network">
          <span className="status-dot-dim" />
          <span className="label-technical">NETWORK: ETHEREUM MAINNET</span>
        </div>
      </div>
    </div>
  );
}
