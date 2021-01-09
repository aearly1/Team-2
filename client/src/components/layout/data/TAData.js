import React from 'react'

import * as FAIcons from 'react-icons/fa'
import * as RiIcons from 'react-icons/ri'
import * as BsIcons from 'react-icons/bs'
import * as HiIcons from 'react-icons/hi'


export const TAData = [
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
      title: 'Attendance',
      path: '/attendance',
      icon: < FAIcons.FaUserCheck />,
      iconClosed: < RiIcons.RiArrowDownSFill />,
      iconOpened: < RiIcons.RiArrowUpSFill />,
    }
  ];