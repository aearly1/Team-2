import React from 'react'

import * as FAIcons from 'react-icons/fa'
import * as FiIcons from 'react-icons/fi'
import * as BiIcons from 'react-icons/bi'
import * as RiIcons from 'react-icons/ri'
import * as MdIcons from 'react-icons/md'


export const HRData = [
    {
      title: 'Faculty',
      path: '#',
      icon: <RiIcons.RiFolderUserFill/>,
      iconClosed: <RiIcons.RiArrowDownSFill />,
      iconOpened: <RiIcons.RiArrowUpSFill />,
      subNav: [
        {
          title: 'Add Faculty',
          path: '/AddFaculty',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Update Faculty',
          path: '/EditFaculty',
          icon: <BiIcons.BiMale/>
        },
        {
          title: 'Delete Faculty',
          path: '/DeleteFaculty',
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
          title: 'Add Department',
          path: '/AddDepartment',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Update Department',
          path: '/EditDepartment',
          icon: <BiIcons.BiMale/>
        },
        {
          title: 'Delete Faculty',
          path: '/DeleteFaculty',
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
          title: 'Add Location',
          path: '/AddLocation',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Update Location',
          path: '/EditLocation',
          icon: <BiIcons.BiMale/>
        },
        {
          title: 'Delete Location',
          path: '/DeleteLocation',
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
          title: 'Add Course',
          path: '/AddCourse',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Update Course',
          path: '/EditCourse',
          icon: <BiIcons.BiMale/>
        },
        {
          title: 'Delete Course',
          path: '/DeleteCourse',
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
          title: 'Add Staff Members',
          path: '/HRAddStaff',
          icon: <FiIcons.FiUsers />
        },
        {
          title: 'Update Staff Members',
          path: '/HREditStaff',
          icon: <BiIcons.BiMale/>
        },
        {
          title: 'Delete Staff Members',
          path: '/HRDeleteStaff',
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
    },
    {
      title: 'Add Missing Attendance',
      path: '/AddMissingAttendance',
      icon: < FAIcons.FaEdit />,
      iconClosed: < RiIcons.RiArrowDownSFill />,
      iconOpened: < RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'Modify Salary',
      path: '/ModifySalary',
      icon: < FAIcons.FaCoins />,
      iconClosed: < RiIcons.RiArrowDownSFill />,
      iconOpened: < RiIcons.RiArrowUpSFill />,
    },
    {
      title: 'View Staff Info',
      path: '/ViewStaffProps',
      icon: < FAIcons.FaInfo />,
      iconClosed: < RiIcons.RiArrowDownSFill />,
      iconOpened: < RiIcons.RiArrowUpSFill />,
    }
  ];