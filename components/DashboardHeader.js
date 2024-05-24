import { Fragment } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCog, faBell } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';

const DashboardHeader = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-end items-center">
          <div className="flex items-center">
            {session?.user && (
              <div className="flex items-center mr-6">
                <div className="relative">
                  <button className="text-gray-800 focus:outline-none">
                    <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
                  </button>
                  <span className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                </div>
                <div className="ml-6">
                  <Link href="/settings">
                    <button className="text-gray-800 focus:outline-none">
                      <FontAwesomeIcon icon={faCog} className="w-6 h-6" />
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {session?.user && (
              <div className="flex items-center">
                <Link href="/profile">
                  <p className="text-gray-800 hover:text-gray-600 flex items-center">
                    <FontAwesomeIcon icon={faUserCircle} className="w-6 h-6 mr-2" />
                    <span>{session.user.name}</span>
                  </p>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
