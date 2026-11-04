import Nav from '@/components/sections/Nav';
import Hero from '@/components/sections/Hero';
import HeroStage from '@/components/sections/HeroStage';
import Stats from '@/components/sections/Stats';
import LogoStrip from '@/components/sections/LogoStrip';
import Problem from '@/components/sections/Problem';
import Bento from '@/components/sections/Bento';
import TalentTabs from '@/components/sections/TalentTabs';
import HowItWorks from '@/components/sections/HowItWorks';
import TestimonialWall from '@/components/sections/TestimonialWall';
import TalentCta from '@/components/sections/TalentCta';
import Pricing from '@/components/sections/Pricing';
import Faq from '@/components/sections/Faq';
import Closer from '@/components/sections/Closer';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero>
          <HeroStage />
        </Hero>
        <Stats>
          <LogoStrip />
        </Stats>
        <Problem />
        <Bento />
        <TalentTabs />
        <HowItWorks />
        <TestimonialWall />
        <TalentCta />
        <Pricing />
        <Faq />
        <Closer />
      </main>
      <Footer />
    </>
  );
}
