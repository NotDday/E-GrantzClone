import React from 'react';
import aboutImg from '../assets/images/about.jpg';

const AboutSection = () => {
  return (
    <div id="about-us" style={{ paddingTop: '70px' }}>
      <div className="hidden-xs s-12 m-12 l-6 media-container">
        <img src={aboutImg} alt="About e-grantz 3.0" />
      </div>
      <article className="s-12 m-12 l-6">
        <p className="hidden-xs">&nbsp;</p>
        <h2>
          e-grantz <b style={{ color: '#ffb71c' }}> 3.0</b>
        </h2>
        <p style={{ color: '#ffb71c' }}>
          Online Centralised System for Disbursement of Scholarships/Schemes for all Pre-matric and Post-matric Students of SC, ST &amp; OBC community in the state of Kerala.
        </p>
        <p align="justify">
          The system is an integrated online software solution for the disbursement of the various educational assistance schemes of the Scheduled Castes Development Department. The beneficiaries of any educational assistance scheme have to first register by giving their basic details such as Name, Address, Date of Birth, Gender, Mobile Number, Bank Account details and Aadhar Number. Such registered students can apply through the same application for various schemes. Through a single registration, the system could uniquely identify a student and this basic detail shall be used for the disbursement of educational assistance throughout the period of education under various schemes. Provision for institutions will also be available for entering the applications, in case the student is not able to apply online. The financial assistance reaches the students bank account through Direct Beneficiary Transfer (DBT).
        </p>
        <div className="about-us-icons">
          <i className="icon-trophy"></i>
          <span style={{ color: '#ffb71c' }}>Won National Award for E-governance 2010-11 for exemplary reuse of ICT based technologies.</span>
        </div>
        <p>&nbsp;</p>
        <p style={{ color: '#f1f1f1' }}>
          &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a style={{ color: '#f1f1f1' }} href="https://egrantz.kerala.gov.in/assets/video/nsp_video.mp4" target="_blank" rel="noreferrer">
            How to get your OTR No - CLICK HERE
          </a>
        </p>
        <p style={{ color: '#f1f1f1' }}>
          &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a style={{ color: '#f1f1f1' }} href="https://egrantz.kerala.gov.in/seminar/" target="_blank" rel="noreferrer">
            Education &amp; Employment Guidance Workshop Registration - CLICK HERE
          </a>
        </p>
      </article>
    </div>
  );
};

export default AboutSection;
