import { useState, useCallback } from 'react';

const RATE = 83.45;

function formatNumber(num) {
  return num.toLocaleString('en-IN');
}

function parseFormattedNumber(str) {
  const cleaned = str.replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export default function ConverterCard({ onInitiate }) {
  const [sendAmount, setSendAmount] = useState('1,000');

  const receiveAmount = formatNumber(
    Math.round(parseFormattedNumber(sendAmount) * RATE)
  );

  const handleChange = useCallback((e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    if (raw === '') {
      setSendAmount('');
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      setSendAmount(formatNumber(num));
    }
  }, []);

  return (
    <div className="converter-container">
      <div className="radar-bg" />
      <div className="acid-arc" />
      <div className="radar-ring ring-1" />
      <div className="radar-ring ring-2" />
      <div className="radar-ring ring-3" />
      <div className="converter-card">
        <div className="input-group">
          <div className="input-row">
            <span className="label-technical">YOU SEND</span>
            <span className="label-technical">BAL: 4,200.00</span>
          </div>
          <div className="input-row">
            <input
              type="text"
              className="currency-input"
              value={sendAmount}
              onChange={handleChange}
            />
            <span className="currency-badge">USDC</span>
          </div>
        </div>
        <div className="divider" />
        <div className="input-group">
          <div className="input-row">
            <span className="label-technical">YOU RECEIVE</span>
            <span className="label-technical">RATE: {RATE}</span>
          </div>
          <div className="input-row">
            <input
              type="text"
              className="currency-input"
              value={receiveAmount}
              readOnly
              style={{ color: 'var(--accent-lime)' }}
            />
            <span className="currency-badge">INR</span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => onInitiate(sendAmount, receiveAmount)}>
          Initiate Offramp
          <div className="btn-arrow">&#10140;</div>
        </button>
      </div>
    </div>
  );
}
