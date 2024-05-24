// components/Sidebar.js
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart, faArchive, faClipboardCheck, faUsers, faFolderOpen, faExclamation, faBars, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const navigation = [
  { name: 'Dashboard', href: '/', icon: faHome },
  { name: 'Products', href: '#', icon: faArchive, subItems: [
    { name: 'Product In', href: '/product/in' },
    { name: 'Product Out', href: '/product/out' },
    { name: 'Stock', href: '/stock' }
  ]},
  { name: 'Orders', href: '/order', icon: faShoppingCart },
  { name: 'Suppliers', href: '/supplier', icon: faUsers },
  { name: 'Rejected', href: '/rejected', icon: faExclamation },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex flex-col fixed inset-y-0 left-0 w-64 border-r overflow-y-auto">
      <div className="flex items-center justify-center h-16 border-b">
        <Link href="/">
          <span className="text-2xl font-bold">Your App</span>
        </Link>
      </div>
      <div className="flex-1">
        {navigation.map((item, index) => (
          <Fragment key={index}>
            <Link href={item.href}>
              <p className="flex items-center px-6 py-4">
                <FontAwesomeIcon icon={item.icon} className="w-6 h-6 mr-4" />
                <span>{item.name}</span>
                {item.subItems && (
                  <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    className="ml-auto w-4 h-4"
                    onClick={toggleSubMenu}
                  />
                )}
              </p>
            </Link>
            {isOpen && item.subItems && (
              <div className="pl-12">
                {item.subItems.map((subItem, subIndex) => (
                  <Link href={subItem.href} key={subIndex}>
                    <p className="flex items-center px-6 py-3">
                      <span className="ml-10">{subItem.name}</span>
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
