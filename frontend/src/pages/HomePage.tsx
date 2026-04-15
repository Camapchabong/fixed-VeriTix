import React from 'react';
import '../assets/styles/Homepage.css';
import useBlockchainAnimation from '../hooks/useBlockchainAnimation';
import HomepageHero from '../components/HomepageHero';
import FeaturesSection from '../components/FeaturesSection';
import TicketListing from '../components/TicketListing';
import BlockchainTrust from '../components/BlockchainTrust';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  useBlockchainAnimation();

  return (
    <div className="homepage">
      <HomepageHero />
      <FeaturesSection />
      <TicketListing />
      <BlockchainTrust />
      <Footer />
    </div>
  );
};

export default HomePage;