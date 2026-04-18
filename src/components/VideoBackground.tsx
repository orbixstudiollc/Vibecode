import { useEffect, useRef } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';

const FADE_DURATION = 0.5;

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tick = () => {
      const duration = video.duration;
      const current = video.currentTime;

      if (Number.isFinite(duration) && duration > 0) {
        let opacity = 1;
        if (current < FADE_DURATION) {
          opacity = current / FADE_DURATION;
        } else if (current > duration - FADE_DURATION) {
          opacity = Math.max(0, (duration - current) / FADE_DURATION);
        }
        video.style.opacity = String(opacity);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      window.setTimeout(() => {
        video.currentTime = 0;
        void video.play();
      }, 100);
    };

    video.style.opacity = '0';
    void video.play().catch(() => {
      /* autoplay may be blocked until interaction */
    });
    rafRef.current = requestAnimationFrame(tick);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div
      className="absolute z-0"
      style={{ top: '300px', inset: 'auto 0 0 0' }}
    >
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        autoPlay
        preload="auto"
        className="w-full h-auto object-cover transition-opacity"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
    </div>
  );
}
