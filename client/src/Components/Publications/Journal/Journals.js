import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Context from '../../../Context';
import Loading from '../../Loading';
import { Filter } from 'lucide-react';

const Journals = () => {
  const context = useContext(Context.Context);
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const authUser = context.authenticatedUser;
  let navigate = useNavigate();

  useEffect(() => {
    if (!authUser?.token) return;
    // Fetch journals
    context.data.getJournals(authUser.token)
      .then((response) => {
        const filteredJournals = response.filter(journal => journal.userid === authUser.id);
        setJournals(filteredJournals);
        setFilteredJournals(filteredJournals);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching journals', error);
        navigate('/error');
      });
  }, [navigate, context.data, authUser.id, authUser.token]);

  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredJournals(journals);
      return;
    }

    const filtered = journals.filter((journal) => {
      const journalDate = new Date(journal.publicationDate);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000); // Max date

      return journalDate >= start && journalDate <= end;
    });

    setFilteredJournals(filtered);
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
    if (!showFilter) {
      setStartDate('');
      setEndDate('');
      setFilteredJournals(journals);
    }
  };

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Journals</h1>

      <div className="mb-4 text-lg font-semibold text-gray-700">
        Total Journals: {journals.length}
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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Authors</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Journal</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Publication Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 flex items-center justify-between">
                Volume
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Issue</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Pages</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Publisher</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
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
            {filteredJournals.map((journal) => (
              <tr
                key={journal.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/journals/${journal.id}`)}
              >
                <td className="px-6 py-4 text-sm text-gray-800">{journal.title}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{journal.authors}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{journal.journal}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{new Date(journal.publicationDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{journal.volume}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{journal.issue}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{journal.pages}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{journal.publisher}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Link to='/journals/create' className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          New Journal
        </Link>
      </div>
      <div className="mt-6">
        <Link to='/journals/report' className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Generate Report
        </Link>
      </div>
    </div>
  );
}

export default Journals;