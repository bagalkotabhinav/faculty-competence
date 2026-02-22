import React, { useContext, useEffect, useState } from 'react';
import Context from '../Context';
import { useNavigate } from 'react-router-dom';
import { Building, Globe, BookOpen, Mail, Tag, FileText, PenTool, Book, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Component() {
  const context = useContext(Context.Context);
  const authUser = context.authenticatedUser;
  const navigate = useNavigate();  // Use the navigate hook

  const [counts, setCounts] = useState({
    courses: 0,
    journals: 0,
    books: 0,
    conferences: 0,
    patents: 0,
    events: 0
  });
  const [yearlyData, setYearlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      setIsLoading(true);

      const fetchData = async () => {
        try {
          const dataTypes = ['Courses', 'Journals', 'Books', 'Conferences', 'Patents', 'Events'];
          const fetchedData = await Promise.all(
            dataTypes.map(type => context.data[`get${type}`](authUser.token))
          );

          const filteredData = fetchedData.map((items, index) =>
            items.filter(item => item.userid === authUser.id)
          );

          const newCounts = Object.fromEntries(
            dataTypes.map((type, index) => [type.toLowerCase(), filteredData[index].length])
          );

          setCounts(newCounts);

          // Process yearly data from 2021 to 2024
          const currentYear = new Date().getFullYear();
          const pastFourYears = Array.from({ length: 4 }, (_, i) => currentYear - (3 - i)); // 2021 to 2024

          const calculateYearlyCount = (items) => {
            return pastFourYears.map(year => ({
              year,
              count: items.filter(item => new Date(item.publicationDate).getFullYear() === year).length
            }));
          };

          const yearlyCounts = {
            journals: calculateYearlyCount(filteredData[1]), // Journals
            conferences: calculateYearlyCount(filteredData[3]), // Conferences
            books: calculateYearlyCount(filteredData[2]), // Books
            patents: calculateYearlyCount(filteredData[4])  // Patents
          };

          // Combine yearly counts for all types
          const combinedYearlyData = pastFourYears.map(year => ({
            year,
            journals: yearlyCounts.journals.find(item => item.year === year)?.count || 0,
            conferences: yearlyCounts.conferences.find(item => item.year === year)?.count || 0,
            books: yearlyCounts.books.find(item => item.year === year)?.count || 0,
            patents: yearlyCounts.patents.find(item => item.year === year)?.count || 0,
          }));

          setYearlyData(combinedYearlyData);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data', error);
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [authUser, context.data]);

  if (!authUser) {
    return <div className="text-center p-8">No user data available.</div>;
  }

  const facultyData = {
    name: `${authUser.designation} ${authUser.firstName} ${authUser.lastName}`,
    affiliation: authUser.affiliation,
    homepage: authUser.homepage,
    interests: authUser.areasOfInterest,
    email: authUser.emailAddress
  };

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  const pieChartData = Object.entries(counts).map(([key, value]) => ({ name: key, value }));

  // Helper function to navigate to different pages
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">{facultyData.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Faculty Overview */}
          <div className="col-span-full bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Faculty Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-gray-500" />
                <span>{facultyData.affiliation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gray-500" />
                <a href={facultyData.homepage} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {facultyData.homepage}
                </a>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag className="h-5 w-5 text-gray-500" />
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                  {facultyData.interests}
                </span>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="col-span-full bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Distribution of Academic Activities</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Counts */}
          <div className="col-span-full grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: 'Courses', count: counts.courses, icon: BookOpen, color: 'text-green-500', route: '/courses' },
              { title: 'Journals', count: counts.journals, icon: FileText, color: 'text-orange-500', route: '/journals' },
              { title: 'Books', count: counts.books, icon: Book, color: 'text-purple-500', route: '/books' },
              { title: 'Conferences', count: counts.conferences, icon: Briefcase, color: 'text-red-500', route: '/conferences' },
              { title: 'Patents', count: counts.patents, icon: PenTool, color: 'text-pink-500', route: '/patents' },
              { title: 'Events', count: counts.events, icon: BookOpen, color: 'text-blue-500', route: '/events' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 cursor-pointer" // Add cursor pointer
                onClick={() => handleNavigation(item.route)} // Navigate on click
              >
                <h2 className="text-xl font-semibold mb-4">{item.title}</h2>
                <div className="flex items-center justify-between">
                  <item.icon className={`h-8 w-8 ${item.color}`} />
                  <span className="text-3xl font-bold">
                    {isLoading ? 'Loading...' : item.count}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Total {item.title.toLowerCase()}</p>
              </div>
            ))}
          </div>

          {/* Bar Chart for Publications per Year */}
          <div className="col-span-full bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Publications Per Year (2021-2024)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={yearlyData}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="journals" fill="#8884d8" name="Journals" />
                <Bar dataKey="conferences" fill="#82ca9d" name="Conferences" />
                <Bar dataKey="books" fill="#ffc658" name="Books" />
                <Bar dataKey="patents" fill="#ff8042" name="Patents" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart for Cumulative Publications */}
          <div className="col-span-full bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Cumulative Publications (2021-2024)</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={yearlyData}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="journals" stroke="#8884d8" name="Journals" />
                <Line type="monotone" dataKey="conferences" stroke="#82ca9d" name="Conferences" />
                <Line type="monotone" dataKey="books" stroke="#ffc658" name="Books" />
                <Line type="monotone" dataKey="patents" stroke="#ff8042" name="Patents" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Personal Information */}
          <div className="col-span-full bg-white rounded-lg shadow p-6"
          onClick={() => handleNavigation(`/user/${authUser.id}/update`)}>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{facultyData.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
