import { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCog, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from 'next-auth/react';

const DashboardHeader = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
      <header className="shadow-md bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-end items-center">
            <div className="flex items-center space-x-6">
              {session?.user && (
                  <div className="relative">
                    <button className="text-gray-800 focus:outline-none relative">
                      <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
                      <span className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                    </button>
                  </div>
              )}
              {session?.user && (
                  <div className="relative">
                    <Link href="/settings">
                      <button className="text-gray-800 focus:outline-none">
                        <FontAwesomeIcon icon={faCog} className="w-6 h-6" />
                      </button>
                    </Link>
                  </div>
              )}
              {session?.user && (
                  <div className="relative">
                    <button
                        className="flex items-center text-gray-800 focus:outline-none"
                        onClick={toggleDropdown}
                    >
                      <FontAwesomeIcon icon={faUserCircle} className="w-6 h-6 mr-2" />
                      <span>{session.user.name}</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md">
                          <Link href="/profile">
                            <span className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</span>
                          </Link>
                          <button
                              onClick={() => signOut()}
                              className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                          >
                            Log Out
                          </button>
                        </div>
                    )}
                  </div>
              )}
            </div>
          </div>
        </div>
      </header>
  );
};

export default DashboardHeader;
