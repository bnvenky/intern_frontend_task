/* eslint-disable react/prop-types */
import { Menu } from '@headlessui/react';
import { FaHome, FaQuestionCircle, FaBell, FaUser, FaSearch, FaChevronDown, FaBars } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom'; 

const Navbar = ({ currentView }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (view) => (currentView === `/${view}` ? 'text-blue-600' : 'text-gray-700');

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 p-6">
      <div className="container mx-auto flex items-center justify-between lg:flex-row">

        {/* Mobile Hamburger Menu Button (Left) */}
        <button aria-label="Toggle Menu" className="md:hidden text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={24} />
        </button>

        {/* Mobile Logo (Center) and Search Bar (Below Logo) */}
        <div className="md:hidden flex flex-col items-center m-4 space-y-3 flex-grow">
          <h1 className="text-xl font-bold">Logo</h1>
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search Setup"
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:border-blue-500"
              aria-label="Search"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Mobile Icons (Right) */}
        <div className="md:hidden flex items-center space-x-1">
          <FaHome className="text-gray-600 hover:text-blue-600 cursor-pointer" aria-label="Home" />
          <FaQuestionCircle className="text-gray-600 hover:text-blue-600 cursor-pointer" aria-label="Help" />
          <FaBell className="text-gray-600 hover:text-blue-600 cursor-pointer" aria-label="Notifications" />
          <FaUser className="text-gray-600 hover:text-blue-600 cursor-pointer" aria-label="Profile" />
        </div>

        {/* Desktop Logo and Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          <h1 className="text-xl font-bold">Logo</h1>
          <div className="flex space-x-20">
            <Link to="/interviews" className={`hover:text-blue-600 ${isActive('interviews')}`} aria-label="Interviews">
              Interviews
            </Link>
            <Link to="/assignments" className={`hover:text-blue-600 ${isActive('assignments')}`} aria-label="Assignments">
              Assignments
            </Link>
            <Link to="/analytics" className={`hover:text-blue-600 ${isActive('analytics')}`} aria-label="Analytics">
              Analytics
            </Link>
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center hover:text-blue-600" aria-label="More Options">
                More <FaChevronDown className="ml-1" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/candidates"
                      className={`${active ? 'bg-gray-100' : ''} ${isActive('candidates')} block px-4 py-2 w-full text-left`}
                      aria-label="Candidates"
                    >
                      Candidates
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/positions"
                      className={`${active ? 'bg-gray-100' : ''} ${isActive('positions')} block px-4 py-2 w-full text-left`}
                      aria-label="Positions"
                    >
                      Positions
                    </Link>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>

        {/* Desktop Icons and Search Bar */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative w-50 md:w-80">
            <input
              type="text"
              placeholder="Search Setup"
              className="pl-10 pr-4 py-2 border w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <FaHome className="text-gray-600 hover:text-blue-600 cursor-pointer" aria-label="Home" />
          <FaQuestionCircle className="text-gray-600 hover:text-blue-600 cursor-pointer" aria-label="Help" />
          <FaBell className="text-gray-600 hover:text-blue-600 cursor-pointer" aria-label="Notifications" />
          <FaUser className="text-gray-600 hover:text-blue-600 cursor-pointer" aria-label="Profile" />
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          {/* Mobile Navigation Links */}
          <Link to="/interviews" className={`block w-full text-left ${isActive('interviews')} p-2`} aria-label="Interviews">
            Interviews
          </Link>
          <Link to="/assignments" className={`block w-full text-left ${isActive('assignments')} p-2`} aria-label="Assignments">
            Assignments
          </Link>
          <Link to="/analytics" className={`block w-full text-left ${isActive('analytics')} p-2`} aria-label="Analytics">
            Analytics
          </Link>
          <Menu as="div" className="relative">
              <Menu.Button className="flex items-center p-2 hover:text-blue-600" aria-label="More Options">
                More <FaChevronDown className="ml-1" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/candidates"
                      className={`${active ? 'bg-gray-100' : ''} ${isActive('candidates')} block px-4 py-2 w-full text-left`}
                      aria-label="Candidates"
                    >
                      Candidates
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/positions"
                      className={`${active ? 'bg-gray-100' : ''} ${isActive('positions')} block px-4 py-2 w-full text-left`}
                      aria-label="Positions"
                    >
                      Positions
                    </Link>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
