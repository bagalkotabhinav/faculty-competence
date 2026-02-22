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

const ConferenceReport = () => {
  const context = useContext(Context.Context);
  const [conferences, setConferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;
  const navigate = useNavigate();

  useEffect(() => {
    context.data.getConferences(authUser.token)
      .then((response) => {
        const userConferences = response.filter(conference => conference.userid === authUser.id);
        setConferences(userConferences);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching conferences', error);
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
        <h1 className="text-4xl font-bold mb-6 border-b-4 border-black pb-4 text-center">Conference Publications Report</h1>
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
            This report outlines the conference publications of {authUser.firstName} {authUser.lastName}. 
            It highlights their contributions to the field of academic conferences and research presentations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Conference Publication Details</h2>
          <div>
            <table className="w-full border-collapse border border-gray-400 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Title</th>
                  <th className="border border-gray-400 px-4 py-2">Authors</th>
                  <th className="border border-gray-400 px-4 py-2">Publication Date</th>
                  <th className="border border-gray-400 px-4 py-2">Conference</th>
                  <th className="border border-gray-400 px-4 py-2">Volume</th>
                  <th className="border border-gray-400 px-4 py-2">Issue</th>
                  <th className="border border-gray-400 px-4 py-2">Pages</th>
                </tr>
              </thead>
              <tbody>
                {conferences.map((conference) => (
                  <tr key={conference.id} className="hover:bg-gray-50">
                    <td className="border border-gray-400 px-4 py-2">{conference.title}</td>
                    <td className="border border-gray-400 px-4 py-2">{conference.authors}</td>
                    <td className="border border-gray-400 px-4 py-2">{new Date(conference.publicationDate).toLocaleDateString('en-GB')}</td>
                    <td className="border border-gray-400 px-4 py-2">{conference.conference}</td>
                    <td className="border border-gray-400 px-4 py-2">{conference.volume}</td>
                    <td className="border border-gray-400 px-4 py-2">{conference.issue}</td>
                    <td className="border border-gray-400 px-4 py-2">{conference.pages}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Conference Highlights</h2>
          {conferences.map((conference, index) => (
            <div key={index} className="mb-6 p-6 border border-gray-300 rounded-md">
              <h3 className="text-xl font-medium mb-2">{conference.title}</h3>
              <p className="mb-2"><strong>Authors:</strong> {conference.authors}</p>
              <p className="mb-2"><strong>Conference:</strong> {conference.conference}</p>
              <p className="mb-2"><strong>Publication Date:</strong> {new Date(conference.publicationDate).toLocaleDateString('en-GB')}</p>
              <p className="mb-2"><strong>Volume:</strong> {conference.volume}</p>
              <p className="mb-2"><strong>Issue:</strong> {conference.issue}</p>
              <p className="mb-2"><strong>Pages:</strong> {conference.pages}</p>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
          <p className="leading-relaxed text-justify">
            {authUser.firstName} {authUser.lastName} has made significant contributions to academic conferences 
            through their presentations and papers. Their participation in various conferences reflects their expertise 
            and impact in their field of research.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Summary of Publications</h2>
          <p className="mb-2"><strong>Total Conference Publications:</strong> {conferences.length}</p>
        </section>
      </div>
    </>
  );
};

export default ConferenceReport;
