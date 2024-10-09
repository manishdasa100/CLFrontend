import { Navbar, NavbarContent, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, NavbarItem, Link, Button } from "@nextui-org/react";
import Logo from '../assets/Logo.svg';

import { useState } from'react';

export default function AppNavbar() {
    const [user, setUser] = useState({
        username:'user1',
        email: 'user1@gmail.com',
        role:'USER',
        isLoggedIn: false,
        profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    })
    return (
        <Navbar className="py-1 bg-transparent border-stroke-gray/30">
            <div className='w-full flex justify-center items-center'>
                <NavbarContent className=""> 
                    <img src={Logo} className='flex-initial' alt='Logo'></img>
                    <NavbarItem>
                        <Link href="/arena/problemset" className="ml-4 font-medium text-primary-blue">Arena</Link>
                    </NavbarItem>    
                </NavbarContent>

                <NavbarContent as="div" justify="end">
                    {
                        user.isLoggedIn? 
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    color="primary"
                                    name="Manish Das"
                                    size="sm"
                                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Profile Actions" variant="flat">
                                <DropdownItem key="signedIn" className="h-14 gap-2">
                                    <p className="font-semibold">Signed in as</p>
                                    <p className="font-semibold">zoey@example.com</p>
                                </DropdownItem>
                                <DropdownItem key="profile">Visit profile</DropdownItem>
                                <DropdownItem key="logout">Log Out</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>:
                        <Button as={Link} href='/login' color='primary' variant='shadow' className='font-semibold'>Sign In</Button>
                    }
                </NavbarContent> 
            </div>
        </Navbar>
    )
}