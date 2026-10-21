import React from 'react';
import PublicLayout from './PublicLayout';

const FaqPage = ({ navigate }) => {
  const faqs = [
    { q: "What is e-Grantz 3.0?", a: "e-Grantz 3.0 is an end-to-end e-governance portal implemented by the Government of Kerala for disbursing educational concessions and scholarships to eligible students belonging to SC, ST, OEC, and Backward Classes." },
    { q: "Who is eligible for e-Grantz scholarships?", a: "Students belonging to Scheduled Castes (SC), Scheduled Tribes (ST), OEC, and Other Backward Classes (OBC/SEBC) pursuing post-matriculation courses in recognized institutions in Kerala with required family income criteria are eligible." },
    { q: "What is One Time Registration (OTR)?", a: "One Time Registration (OTR) is a mandatory preliminary registration where students create a unique profile, provide Aadhaar/bank details, and obtain an OTR ID required for applying to various educational schemes." },
    { q: "How can I track my scholarship application status?", a: "You can track your application status anytime on the home page or via the Track Application service by entering your unique Application Number." },
    { q: "What documents are required for scholarship application?", a: "Required documents include caste certificate, income certificate, bank passbook copy (with Aadhaar seeding), previous semester mark lists, and admission fee receipt." },
    { q: "How will the scholarship amount be disbursed?", a: "The scholarship amount is directly transferred to the student's Aadhaar-linked bank account via DBT (Direct Benefit Transfer) after approval by the concerned Directorate." },
  ];

  return (
    <PublicLayout navigate={navigate} title="FREQUENTLY ASKED QUESTIONS">
      <div className="row clearfix">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="card">
            <div className="header">
              <h2>FAQ — e-Grantz 3.0 Portal</h2>
            </div>
            <div className="body">
              <div className="panel-group" id="accordion">
                {faqs.map((faq, idx) => (
                  <div className="panel panel-default" key={idx} style={{ marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <div className="panel-heading" style={{ backgroundColor: '#f5f5f5', padding: '12px 15px' }}>
                      <h4 className="panel-title" style={{ margin: 0, color: '#333', fontWeight: 'bold' }}>
                        <i className="material-icons" style={{ verticalAlign: 'middle', fontSize: '18px', color: '#f44336', marginRight: '8px' }}>help_outline</i>
                        Q{idx + 1}. {faq.q}
                      </h4>
                    </div>
                    <div className="panel-body" style={{ padding: '12px 15px', borderTop: '1px solid #ddd', color: '#555', lineHeight: '1.6' }}>
                      {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FaqPage;
