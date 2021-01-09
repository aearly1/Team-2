import React from 'react'

import * as FAIcons from 'react-icons/fa'
import * as FiIcons from 'react-icons/fi'
import * as BiIcons from 'react-icons/bi'
import * as RiIcons from 'react-icons/ri'
import * as MdIcons from 'react-icons/md'


export const InstrData = [
    {
      title: 'Faculty',
      path: '#',
      icon: <RiIcons.RiUserSharedFill />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Thingy 1',
          path: '/staff-do',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Thingy 2',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        },
        {
          title: 'Thingy 3',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        }
      ]
    },
    {
      title: 'Department',
      path: '#',
      icon: <RiIcons.RiFolderUserFill />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Thingy 1',
          path: '/staff-do',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Thingy 2',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        },
        {
          title: 'Thingy 3',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        }
      ]
    },
    {
      title: 'Location',
      path: '#',
      icon: <FAIcons.FaUserSlash />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Thingy 1',
          path: '/staff-do',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Thingy 2',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        },
        {
          title: 'Thingy 3',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        }
      ]
    },
    {
      title: 'Course',
      path: '#',
      icon: <MdIcons.MdAssignmentTurnedIn />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Thingy 1',
          path: '/staff-do',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Thingy 2',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        },
        {
          title: 'Thingy 3',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        }
      ]
    },
    {
      title: 'Staff Members',
      path: '#',
      icon: <FAIcons.FaChalkboardTeacher />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Thingy 1',
          path: '/staff-do',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Thingy 2',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        },
        {
          title: 'Thingy 3',
          path: '/staff-dos',
          icon: <BiIcons.BiMale/>
        }
      ]
    },
    {
      title: 'Attendance',
      path: '/attendance',
      icon: < FAIcons.FaUserCheck />,
      iconClosed: < RiIcons.RiArrowDownSFill />,
      iconOpened: < RiIcons.RiArrowUpSFill />,
    }
  ];