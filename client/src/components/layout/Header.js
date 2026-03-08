import React, { useState, useContext } from 'react';
import { Menu, X, LogOut, Book, Newspaper, Calendar, Home, User, Briefcase, PenTool } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Context from '../../Context';

const CustomButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md transition-colors duration-200 ${className}`}
  >
    {children}
  </button>
);

const Header = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const context = useContext(Context.Context);
  const authUser = context.authenticatedUser;

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = () => {
    navigate('/signout');
  };

  const handleLinkClick = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (

    <header className="bg-gray-800 text-white p-4">

      <div className="container mx-auto flex justify-between items-center">

        <div className="flex items-center">

          {authUser && (
            <CustomButton onClick={toggleSidebar} className="text-white hover:bg-gray-700">
              <Menu className="h-6 w-6" />
            </CustomButton>
          )}

          <h1 className="ml-4 text-xl font-bold">
            {authUser
              ? `Welcome, ${authUser.designation} ${authUser.firstName} ${authUser.lastName}!`
              : 'Faculty Competence System'}
          </h1>

        </div>

        {!authUser && (
          <div>

            <Link to="/signin">
              <CustomButton className="bg-blue-600 hover:bg-blue-700 text-white mr-2">
                Sign In
              </CustomButton>
            </Link>

            <Link to="/signup">
              <CustomButton className="bg-green-600 hover:bg-green-700 text-white">
                Sign Up
              </CustomButton>
            </Link>

          </div>
        )}

      </div>

      {/* Sidebar */}

      {authUser && (

        <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 p-4 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

          <CustomButton
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white hover:bg-gray-800"
          >
            <X className="h-6 w-6" />
          </CustomButton>

          <nav className="mt-8">

            <ul className="space-y-4">

              <li>
                <CustomButton
                  onClick={() => handleLinkClick('/dashboard')}
                  className="w-full text-left text-white hover:bg-gray-800"
                >
                  <Home className="inline-block mr-2 h-4 w-4" />
                  Dashboard
                </CustomButton>
              </li>

              <li>
                <CustomButton
                  onClick={() => handleLinkClick('/courses')}
                  className="w-full text-left text-white hover:bg-gray-800"
                >
                  <Book className="inline-block mr-2 h-4 w-4" />
                  Courses
                </CustomButton>
              </li>

              <li>
                <CustomButton
                  onClick={() => handleLinkClick('/journals')}
                  className="w-full text-left text-white hover:bg-gray-800"
                >
                  <Newspaper className="inline-block mr-2 h-4 w-4" />
                  Journals
                </CustomButton>
              </li>

              <li>
                <CustomButton
                  onClick={() => handleLinkClick('/books')}
                  className="w-full text-left text-white hover:bg-gray-800"
                >
                  <Book className="inline-block mr-2 h-4 w-4" />
                  Books
                </CustomButton>
              </li>

              <li>
                <CustomButton
                  onClick={() => handleLinkClick('/conferences')}
                  className="w-full text-left text-white hover:bg-gray-800"
                >
                  <Briefcase className="inline-block mr-2 h-4 w-4" />
                  Conferences
                </CustomButton>
              </li>

              <li>
                <CustomButton
                  onClick={() => handleLinkClick('/patents')}
                  className="w-full text-left text-white hover:bg-gray-800"
                >
                  <PenTool className="inline-block mr-2 h-4 w-4" />
                  Patents
                </CustomButton>
              </li>

              <li>
                <CustomButton
                  onClick={() => handleLinkClick('/events')}
                  className="w-full text-left text-white hover:bg-gray-800"
                >
                  <Calendar className="inline-block mr-2 h-4 w-4" />
                  Events
                </CustomButton>
              </li>

              <li>
                <CustomButton
                  onClick={() => handleLinkClick(`/user/${authUser.id}/update`)}
                  className="w-full text-left text-white hover:bg-gray-800"
                >
                  <User className="inline-block mr-2 h-4 w-4" />
                  Update Profile
                </CustomButton>
              </li>

              <li>
                <CustomButton
                  onClick={handleSignOut}
                  className="w-full text-left bg-red-600 hover:bg-red-700 text-white"
                >
                  <LogOut className="inline-block mr-2 h-4 w-4" />
                  Sign Out
                </CustomButton>
              </li>

            </ul>

          </nav>

        </div>

      )}

    </header>
  );
};

export default Header;