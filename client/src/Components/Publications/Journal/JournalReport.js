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

const JournalReport = () => {
  const context = useContext(Context.Context);
  const [journals, setJournals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;
  const navigate = useNavigate();

  useEffect(() => {
    context.data.getJournals(authUser.token)
      .then((response) => {
        const userJournals = response.filter(journal => journal.userid === authUser.id);
        setJournals(userJournals);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching journals', error);
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
        <h1 className="text-4xl font-bold mb-6 border-b-4 border-black pb-4 text-center">Journal Publications Report</h1>
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
            This report outlines the journal publications of {authUser.firstName} {authUser.lastName}. 
            It showcases their contributions to academic literature and research in various fields.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Journal Publication Details</h2>
          <div>
            <table className="w-full border-collapse border border-gray-400 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Title</th>
                  <th className="border border-gray-400 px-4 py-2">Authors</th>
                  <th className="border border-gray-400 px-4 py-2">Publication Date</th>
                  <th className="border border-gray-400 px-4 py-2">Journal</th>
                  <th className="border border-gray-400 px-4 py-2">Volume</th>
                  <th className="border border-gray-400 px-4 py-2">Issue</th>
                  <th className="border border-gray-400 px-4 py-2">Pages</th>
                  <th className="border border-gray-400 px-4 py-2">Publisher</th>
                </tr>
              </thead>
              <tbody>
                {journals.map((journal) => (
                  <tr key={journal.id} className="hover:bg-gray-50">
                    <td className="border border-gray-400 px-4 py-2">{journal.title}</td>
                    <td className="border border-gray-400 px-4 py-2">{journal.authors}</td>
                    <td className="border border-gray-400 px-4 py-2">{new Date(journal.publicationDate).toLocaleDateString('en-GB')}</td>
                    <td className="border border-gray-400 px-4 py-2">{journal.journal}</td>
                    <td className="border border-gray-400 px-4 py-2">{journal.volume}</td>
                    <td className="border border-gray-400 px-4 py-2">{journal.issue}</td>
                    <td className="border border-gray-400 px-4 py-2">{journal.pages}</td>
                    <td className="border border-gray-400 px-4 py-2">{journal.publisher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Publication Highlights</h2>
          {journals.map((journal, index) => (
            <div key={index} className="mb-6 p-6 border border-gray-300 rounded-md">
              <h3 className="text-xl font-medium mb-2">{journal.title}</h3>
              <p className="mb-2"><strong>Authors:</strong> {journal.authors}</p>
              <p className="mb-2"><strong>Journal:</strong> {journal.journal}</p>
              <p className="mb-2"><strong>Publication Date:</strong> {new Date(journal.publicationDate).toLocaleDateString('en-GB')}</p>
              <p className="mb-2"><strong>Volume:</strong> {journal.volume}, <strong>Issue:</strong> {journal.issue}, <strong>Pages:</strong> {journal.pages}</p>
              <p className="mb-2"><strong>Publisher:</strong> {journal.publisher}</p>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
          <p className="leading-relaxed text-justify">
            {authUser.firstName} {authUser.lastName} has demonstrated a significant contribution to academic literature 
            through their journal publications. Their work spans various topics and has been published in reputable journals, 
            showcasing their expertise and impact in their field of study.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Summary of Publications</h2>
          <p className="mb-2"><strong>Total Journal Publications:</strong> {journals.length}</p>
        </section>
      </div>
    </>
  );
};

export default JournalReport;