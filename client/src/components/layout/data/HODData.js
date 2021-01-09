import React from 'react'

import * as FAIcons from 'react-icons/fa'
import * as FiIcons from 'react-icons/fi'
import * as BiIcons from 'react-icons/bi'
import * as RiIcons from 'react-icons/ri'
import * as MdIcons from 'react-icons/md'
import * as BsIcons from 'react-icons/bs'
import * as HiIcons from 'react-icons/hi'


export const HODData = [
  {
  title: 'Schedule',
  path: '/schedule',
  icon: <BsIcons.BsCalendar />,
  iconClosed: <RiIcons.RiArrowDownSFill />,
  iconOpened: <RiIcons.RiArrowUpSFill />,
  
},
{
  title: 'Requests',
  path: '/requests',
  icon: <HiIcons.HiOutlineReceiptRefund />,
  iconClosed: <RiIcons.RiArrowDownSFill />,
  iconOpened: <RiIcons.RiArrowUpSFill />,
 
},
    {
      title: 'Instructor Assignment',
      path: '/assign-instr',
      icon: <RiIcons.RiUserSharedFill />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    },
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
      title: 'Staff day offs',
      path: '#',
      icon: <FAIcons.FaUserSlash />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'All staff dayoffs',
          path: '/staff-do',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Single staff dayoff',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        }
      ]
    },
    {
      title: 'Course Coverage',
      path: '/course-cov',
      icon: <MdIcons.MdAssignmentTurnedIn />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'Teaching Assignments',
      path: '/teach-assignments',
      icon: <FAIcons.FaChalkboardTeacher />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'Attendance',
      path: '/attendance',
      icon: <FAIcons.FaUserCheck />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    }
  ];