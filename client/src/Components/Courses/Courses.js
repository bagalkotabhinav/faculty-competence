import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Context from '../../Context';
import Loading from '../Loading';

const Courses = () => {
  const context = useContext(Context.Context);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authUser = context.authenticatedUser;
  let navigate = useNavigate();

  useEffect(() => {
    if (!authUser?.token) return;
    // Fetch courses
    context.data.getCourses(authUser.token)
      .then((response) => {
        const filteredCourses = response.filter(course => course.userid === authUser.id);
        setCourses(filteredCourses);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching courses', error);
        navigate('/error');
      });
  }, [navigate, context.data, authUser.id, authUser.token]);

  // Loading state
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Courses</h1>
      {/* Display the total number of courses */}
      <div className="mb-4 text-lg font-semibold text-gray-700">
        Total Courses: {courses.length}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
            </tr>
          </thead>
          
          <tbody>
            {courses.map((course) => (
              <tr
                key={course.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <td className="px-6 py-4 text-sm text-gray-800">{course.title}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{course.description}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{course.estimatedTime} hours</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Link to='/courses/create' className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          New Course
        </Link>
      </div>
    </div>
  );
}

export default Courses;
