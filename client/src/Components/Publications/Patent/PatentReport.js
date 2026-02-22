import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Context from '../../../Context';
import Loading from '../../Loading';

const GlobalStyle = createGlobalStyle`
  @media print {
    table {
      width: 100% !important;
      overflow: visible !important;
    }
    table th,
    table td {
      border: 1px solid black !important;
    }
    .no-print {
      display: none !important;
    }
    .printable-content {
      overflow: visible !important;
      width: 100% !important;
      margin: 0;
      padding: 0;
    }
  }
`;

const PatentReport = () => {
  const context = useContext(Context.Context);
  const [patents, setPatents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;
  const navigate = useNavigate();

  useEffect(() => {
    context.data.getPatents(authUser.token)
      .then((response) => {
        const userPatents = response.filter(patent => patent.userid === authUser.id);
        setPatents(userPatents);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching patents', error);
        navigate('/error');
      });
  }, [navigate, context.data, authUser.id]);

  useEffect(() => {
    const handleBeforePrint = () => {
      const table = document.querySelector('table');
      if (table) {
        table.style.width = '100%';
        table.style.overflow = 'visible';
      }
    };

    window.addEventListener('beforeprint', handleBeforePrint);

    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <GlobalStyle />
      
      <div className="max-w-4xl mx-auto p-8 bg-white text-black">
        <h1 className="text-4xl font-bold mb-6 border-b-4 border-black pb-4 text-center">Patent Publications Report</h1>
        <div className="text-lg mb-6 border-b border-gray-300 pb-4">
          <p><strong>Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p><strong>Prepared By:</strong> Faculty Competence System</p>
        </div>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Information</h2>
          <p><strong>Name:</strong> {authUser.firstName} {authUser.lastName}</p>
          <p><strong>Affiliation:</strong> {authUser.affiliation}</p>
          <p><strong>Areas of Interest:</strong> {authUser.areasOfInterest}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="leading-relaxed text-justify">
            This report outlines the patent publications of {authUser.firstName} {authUser.lastName}. 
            It highlights their contributions to technological advancements and innovations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Patent Publication Details</h2>
          <div>
            <table className="w-full border-collapse border border-gray-400 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Title</th>
                  <th className="border border-gray-400 px-4 py-2">Inventors</th>
                  <th className="border border-gray-400 px-4 py-2">Publication Date</th>
                  <th className="border border-gray-400 px-4 py-2">Patent Office</th>
                  <th className="border border-gray-400 px-4 py-2">Patent Number</th>
                  <th className="border border-gray-400 px-4 py-2">Application Number</th>
                </tr>
              </thead>
              <tbody>
                {patents.map((patent) => (
                  <tr key={patent.id} className="hover:bg-gray-50">
                    <td className="border border-gray-400 px-4 py-2">{patent.title}</td>
                    <td className="border border-gray-400 px-4 py-2">{patent.inventors}</td>
                    <td className="border border-gray-400 px-4 py-2">{new Date(patent.publicationDate).toLocaleDateString('en-GB')}</td>
                    <td className="border border-gray-400 px-4 py-2">{patent.patentOffice}</td>
                    <td className="border border-gray-400 px-4 py-2">{patent.patentNumber}</td>
                    <td className="border border-gray-400 px-4 py-2">{patent.applicationNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Patent Highlights</h2>
          {patents.map((patent, index) => (
            <div key={index} className="mb-6 p-6 border border-gray-300 rounded-md">
              <h3 className="text-xl font-medium mb-2">{patent.title}</h3>
              <p className="mb-2"><strong>Inventors:</strong> {patent.inventors}</p>
              <p className="mb-2"><strong>Patent Office:</strong> {patent.patentOffice}</p>
              <p className="mb-2"><strong>Publication Date:</strong> {new Date(patent.publicationDate).toLocaleDateString('en-GB')}</p>
              <p className="mb-2"><strong>Patent Number:</strong> {patent.patentNumber}</p>
              <p className="mb-2"><strong>Application Number:</strong> {patent.applicationNumber}</p>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
          <p className="leading-relaxed text-justify">
            {authUser.firstName} {authUser.lastName} has made significant contributions to the field of technology 
            through their patent publications. Their innovative work has been recognized and patented, 
            reflecting their expertise and impact in their field.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Summary of Patents</h2>
          <p className="mb-2"><strong>Total Patents:</strong> {patents.length}</p>
        </section>
      </div>
    </>
  );
};

export default PatentReport;
