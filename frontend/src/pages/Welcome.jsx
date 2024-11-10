import React from 'react';
import Introduction from '../components/Intro/Introduction';
import Buttons from '../components/Intro/Buttons';
import Hero from '../components/Hero/Hero';
import StatsSection from '../components/Stats/StatsSection';
import ResourcesSection from '../components/Resources/ResourcesSection';
import AboutSection from '../components/About/AboutSection';

function Welcome() {
  return (
    <div className="app-container">
      
      <div className="section">
        <Introduction />
        <Buttons />
      </div>

      <Hero />

      <StatsSection
        heading="Graduation Rate Disparity Between Wealthy and Poor Districts"
        content="In New York State, the gap in graduation rates between the wealthiest and poorest school
        districts has consistently been between 25% and 27%. This stark difference highlights the
        impact of educational funding inequality, with wealthier districts able to provide more
        resources and support for their students, leading to higher graduation rates and better
        overall outcomes."
        imageUrl="/images/richdistrict.webp"
        imagePosition="right"
      />
      <StatsSection
        heading="Racial Disparities in NYC Public School Teacher Workforce"
        content="According to data from 2020, the New York City public school teacher workforce skews White: 55% of teachers are White, 18% are Black, and 14% are Hispanic. This significant disparity is crucial because teachers' racial biases can influence their expectations for students, the quality of their teaching, and the decisions they make in managing their classrooms. Addressing this disparity is essential to ensure a fair and inclusive educational environment for all students."
        imageUrl="/images/teacherdiversity.webp"
        imagePosition="left"
      />
      <StatsSection
        heading="Digital Divide Among NYC Students"
        content="During the pandemic, a student in a majority Black or Brown school district was four times more likely to have inadequate or no internet than a student in a majority white school district, and three times more likely to not have a dedicated device."
        imageUrl="/images/remotelearning.jpeg"
        imagePosition="right"
      />

      <ResourcesSection />

      <AboutSection />
    </div>
  );
}

export default Welcome;