import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactSection = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/api/contacts');
        setContacts(response.data);
      } catch (error) {
        console.error('Failed to fetch contact details:', error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div id="contact" style={{ background: 'rgb(79, 109, 144)', paddingTop: '30px', paddingBottom: '30px' }}>
      <div className="line">
        <h2 className="section-title">Contact Us</h2>
        <div className="margin">
          <div className="s-12 m-12 l-3 hide-m hide-s margin-bottom right-align">
            <h3>DIRECTORATE OF SCHEDULED CASTES DEVELOPMENT</h3>
            <address style={{ color: 'rgb(0, 33, 71)' }}>
              <p><strong>Address:</strong> Museum-Nandhavanam Road, Nandhavanam, Vikasbhavan P O, Thiruvananthapuram-695033</p>
              <p><strong>Country:</strong> India</p>
              <p><strong>E-mail:</strong> egrantz.sc@gmail.com</p>
              <p>SC Directorate: 0471-2737252, 0471-2737251</p>
            </address>
          </div>
          <div className="s-12 m-12 l-4 margin-bottom right-align">
            <h3>Directorate of Backward Classes Development Department</h3>
            <address style={{ color: 'rgb(0, 33, 71)' }}>
              AyyankaliBhavan Kanaka nagar, KowdiyarP.O Vellayambalam, Thiruvananthapuram – 695003<br />
              contact no: 0471 2727378<br />
              mail_id: bcddkerala@gmail.com
            </address>
          </div>
          <div className="s-12 m-12 l-5">
            <h3>Directorate of Scheduled Tribes Development Department</h3>
            <address style={{ color: 'rgb(0, 33, 71)' }}>
              4th floor, Vikas Bhavan, Thiruvananthapuram<br />
              contact no: 0471-2304594, 0471-2303229<br />
              mail_id: egrantzstdd@gmail.com
            </address>
            <p><strong>TOLL-FREE(ST Department):</strong> 1800 425 2312</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
