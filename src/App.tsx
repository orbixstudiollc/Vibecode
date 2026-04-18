import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import VideoBackground from './components/VideoBackground';

export default function App() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <VideoBackground />
      <Navbar />
      <HeroSection />
    </div>
  );
}
