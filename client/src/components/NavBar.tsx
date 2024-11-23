import { Disclosure, DisclosureButton, MenuButton, Menu, MenuItems, DisclosurePanel, MenuItem } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { MessageCircleIcon, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Images/logo.png'


const Navbar = () => {



  return (
    <>
      <Disclosure as="nav" className="fixed top-0 left-10 right-0 transition-all duration-300 ">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-white">
                <span className="absolute" />
                <span className="sr-only">Open main menu</span>
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  src={Logo}
                  className="h-14 w-16"
                />
              </div>

              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">

                  <Link to="/" className="hover:text-green-600" >Browse</Link>
                  <Link to="/arcade" className="hover:text-green-600">Arcade</Link>
                  <Link to="/games" className="hover:text-green-600">Games</Link>
                  <Link to="/timeline" className="hover:text-green-600">Timeline</Link>

                  {/* Search Bar */}
                  <div className="hidden md:block relative w-64">
                    <input
                      type="text"
                      placeholder="Search games..."
                      className="w-full bg-transparent text-white px-4 py-2 pl-10 rounded-full 
                            border-2 border-gray-800 focus:border-green-700 outline-none
                            transition-all duration-300"
                    />
                    <Search className="absolute left- top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>

                </div>
              </div>
            </div>
            <div className="flex space-x-4 text-white">

              <button
                type="button"
                className="relative text-gray-400"
              >

                <Link to="/chat" className="hover:text-green-600"><MessageCircleIcon />
                </Link>
              </button>

              <button
                type="button"
                className="relative text-gray-400"
              >
                <Link to="/friends" className="hover:text-green-600">
                  <Users className="h-5 w-5" />
                </Link>

              </button>
              <button
                type="button"
                className="relative text-gray-400"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>
              <Link to="/login" className="hover:text-green-600">Login</Link>
              <Link to="/signup" className="hover:text-green-600">Sign Up</Link>
              <Link to="/dashboard" className="hover:text-green-600">Dashboard</Link>
              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3 pr-2">
                <div>
                  <MenuButton className="relative flex rounded-full focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src="https://content.api.news/v3/images/bin/75c40e54349fe16f5fa09dc6922d1fc8?width=1024"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                >
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Your Profile
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                    >
                      Sign out
                    </a>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
          </div>
        </DisclosurePanel>
      </Disclosure>

    </>
  );
};

export default Navbar;