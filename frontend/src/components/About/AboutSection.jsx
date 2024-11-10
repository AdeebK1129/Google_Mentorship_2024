import React from 'react';

const AboutSection = () => {
  return (
    <div className="about-section">
      <h1>About the Team</h1>
      <div className="card-container">
        <div className="card">
          <img src="/images/adeeb.jpeg" alt="Developer 1" />
          <h2>Adeeb Khan</h2>
          <p>Developer | Stuy '24 | Cornell CAS '28</p>
          <p>
            DrRacket, Netlogo, Java, Javascript, HTML, CSS, SQL, Django, Python, Machine Learning using numpy, pandas, and sci-kit learn. Mentored underserved students in programming and engineering topics to build robots; Collected data and wrote Java code for CV and shooter software. Completed AP Computer Science A and Stuyvesant's Software Development Class. Currently developing an app for the tech startup company Niura using React-Native, pursuing AWS Cloud Certifications, and participating in Queensborough Community College's Micro-Credential SWE Bootcamp.
          </p>
          <div className="card-links">
            <a href="mailto:adeeb19909@gmail.com">
              <img src="/images/email.svg" alt="Email Icon" />
            </a>
            <a href="https://www.linkedin.com/in/adeeb-k28/" target="_blank" rel="noopener noreferrer">
              <img src="/images/linkedin.svg" alt="LinkedIn Icon" />
            </a>
          </div>
        </div>
        <div className="card">
          <img src="/images/morgan.jpeg" alt="Mentor" />
          <h2>Morgan Brennor</h2>
          <p>Mentor | Solutions Engineer at Google</p>
          <p>
            Morgan has been a pleasure to work with and has been our mentor throughout the entire process. We are very thankful to have met him even through our tumultuous schedules and obstacles. We truly were excited every time we were able to hop on call and hear more from him.
            Morgan is a Solutions Engineer at Google working on the GTech team in Advertising Services. A Stevens Institute of Technology graduate with a B.S in Computer Science, as well as a Minor in Economics, Morgan has a strong background in Full Stack Web Development, Data Analytics, and Platform Development.
          </p>
          <div className="card-links">
            <a href="mailto:morganbrenner@google.com">
              <img src="/images/email.svg" alt="Email Icon" />
            </a>
            <a href="https://www.linkedin.com/in/morgan-brenner-9773a613b/" target="_blank" rel="noopener noreferrer">
              <img src="/images/linkedin.svg" alt="LinkedIn Icon" />
            </a>
          </div>
        </div>
        <div className="card">
          <img src="/images/john.png" alt="Developer 2" />
          <h2>John Chandler</h2>
          <p>Developer | Stuy '24 | OLIN COE '28</p>
          <p>
            DrRacket, Netlogo, Java, JavaScript, TypeScript, HTML, CSS, React, MongoDB, SQL, Python, Django. Solo developed Retail Automation Software & Founded organization teaching underprivileged students Web Development. Recently debuted a research project as well as my first mobile app at the NYSRE’s Tenth Anniversary Symposium @ the American Museum of Natural History. Winner of the AllStarCode x Nike Bridge the Gap Hackathon (‘22), and Liaison/Representative for AllStarCode x Goldman Sachs cohort. Completed AP Computer Science A and Stuyvesant's Software Development Class.
          </p>
          <div className="card-links">
            <a href="mailto:jchandleriii40@stuy.edu">
              <img src="/images/email.svg" alt="Email Icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
