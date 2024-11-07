// components/Navbar.tsx
// import { MessageCircleIcon } from 'lucide-react';
// import { Link } from 'react-router-dom';


import { Disclosure, DisclosureButton, MenuButton, Menu, MenuItems, DisclosurePanel, MenuItem } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { MessageCircleIcon, Users } from 'lucide-react';
import { Link } from 'react-router-dom';


const Navbar = () => {
  // function classNames(...classes) {
  //   return classes.filter(Boolean).join(' ')
  // }





  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4 text-white">

                  {/* {navigation.map((item) => ( */}
                  {/* <a */}

                  <Link to="/" className="hover:text-blue-600" >Home</Link>
                  <Link to="/arcade" className="hover:text-blue-600">Arcade</Link>
                  <Link to="/users" className="hover:text-blue-600">Users</Link>
                  <Link to="/login" className="hover:text-blue-600">Login</Link>
                  <Link to="/signup" className="hover:text-blue-600">Sign Up</Link>

                  {/* // key={item.name}
                  // href={item.href}
                  // aria-current={item.current ? 'page' : undefined}
            // /      className={classNames( */}
                  {/* //         item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            //         'rounded-md px-3 py-2 text-sm font-medium', */}
                  {/* className=
                    'bg-gray-900 text-white'  */}
                  {/* > */}

                  {/* {item.name} */}

                </div>
              </div>
            </div>
            {/* <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"> */}
            <div className="flex space-x-4 text-white">

            <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >

              <Link to="/chat" className="hover:text-blue-600"><MessageCircleIcon /></Link>
              </button>

              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >

              <Link to="/friends" className="hover:text-blue-600">
                <Users className="h-5 w-5" />
              </Link>

              </button>


              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
            {/* {navigation.map((item) => ( */}
            <DisclosureButton
            // key={item.name}
            // as="a"
            // href={item.href}
            // aria-current={item.current ? 'page' : undefined}
            // className={classNames(
            //   item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            //   'block rounded-md px-3 py-2 text-base font-medium',
            // )}
            >
              {/* {item.name} */}
            </DisclosureButton>
            {/* ))} */}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>



    // <nav className="bg-white shadow-lg">
    //   <div className="container mx-auto px-4">
    //     <div className="flex justify-between items-center h-16">
    //       <Link to="/" className="font-bold text-xl">Logo</Link>

    //       <div className="flex space-x-4">
    //       <Link to="/chat" className="hover:text-blue-600"><MessageCircleIcon/></Link>
    //         <Link to="/" className="hover:text-blue-600">Home</Link>
    //         <Link to="/arcade" className="hover:text-blue-600">Arcade</Link>
    //         <Link to="/" className="hover:text-blue-600">Library</Link>
    //         <Link to="/login" className="hover:text-blue-600">Login</Link>
    //         <Link to="/signup" className="hover:text-blue-600">Sign Up</Link>
    //       </div>
    //     </div>
    //   </div>
    // </nav>
  );
};

export default Navbar;