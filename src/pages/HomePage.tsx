import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { TrustBadges } from '../components/home/TrustBadges';
import { CategoriesSection } from '../components/home/CategoriesSection';
import { FeaturedCollection } from '../components/home/FeaturedCollection';
import { CraftStorySection } from '../components/home/CraftStorySection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { WhatsAppSupportBanner } from '../components/home/WhatsAppSupportBanner';
import { NewsletterSection } from '../components/home/NewsletterSection';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-0">
      <HeroBanner onNavigate={onNavigate} />
      <TrustBadges />
      <CategoriesSection onNavigate={onNavigate} />
      <FeaturedCollection onNavigate={onNavigate} />
      <CraftStorySection onNavigate={onNavigate} />
      <TestimonialsSection />
      <WhatsAppSupportBanner />
      <NewsletterSection />
    </div>
  );
};
