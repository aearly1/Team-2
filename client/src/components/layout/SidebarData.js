import React from 'react'

import * as FAIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import * as RiIcons from 'react-icons/ri'
import * as BsIcons from 'react-icons/bs'
import * as MdIcons from 'react-icons/md'


export const SidebarData = [
    {
      title: 'View Staff',
      path: '#',
      icon: <RiIcons.RiFolderUserFill />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
      subNav: [
        {
          title: 'View all staff',
          path: '/view-staff',
          icon: <FAIcons.FaUsers />
        },
        {
          title: 'View course staff',
          path: '/course-staff',
          icon: <FAIcons.FaStreetView/>
        }
      ]
    },
    {
      title: 'Course Coverage',
      path: '/course-cov',
      icon: <MdIcons.MdAssignmentTurnedIn />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
  
    }
  ];