import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Navbar from '@/components/ui/Navbar';
import ScrollytellingSection from '@/components/sections/ScrollytellingSection';
import StorySection from '@/components/sections/StorySection';
import SpecsSection from '@/components/sections/SpecsSection';
import CTASection from '@/components/sections/CTASection';

// Lazy-load interactive / client-only components
const HeroSection  = dynamic(() => import('@/components/sections/HeroSection'),  { ssr: false });
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false });
const PageLoader   = dynamic(() => import('@/components/ui/PageLoader'),   { ssr: false });
const SoundWidget  = dynamic(() => import('@/components/ui/SoundWidget'),  { ssr: false });
const LiveTicker   = dynamic(() => import('@/components/ui/LiveTicker'),   { ssr: false });

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>STRATA — Teclado Mecánico Modular</title>
      </Head>

      {/* Overlays & Interactive Widgets */}
      <PageLoader />
      <CustomCursor />
      <SoundWidget />
      <LiveTicker />

      <Navbar />

      <main>
        <HeroSection />
        <ScrollytellingSection />
        <StorySection />
        <SpecsSection />
        <CTASection />
      </main>

      <style>{`
        .footer-container {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 40px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          background: #080808;
        }
        .footer-links {
          display: flex;
          gap: 28px;
          flex-wrap: wrap;
        }
        @media (max-width: 768px) {
          .footer-container {
            padding: 36px 20px;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 20px;
          }
          .footer-links {
            gap: 18px;
            justify-content: center;
          }
        }
      `}</style>

      <footer className="footer-container">
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: '-0.03em',
          color: '#f0f0f0',
        }}>
          ✦ STRATA
        </div>
        <div className="footer-links">
          {['Privacidad', 'Términos', 'Contacto', 'Press Kit'].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                fontSize: 12,
                color: '#444',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#888')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#444')}
            >
              {item}
            </a>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#333' }}>
          © 2026 STRATA. Todos los derechos reservados.
        </div>
      </footer>
    </>
  );
};

export default Home;
