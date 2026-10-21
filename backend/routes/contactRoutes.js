const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

const defaultContacts = [
  {
    directorate: "DIRECTORATE OF SCHEDULED CASTES DEVELOPMENT",
    address: "Museum-Nandhavanam Road, Nandhavanam, Vikasbhavan P O, Thiruvananthapuram-695033",
    country: "India",
    email: "egrantz.sc@gmail.com",
    phone: "0471-2737252, 0471-2737251"
  },
  {
    directorate: "Directorate of Backward Classes Development Department",
    address: "AyyankaliBhavan, Kanaka nagar, Kowdiyar P.O, Vellayambalam, Thiruvananthapuram – 695003",
    email: "bcddkerala@gmail.com",
    phone: "0471 2727378"
  },
  {
    directorate: "Directorate of Scheduled Tribes Development Department",
    address: "4th floor, Vikas Bhavan, Thiruvananthapuram",
    email: "egrantzstdd@gmail.com",
    phone: "0471-2304594, 0471-2303229",
    tollFree: "1800 425 2312"
  }
];

// GET /api/contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    if (contacts && contacts.length > 0) {
      return res.json(contacts);
    }
    return res.json(defaultContacts);
  } catch (error) {
    return res.json(defaultContacts);
  }
});

// POST /api/contacts - Submit contact / grievance message
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const contactMsg = await Contact.create({
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message
    });
    res.status(201).json({ success: true, message: 'Message submitted successfully', contact: contactMsg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
