import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Context from '../../Context';
import Loading from '../Loading';
import { Filter } from 'lucide-react';

const Events = () => {
  const context = useContext(Context.Context);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const authUser = context.authenticatedUser;
  let navigate = useNavigate();

  useEffect(() => {
    if (!authUser?.token) return;
    // Fetch events
    context.data.getEvents(authUser.token)
      .then((response) => {
        const userEvents = response.filter(event => event.userid === authUser.id);
        setEvents(userEvents);
        setFilteredEvents(userEvents);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching events', error);
        navigate('/error');
      });
  }, [navigate, context.data, authUser.id, authUser.token]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter((event) => {
      const eventDate = new Date(event.eventDate);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000); // Max date

      return eventDate >= start && eventDate <= end;
    });

    setFilteredEvents(filtered);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    if (!showFilter) {
      setStartDate('');
      setEndDate('');
      setFilteredEvents(events);
    }
  };

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Events</h1>

      <div className="mb-4 text-lg font-semibold text-gray-700">
        Total Events: {events.length}
      </div>
      
      {showFilter && (
        <div className="mb-6 flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            />
          </div>
          <button 
            onClick={handleFilter} 
            className="self-end px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Filter
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Event Type</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 flex items-center justify-between">
                Location
                <button
                  onClick={toggleFilter}
                  className="ml-2 p-1 bg-gray-300 rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  title="Toggle date filter"
                >
                  <Filter size={16} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr
                key={event.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <td className="px-6 py-4 text-sm text-gray-800">{event.title}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{event.description}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{event.eventType}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(event.eventDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{event.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Link to='/events/create' className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          New Event
        </Link>
      </div>
      <div className="mt-6">
        <Link to='/events/report' className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Generate Report
        </Link>
      </div>
    </div>
  );
}

export default Events;