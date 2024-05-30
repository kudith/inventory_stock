import Link from 'next/link';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faArchive, faUsers, faExclamation, faBars, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: faHome },
    { name: 'Products', href: '#', icon: faArchive, subItems: [
            { name: 'Products', href: '/products', },
            { name: 'Product In', href: '/transaksi_masuk' },
            { name: 'Product Out', href: '/transaksi_keluar_page' },
            { name: 'Stock', href: '/stock' }
        ]},
    { name: 'Suppliers', href: '/supplier_page', icon: faUsers },
    { name: 'Rejected', href: '/rejected', icon: faExclamation },
];

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleSubMenu = (index) => {
        setOpenSubMenu(openSubMenu === index ? null : index);
    };

    return (
        <div className="flex min-h-screen max-w-2xl">
            <header className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white fixed w-full z-10 md:w-64">
                <span className="text-2xl font-bold">DigitalZen</span>
                <button onClick={toggleSidebar} className="md:hidden">
                    <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} className="w-6 h-6" />
                </button>
            </header>
            <nav className={`fixed inset-y-0 left-0 bg-white shadow-lg border-r overflow-y-auto transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 z-20`}>
                <div className="flex items-center justify-between h-16 border-b px-4 md:justify-center">
                    <Link href="/">
                        <span className="text-2xl font-bold">DigitalZen</span>
                    </Link>
                    <button onClick={toggleSidebar} className="md:hidden">
                        <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1">
                    {navigation.map((item, index) => (
                        <div key={index}>
                            <div onClick={() => item.subItems ? toggleSubMenu(index) : null} className="cursor-pointer flex items-center px-6 py-4 hover:bg-gray-200 transition-colors duration-200">
                                <FontAwesomeIcon icon={item.icon} className="w-6 h-6 mr-4" />
                                <Link href={item.href}>
                                    <span>{item.name}</span>
                                </Link>
                                {item.subItems && (
                                    <FontAwesomeIcon
                                        icon={openSubMenu === index ? faChevronUp : faChevronDown}
                                        className="ml-auto w-4 h-4"
                                    />
                                )}
                            </div>
                            {openSubMenu === index && item.subItems && (
                                <div className="pl-12">
                                    {item.subItems.map((subItem, subIndex) => (
                                        <Link href={subItem.href} key={subIndex}>
                                            <p className="flex items-center px-6 py-3 hover:bg-gray-100 transition-colors duration-200">
                                                <span className="ml-10">{subItem.name}</span>
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </nav>
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={toggleSidebar}></div>}
        </div>
    );
};

export default Sidebar;
