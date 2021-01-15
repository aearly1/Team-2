import React from 'react'

import * as FAIcons from 'react-icons/fa'
import * as FiIcons from 'react-icons/fi'
import * as HiIcons from 'react-icons/hi'
import * as BiIcons from 'react-icons/bi'
import * as BsIcons from 'react-icons/bs'
import * as RiIcons from 'react-icons/ri'
import * as MdIcons from 'react-icons/md'


export const InstrData = [
    {
      title: 'Schedule', // in both
      path: '/schedule',
      icon: <BsIcons.BsCalendar />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      
    },
    {
      title: 'Requests', //in both
      path: '/requests',
      icon: <HiIcons.HiOutlineReceiptRefund />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    
    },
    {
      title: 'Course Coverage', //in both
      path: '/view-course-coverage',
      icon: <RiIcons.RiUserSharedFill />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'View slot assignments', //in both
      path: '/view-slot-assign-course',
      icon: <RiIcons.RiFolderUserFill />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'View staff',//in both
      path: '#',
      icon: <FAIcons.FaUserSlash />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'View department staff',
          path: '/view-staff-dep',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'View course staff',
          path: '/view-staff-course',
          icon: <BiIcons.BiMale/>
        }
      ]
    },
    {
      title: 'Course slot assignments',
      path: '#',
      icon: <FAIcons.FaUserSlash />,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Assign slot',
          path: '/assign-course',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Update assignment',
          path: '/update-assign',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Delete assignment',
          path: '/delete-assign',
          icon: <BiIcons.BiMale/>
        }
      ]
    },
    {
      title:      'Remove academic',
      path:       '/remove-academicMember',
      icon:       < FAIcons.FaUserCheck />,
      iconClosed: < RiIcons.RiArrowDownSFill />,
      iconOpened: < RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'Assign Coordinator',
      path: '/assign-academic',
      icon: < FAIcons.FaUserCheck />,
      iconClosed: < RiIcons.RiArrowDownSFill />,
      iconOpened: < RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'Attendance',
      path: '/attendance',
      icon: < FAIcons.FaUserCheck />,
      iconClosed: < RiIcons.RiArrowDownSFill />,
      iconOpened: < RiIcons.RiArrowUpSFill />,
    }
  ];