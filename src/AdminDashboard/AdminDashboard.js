import React, { useState, useEffect } from 'react'
import { cn } from "../lib/utils"
import ARKTab from './DashboardTabs/ARKTab'
import UserList from '../UserList/UserList'
import CallsTable from '../CallList/CallList'
import RefTexts from '../components/RefTexts'
import { useAdmin } from '../contexts/useData'
import PlansTab from './DashboardTabs/PlansTab'
import GamesTab from './DashboardTabs/GamesTab'
import UsersTab from './DashboardTabs/UsersTab'
import EventsTab from './DashboardTabs/EventsTab'
import OffersTab from './DashboardTabs/OffersTab'
import ConnectTab from './DashboardTabs/ConnectTab'
import ContentTab from './DashboardTabs/ContentTab'
import ClubSukoon from './DashboardTabs/ClubSukoon'
import SaarthisTab from './DashboardTabs/ExpertsTab'
import WhatsappTab from './DashboardTabs/WhatsappTab'
import LazyLoad from '../components/LazyLoad/lazyload'
import ReferralsTab from './DashboardTabs/ReferralsTab'
import DashboardTab from './DashboardTabs/DashboardTab'
import VacationsTab from './DashboardTabs/VacationsTab'
import ThemeToggle from '../components/ThemeToggle/toggle'
import ApplicationsTab from './DashboardTabs/ApplicationsTab'
import PlatformCategory from '../components/PlatformCategory'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, PhoneCall, Calendar, Club, FileCode, LogOut } from 'lucide-react'


const AdminDashboard = ({ onLogout }) => {
  const { admin } = useAdmin()
  const [showMenu, setShowMenu] = useState(false)
  const [openGroups, setOpenGroups] = useState([])
  const location = useLocation()
  const menuItems = [
    {
      href: 'dashboards',
      icon: <LayoutDashboard className="h-4 w-4" />,
      items: [
        { href: 'dashboard', component: <DashboardTab /> },
        { href: 'users', component: <UsersTab /> },
      ],
    },
    {
      href: 'lists',
      icon: <Users className="h-4 w-4" />,
      items: [
        { href: 'calls list', component: <CallsTable /> },
        { href: 'users list', component: <UserList /> },
        { href: 'experts list', component: <SaarthisTab /> },
        { href: 'vacations', component: <VacationsTab /> },
        { href: 'applications', component: <ApplicationsTab /> },
        { href: 'app categories', component: <PlatformCategory /> },
      ],
    },
    {
      href: 'communication',
      icon: <PhoneCall className="h-4 w-4" />,
      items: [
        ...(admin.access_level === 'super' || admin.access_level === 'admin' ? [
          { href: 'ark', component: <ARKTab /> },
        ] : []),
        { href: 'Connect', component: <ConnectTab /> },
        { href: 'whatsapp', component: <WhatsappTab /> },
        { href: 'Referral Texts', component: <RefTexts /> },
      ],
    },
    {
      href: 'events',
      icon: <Calendar className="h-4 w-4" />,
      items: [
        { href: 'events', component: <EventsTab /> },
        { href: 'contribute', component: <EventsTab contribute={true} /> }
      ],
    },
    {
      href: 'offers',
      icon: <Club className="h-4 w-4" />,
      items: [
        { href: 'plans', component: <PlansTab /> },
        { href: 'club', component: <ClubSukoon /> },
        { href: 'offers', component: <OffersTab /> },
        { href: 'referrals', component: <ReferralsTab /> },
      ],
    },
    {
      href: 'content',
      icon: <FileCode className="h-4 w-4" />,
      items: [
        { href: 'content', component: <ContentTab /> },
        { href: 'games', component: <GamesTab /> },
      ]
    },
  ]

  useEffect(() => {
    const activeTab = location.pathname.split('/').pop()
    localStorage.setItem('adminActiveTab', activeTab)
  }, [location])

  const onMenuToggle = () => setShowMenu(!showMenu)

  const toggleGroup = (href) => {
    setOpenGroups(prev =>
      prev.includes(href)
        ? prev.filter(t => t !== href)
        : [...prev, href]
    )
  }

  const pages = menuItems.flatMap(group => group.items ? group.items : [group])
  const isCurrentPath = (href) => location.pathname.replace('%20', ' ').endsWith(href);

  return (
    <LazyLoad>
      <div className="flex flex-row">
        {!showMenu ? (
          <div
            className="fixed z-50 left-0 top-0 rounded-r-full rounded-br-full h-screen cursor-pointer bg-black/50 flex items-center dark:bg-lightBlack"
            onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
            <ChevronRight className="h-6 w-6" />
          </div>
        ) : (
          <div
            className={cn(
              "fixed z-50 left-0 top-0 flex flex-row w-screen backdrop-blur-md transition-transform duration-500",
              showMenu ? "slide-in" : "slide-out"
            )}
            onClick={onMenuToggle}
          >
            <div
              className={cn(
                "flex flex-col h-screen cshadow p-4 w-64 bg-white dark:bg-darkBlack rounded-r-3xl",
                showMenu ? "slide-in" : "slide-out"
              )}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">Sukoon Unlimited</h2>
                </div>
                <nav className="flex-1 space-y-2 overflow-y-auto">
                  {menuItems.map((group) => (
                    <div key={group.href} className="space-y-1">
                      {group.items ? (
                        <>
                          <button
                            onClick={() => toggleGroup(group.href)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-md font-medium hover:bg-zinc-100 dark:hover:bg-lightBlack",
                              openGroups.includes(group.href) && "bg-zinc-100 dark:bg-lightBlack"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              {group.icon}
                              <span>{group.href.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                            </div>
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 transition-transform",
                                openGroups.includes(group.href) && "rotate-90"
                              )}
                            />
                          </button>
                          {openGroups.includes(group.href) && (
                            <div className="ml-7 space-y-1">
                              {group.items.map((item) => (
                                <Link
                                  key={item.href}
                                  to={`/admin/home/${item.href}`}
                                  className={cn(
                                    "rounded-lg px-3 py-2 text-md flex items-center font-medium hover:bg-zinc-100 dark:hover:bg-lightBlack",
                                    isCurrentPath(item.href) && "bg-zinc-100 dark:bg-lightBlack text-primary"
                                  )}
                                  onClick={onMenuToggle}
                                >
                                  {item.href.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          to={`/admin/home/${group.href}`}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-md font-medium hover:bg-zinc-100 dark:hover:bg-lightBlack",
                            isCurrentPath(group.href) && "bg-zinc-100 dark:bg-lightBlack text-primary"
                          )}
                          onClick={onMenuToggle}
                        >
                          {group.icon}
                          <span>{group.href.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
                <div className='flex flex-col justify-start gap-5'>
                  <ThemeToggle />
                  <div onClick={onLogout}
                    className="flex cursor-pointer items-center gap-3 hover:bg-zinc-100 dark:hover:bg-lightBlack rounded-lg px-3 py-2 text-md font-medium">
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center w-screen h-screen cursor-pointer">
              <ChevronLeft className="h-6 w-6" />
            </div>
          </div>
        )}
        <div className="flex-1 pl-10 min-h-screen overflow-auto">
          <Routes>
            {pages.map(({ href, component }) => (
              <Route key={href} path={href} element={component} />
            ))}
            <Route path="/" element={<Navigate to="/admin/home/dashboard" />} />
          </Routes>
        </div>
      </div>
    </LazyLoad>
  )
}

export default AdminDashboard

