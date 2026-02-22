import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Context from '../../Context';
import Loading from '../Loading';

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

const EventReport = () => {
  const context = useContext(Context.Context);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser?.token) return;
    context.data.getEvents(authUser.token)
      .then((response) => {
        const userEvents = response.filter(event => event.userid === authUser.id);
        setEvents(userEvents);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching events', error);
        navigate('/error');
      });
  }, [navigate, context.data, authUser.id, authUser.token]);

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

  const calculateEventTypes = () => {
    const types = {};
    events.forEach(event => {
      types[event.eventType] = (types[event.eventType] || 0) + 1;
    });
    return types;
  };

  const calculateParticipationTypes = () => {
    const types = {};
    events.forEach(event => {
      types[event.participationType] = (types[event.participationType] || 0) + 1;
    });
    return types;
  };

  const calculateOtherEventTypes = (eventTypes) => {
    const excludeTypes = ['Conference', 'Seminar', 'Workshop'];
    let count = 0;
    for (const [type, num] of Object.entries(eventTypes)) {
      if (!excludeTypes.includes(type)) {
        count += num;
      }
    }
    return count;
  };

  if (isLoading) {
    return <Loading />;
  }

  const eventTypes = calculateEventTypes();
  const participationTypes = calculateParticipationTypes();
  const otherEventTypesCount = calculateOtherEventTypes(eventTypes);

  return (
    <>
      <GlobalStyle />
      
      <div className="max-w-4xl mx-auto p-8 bg-white text-black">
        <h1 className="text-4xl font-bold mb-6 border-b-4 border-black pb-4 text-center">Event Report</h1>
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
            This report outlines the events in which {authUser.firstName} {authUser.lastName} has participated, organized, or attended. 
            It highlights their involvement in academic and professional activities, showcasing contributions and engagement across various domains.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
          <div>
            <table className="w-full border-collapse border border-gray-400 text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Event Title</th>
                  <th className="border border-gray-400 px-4 py-2">Event Type</th>
                  <th className="border border-gray-400 px-4 py-2">Participation Type</th>
                  <th className="border border-gray-400 px-4 py-2">Date</th>
                  <th className="border border-gray-400 px-4 py-2">Location</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="border border-gray-400 px-4 py-2">{event.title}</td>
                    <td className="border border-gray-400 px-4 py-2">{event.eventType}</td>
                    <td className="border border-gray-400 px-4 py-2">{event.participationType}</td>
                    <td className="border border-gray-400 px-4 py-2">{new Date(event.eventDate).toLocaleDateString('en-GB')}</td>
                    <td className="border border-gray-400 px-4 py-2">{event.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Event Analysis</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Event Types:</h3>
              <ul className="list-disc list-inside ml-4">
                {Object.entries(eventTypes).map(([type, count], index) => (
                  <li key={index}><strong>{type}:</strong> {count}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Participation Types:</h3>
              <ul className="list-disc list-inside ml-4">
                {Object.entries(participationTypes).map(([type, count], index) => (
                  <li key={index}><strong>{type}:</strong> {count}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Event Highlights</h2>
          {events.map((event, index) => (
            <div key={index} className="mb-6 p-6 border border-gray-300 rounded-md">
              <h3 className="text-xl font-medium mb-2">{event.title}</h3>
              <p className="mb-2"><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString('en-GB')}</p>
              {event.description}
              <p className="font-bold"><strong>Role:</strong> {event.participationType}</p>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Conclusion</h2>
          <p className="leading-relaxed text-justify">
            {authUser.firstName} {authUser.lastName} has shown consistent involvement in various events, demonstrating a commitment to professional growth and 
            active participation in the academic community. Their diverse roles highlight their leadership and engagement in knowledge-sharing activities.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Summary of Participation</h2>
          <p className="mb-2"><strong>Total Events Attended:</strong> {events.length}</p>
          <ul className="list-disc list-inside ml-4">
            <li><strong>Conferences:</strong> {eventTypes['Conference'] || 0}</li>
            <li><strong>Workshops:</strong> {eventTypes['Workshop'] || 0}</li>
            <li><strong>Seminars:</strong> {eventTypes['Seminar'] || 0}</li>
            <li><strong>Others:</strong> {otherEventTypesCount}</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default EventReport;
