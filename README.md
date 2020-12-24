# Team-2
1. Which file should be run to launch the server of your project and under which folder (if
not in the root)?
The file that should be run is the app.js. It is under the root.
2. Which port is the server listening to?
The server is listening to port 3000.
3. Write npmrun dev in the terminal to run the server
4. Paste your mongoDB cnnection string in the config/default.json to connect to your database
5. There are FIVE routes that need to be run to seed the database 
    a) /localhost:3000/api/init/academic-coordinator. This route is responsible to insert ALL the data need so you can be able to test the academic member and coordinator routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    b)/localhost:3000/api/init/staffMems. This route is responsible to insert ALL the data need so you can be able to test the staff member routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    c)/localhost:3000/api/init/hod-init. This route is responsible to insert ALL the data need so you can be able to test the HOD routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    d)
    e)
6. IMPORTANT NOTE: TO BE ABLE TO USE THE COURSE COORDINATOR ROUTES, PLEASE USE THE /api/login ROUTE TO LOGIN USING EMAIL:ali@guc.com AND PASSWORD: 12345
7. IMPORTANT NOTE: TO BE ABLE TO USE THE ACADEMIC MEMBERS ROUTES, PLEASE USE THE /api/login ROUTE TO LOGIN USING EMAIL:shaka@guc.com AND PASSWORD: 12345
8. You will find the UML in the root (UML.jpg)
9. You will find below the description of each route. When you are testing our routes, you can copy the examples written in this document in postman. When you run the routes, you will get a response. The response you get should be identical to the response written in the examples here. That way, you can verify that our work is working correctly
=================================================================================
-----------------------------------staffRoutes-----------------------------------
=================================================================================

Functionality: Logs the staff member in
Route: /api/login
Request type: POST
Request Body: {"email":"sexysoso@hotmail.com",
	"password":"passwordsha2y"}

---------------------------------------------------------------------------------

Functionality: Logs the staff member out
Route: /api/staffs/logout
Request type: POST

---------------------------------------------------------------------------------

Functionality: Views the profile of the staff member
Route: /api/staffs/profile
Request type: GET
Response: JSON Object containing staff member details
Example: {
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530",
    "Office": "C4.404",
    "FacultyName": "Sebaka",
    "DepartmentName": "Fawanees",
    "Courses": [
        "ABC123",
        "XYZ567"
    ],
    "DayOff": "Friday",
    "annualLeaves": 5,
    "accidentalLeavesLeft": 3,
    "Salary": 10
}

---------------------------------------------------------------------------------

Functionality: Updates the profile of a staff member with the entered data
Route: /api/staffs/profile/update
Request type: PUT
Request Body: {
	"email":"sexysoso2@hotmail.com",
	"office":"C6.606",
	"faculty":"Zaboota",
	"department":"Mo5abarat",
	"salary":10000
}
NOTE: faculty, department & salary only update in the DB only if the logged in member is not "Academic"

---------------------------------------------------------------------------------

Functionality: Resets the password of the staff member
Route: /api/staffs/passwordreset
Request type: PUT
Request Body: {
	"oldpassword":"passwordsha2y",
	"newpassword":"passwordmeshsha2y"
}

---------------------------------------------------------------------------------

Functionality: Signs the staff member in to mark their attendance
Route: /api/staffs/signin
Request type: POST
Response: Returns the overall attendance record
Example: [
    {
        "op": "sign in",
        "time": "2020-12-20T14:08:31.848Z"
    }
]
NOTE: The sign in & sign out routes will not work unless the current time of signing in or out is within the working hours

---------------------------------------------------------------------------------

Functionality: Signs the staff member out to mark them leaving
Route: /api/staffs/signout
Request type: POST
Response: Returns the overall attendance record
Example: [
    {
        "op": "sign in",
        "time": "2020-12-20T14:08:31.848Z"
    },
    {
        "op": "sign out",
        "time": "2020-12-20T14:09:30.180Z",
        "net": -503.8235833333333
    }
]

---------------------------------------------------------------------------------

Functionality: Views the attendance of the staff member for a specified month
Route: /api/staffs/attendance/:month
Request type: GET
Parameters: month is the month of the attendance viewed
Example of how to call the route: /attendance/12
Response: Array of JSON Objects representing the attendance in the specified month
Example: [
    {
        "op": "sign in",
        "time": "2020-12-20T13:22:18.145Z"
    },
    {
        "op": "sign out",
        "time": "2020-12-20T13:22:28.730Z",
        "net": -503.8235833333333
    },
    {
        "op": "sign in",
        "time": "2020-12-20T13:22:36.920Z"
    },
    {
        "op": "sign out",
        "time": "2020-12-20T13:22:41.698Z",
        "net": 0.07963333333333333
    },
    {
        "op": "sign in",
        "time": "2020-12-20T14:02:05.071Z"
    },
    {
        "op": "sign out",
        "time": "2020-12-20T14:03:11.430Z",
        "net": 1.1059833333333333
    }
]

---------------------------------------------------------------------------------

Functionality: Views the overall attendance 
Route: /api/staffs/attendance
Request type: GET
Response: Array of JSON Objects representing the attendance
Example: [
    {
        "op": "sign in",
        "time": "2020-12-20T13:22:18.145Z"
    },
    {
        "op": "sign out",
        "time": "2020-12-20T13:22:28.730Z",
        "net": -503.8235833333333
    },
    {
        "op": "sign in",
        "time": "2020-12-20T13:22:36.920Z"
    },
    {
        "op": "sign out",
        "time": "2020-12-20T13:22:41.698Z",
        "net": 0.07963333333333333
    },
    {
        "op": "sign in",
        "time": "2020-12-20T14:02:05.071Z"
    },
    {
        "op": "sign out",
        "time": "2020-12-20T14:03:11.430Z",
        "net": 1.1059833333333333
    }
]

---------------------------------------------------------------------------------

Functionality: Views the days missed by a staff member (that was not signed) where it was not neither a dayoff nor a friday
Route: /api/staffs/missingdays
Request type: GET
Response: Array of the days missed
Example: [
    "12/12",
    "13/12",
    "14/12",
    "15/12",
    "16/12",
    "17/12",
    "19/12"
]

---------------------------------------------------------------------------------

Functionality: Views the net missing hours of the current month
Route: /api/staffs/missinghours
Request type: GET
Response: The number of missing hours
Example: -8 Hours -22 Mins

---------------------------------------------------------------------------------
=================================================================================
---------------------------courseCoordinatorRoutes-------------------------------
=================================================================================
IMPORTANT NOTE: TO BE ABLE TO USE THE COURSE COORDINATOR ROUTES, PLEASE USE THE /api/login ROUTE TO LOGIN USING EMAIL:ali@guc.com AND PASSWORD: 12345

Functionality: View "slot linking" request(s) from academic members linked to his/her course.
Route: /api/coordinator/slotLinkingRequest
Request type: GET
Request Body: 
{
    "courseName":"CSEN701: Embedded Systems"
}
Response: Array of "slot linking" request objects sent from academic members linked to his/her course.
Example: 
[
    {
        "request sent by": "Shaka",
        "requestType": "slot linking",
        "status": "pending",
        "Desired slot": {
            "startTime": "2020-12-20T10:08:15.000Z",
            "endTime": "2020-12-20T10:09:45.000Z",
            "courseTaughtInSlot": "CSEN701: Embedded Systems",
            "slotLocation": "H14"
        }
    }
]

---------------------------------------------------------------------------------

Functionality: Accept/reject \slot linking" requests from academic members linked to his/her cours
Route: /api/coordinator/acceptRejectslotLinkingRequest
Request type: POST
Request body: 
{
    "requestID":"5fdf4da964feaf10444d8c26",
    "courseName":"CSEN701: Embedded Systems"
}
Response: A statement indicating acceptance of request or rejection with reason for rejection. 
Example: "accepted" OR "Rejected because you are already teaching a slt during the same time" OR "Rejected because some other staff member is already teaching this slot" OR "Rejected because this is not a slot in course" OR

NOTES (PLEASE READ VERRRRRRRRRRYYYYYY IMPORTANT!!!!!!!!!!!!!!!!): 
"requestID" is the object ID assigned by mongoose when the request object was created and placed in the request collection. It represents the object id of the request that the course coordinator wants to accept/reject.

THE REQUESTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT REQUEST ID.
---------------------------------------------------------------------------------

Functionality: Add course slot(s) in his/her course
Route: /api/coordinator/addCourseSlot
Request type: POST
Request body:
{
    "courseName":"CSEN701: Embedded Systems",
    "startTime":"2020-12-20T14:13:45",
    "endTime":"2020-12-20T14:15:15",
    "slotLocation":"H14"
}


Response: Returns the newly created slot 
Example: 
{
    "startTime": "2020-12-20T12:13:45.000Z",
    "endTime": "2020-12-20T12:15:15.000Z",
    "courseTaughtInSlot": "CSEN701: Embedded Systems",
    "slotLocation": "H14"
}

---------------------------------------------------------------------------------

Functionality: Updates course slot(s) in his/her course (By updating I mean he can change the location of the slot or the staff member teaching the slot).
Route: /api/coordinator/updateCourseSlot
Request type: PUT
Request Body: 
{
    "courseName":"CSEN701: Embedded Systems",
    "slotID":"5fdfc265685d492a48fbd303",
    "staffTeachingSlot":"Ali",
    "slotLocation":"H19"
}
Response: the mongoose record of the updated slot
Example:
{
    "_id": "5fdfc265685d492a48fbd303",
    "startTime": "2020-12-20T12:08:15.000Z",
    "endTime": "2020-12-20T12:10:45.000Z",
    "courseTaughtInSlot": "5fde50634697eb0980b6b6b4",
    "slotLocation": "5fde596463f84924107476f0",
    "__v": 0,
    "staffTeachingSlot": "5fdde841c77a572248510f5c"
}

NOTES (PLEASE READ VERRRRRRRRRRYYYYYY IMPORTANT!!!!!!!!!!!!!!!!): 
"slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that the course coordinator wants to update.

THE SLOTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT SLOTID OF ONE OF SLOTS BELONGING TO THE EMBEDDED SYSTEMS COURSE.
---------------------------------------------------------------------------------

Functionality: Delete course slot(s) in his/her course.
Route: /api/coordinator/deleteCourseSlot
Request type: PUT
Request Body: {
    "courseID":"5fde50634697eb0980b6b6b4",
    "slotID":"5fde6e9457ea432df038adc7"
}
Response: statement idicating that slot has been successfully deleted
Example: "Successfully deleted slot"

NOTES (PLEASE READ VERRRRRRRRRRYYYYYY IMPORTANT!!!!!!!!!!!!!!!!): 
"slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that the course coordinator wants to delete.

THE SLOTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT SLOTID OF ONE OF SLOTS BELONGING TO THE EMBEDDED SYSTEMS COURSE.

=================================================================================
-----------------------------academicMemberRoutes--------------------------------
=================================================================================
IMPORTANT NOTE: TO BE ABLE TO USE THE ACADEMIC MEMBERS ROUTES, PLEASE USE THE /api/login ROUTE TO LOGIN USING EMAIL:shaka@guc.com AND PASSWORD: 12345

Functionality: Academic member views their own schedule, seeing their teaching activities and replacements (if present).
Route: /api/academicMember/schedule
Request type: GET
Response: Array containing JSON objects representing the slots.
Example:
[
    {
        "startTime": "2020-12-20T10:10:00.000Z",
        "endTime": "2020-12-20T10:11:30.000Z",
        "staffTeachingSlot": "Shaka",
        "slotLocation": "H14",
        "replacementStaff": "NA"
    }
]

---------------------------------------------------------------------------------

Functionality: Sending replacement requests
Route: /api/academicMember/replacementRequest
Request type: POST
Request Body: 
{
    "sendingRequestTo": "Ali",
    "slotID": "5fe492c9783a150ac4c7d873",
    "dayForWhichINeedAReplacement": "2021-12-20T10:10:00.000Z"
}
Response: Returns a mongoose record representing the newly created request.
Example:
{
    "Request sent by": "Shaka",
    "Request sent to": "Ali",
    "Type of request": "Replacement request",
    "Status": "Pending",
    "Slot to be replaced": {
        "startTime": "2020-12-20T10:10:00.000Z",
        "endTime": "2020-12-20T10:11:30.000Z",
        "course taught in slot": "CSEN701: Embedded Systems",
        "staff member teaching slot": "Shaka",
        "slotLocation": "H14"
    },
    "Date of replacement": "2021-12-20T10:10:00.000Z"
}

NOTES (PLEASE READ VERRRRRRRRRRYYYYYY IMPORTANT!!!!!!!!!!!!!!!!): 
"slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that the academic member wants to find a replacement for

THE SLOTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT SLOTID OF ONE OF SLOTS BEING TAUGHT BY TA SHAKA.

---------------------------------------------------------------------------------

Functionality: View "replacement" request(s) sent to me from other academic staff members
Route: /api/academicMember/replacementRequest
Request type: GET
Response: An array of JSON objects representing the replacement requests sent from other academic staff members
Example:
[
    {
        "request sent by": "Ali",
        "requestType": "replacement",
        "status": "pending",
        "replacementSlot": {
            "startTime": "2020-12-20T10:10:00.000Z",
            "endTime": "2020-12-20T10:11:30.000Z",
            "course taught in slot": "CSEN701: Embedded Systems",
            "staff member teaching slot": "Ali",
            "slotLocation": "H14"
        }
    }
]

---------------------------------------------------------------------------------

Functionality: Accept a replacement request sent from another academic staff member
Route: /api/academicMember/acceptReplacementRequest
Request type: POST
Request Body: 
{
	"requestID": "5fe4a640f667a61d54ccc13f"
}
Response: Statement indicating the acceptance of the replacement request
Example: "Accepted"

NOTE:
THE REQUESTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT REQUESTID OF ONE OF REQUESTS SENT TO TA SHAKA BY TA ALI.
---------------------------------------------------------------------------------

Functionality: Reject a replacement request sent from another academic staff member
Route: /api/academicMember/rejectReplacementRequest
Request type: POST
{
	"requestID": "5fe4a640f667a61d54ccc13f"
}
Response: Statement indicating the rejection of the replacement request
Example: "Rejected"

NOTE:
THE REQUESTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT REQUESTID OF ONE OF REQUESTS SENT TO TA SHAKA BY TA ALI.

---------------------------------------------------------------------------------

Functionality: Send a "slot linking" request to course coordinator
Route: /api/academicMember/slotLinkingRequest
Request type: POST
Request body: 
{
    "slotID":"5fe4a63ff667a61d54ccc13a"
}
Response: Returns the newly created replacement object
Example:
{
    "Request sent by": "Shaka",
    "requestType": "slot linking",
    "status": "pending",
    "replacementSlot": {
        "startTime": "2020-12-20T10:08:15.000Z",
        "endTime": "2020-12-20T10:09:45.000Z",
        "course taught in slot": "CSEN701: Embedded Systems",
        "slotLocation": "H14"
    }
}

NOTES:
"slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that te academic member desires to teach/link to.
    
THE SLOTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT SLOTID OF ONE OF A SLOT DOESNT HAVE A TA TEACHING IN IT.

---------------------------------------------------------------------------------

Functionality: Change their day off by sending a "change day off" request to HOD,
and optionally leave a reason.
Route: /api/academicMember/changeDayOffRequest
Request type: POST
Request body:
{
    "reasonForChange":"I love eating chocolate cake on Sataurday and I can't eat chocolate cake at uni",
    "desiredDayOff":"SAT"
}
Response: Returns the newly created "change day off" request object
Example:
{
    "Sent by": "Shaka",
    "Recieved by": "Slim (HOD)",
    "requestType": "change day off",
    "status": "pending",
    "DesiredDayOff": "SAT",
    "requestReason": "I love eating chocolate cake on Sataurday and I can't eat chocolate cake at uni"
}

---------------------------------------------------------------------------------

Functionality: Submit any type of "leave" request (automatically sent to HOD)
Route: /api/academicMember/leave
Request type: POST
Request body:
{
    "documents":"https://drive.google.com/file/d/1soJJpBRjlzuVOs8GsGv5lbeLUP3k6MwK/view?usp=sharing",
    "reason":"Was very very sick and I thought that I was going to die",
    "leaveType":"sick leave",
    "replacementStaff":"Loaa Zahar",
    "startOfLeave":"01.02.2012",
    "endOfLeave":"01.05.2012"
}
Response: Returns the newly created "leave" request object
Example:
{
    "Leave request sent by": "Shaka",
    "Leave request sent to": "Slim (HOD)",
    "status": "pending",
    "replacementStaffName": "Loaa Zahar",
    "relaventLeaveDocuments": "https://drive.google.com/file/d/1soJJpBRjlzuVOs8GsGv5lbeLUP3k6MwK/view?usp=sharing",
    "requestReason": "Was very very sick and I thought that I was going to die",
    "startOfLeave": "01.02.2012",
    "endOfLeave": "01.05.2012"
}
---------------------------------------------------------------------------------

Functionality: View the status of all submitted requests.
Route: /api/academicMember/requestStatus
Request type: GET
Response: Array of JSON Objects representing the submitted requests
Example:
[
    {
        "request sent to": "Ali",
        "requestType": "slot linking",
        "status": "pending"
    },
    {
        "request sent to": "Ali",
        "requestType": "replacement",
        "status": "pending"
    },
    {
        "request sent to": "Slim",
        "requestType": "change day off",
        "status": "rejected"
    },
    {
        "request sent to": "Slim",
        "requestType": "change day off",
        "status": "accepted"
    }
]

---------------------------------------------------------------------------------

Functionality: View the status of accepted submitted requests.
Route: /api/academicMember/requestStaus/accepted
Request type: GET
Response: Array of JSON Objects representing the accepted submitted requests
Example:
[
    {
        "request sent to": "Slim",
        "requestType": "change day off",
        "status": "accepted"
    }
]

---------------------------------------------------------------------------------

Functionality: View the status of rejected submitted requests.
Route: /api/academicMember/requestStaus/rejected
Request type: GET
Response: Array of JSON Objects representing the rejected submitted requests
Example:
[
    {
        "request sent to": "Slim",
        "requestType": "change day off",
        "status": "rejected"
    }
]

---------------------------------------------------------------------------------

Functionality: View the status of pending submitted requests.
Route: /api/academicMember/requestStaus/pending
Request type: GET
Response: Array of JSON Objects representing the pending submitted requests
Example: 
[
    {
        "request sent to": "Ali",
        "requestType": "slot linking",
        "status": "pending"
    },
    {
        "request sent to": "Ali",
        "requestType": "replacement",
        "status": "pending"
    }
]

---------------------------------------------------------------------------------

Functionality: Cancel a still pending request or a request whose day is yet to come
Route: /api/academicMember/cancleRequest
Request type: GET
Request body:
{
        "requestID": "5fdf0f28ae6eb318c8c0621f"
}
Response: A statement that indicates that the deletion process was successful
Example: "Successfully deleted"


=================================================================================
----------------------------HeadOfDepartmentRoutes-------------------------------
=================================================================================


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can assign a course instructor to a course in his department.
Route: '/api/hod/assign-instr-course'
Request type: POST
Request body:
	{
		"courseId":     "5fdfc5f06a48390480a49e5d",
		"instructorId": "5fdfc4736d5db10be4c36277"    
	}
Response: Statement to indicate assignment
Response Example: 
	"HOD user: Slim made change: instructor Milad Ghantous is now assigned to course CSEN 701 - Embedded Systems"

-----------------------------------------------------------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can remove a course instructor from a course in his department.
Route: '/api/hod/del-instr-course'
Request type: DELETE
Request body:
	{
		"courseId":     "5fdfc5f06a48390480a49e5d",
		"instructorId": "5fdfc4736d5db10be4c36277"    
	}	
Response: Statement to indicate deletion
Response Example: 
	"HOD user: Slim made change: instructor Milad Ghantous is now removed from course CSEN 701 - Embedded Systems"

-----------------------------------------------------------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can update a course instructor for one of his courses
Note: 
==>  since assignment and removal of instructor to course are already implemented, and since your 	
==>  description is very vague about this, I decided to implement update as in an OverWriting
==>  Assignment. (i.e. make the instructor given in body the only instructor )
Route: '/api/hod/update-instr-course'
Request type: POST
Request body:
	{
		"courseId":     "5fdfc5f06a48390480a49e5d",
		"instructorId": "5fdfc4736d5db10be4c36277"    
	}
Response: Statement to indicate update
Response Example: 
	"HOD user: Slim made change: instructor Milad Ghantous is now assigned to course CSEN 701 - Embedded Systems"(Overwritingly)

-----------------------------------------------------------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can view all staff members in his department.
Route: '/api/hod/staff'
Request type: GET
Response: All staff members' name,email, id(userCode)
Note: (I'm just using userCode ^^ to avoid confusion between "_id" and "id", "_id" is the mongoose ObjectId, and "id" is the user's id like "hr-33051")
Response Example: 
	[
		{
			"userCode": "hod-1",
			"email": "Slim@gmail.com",
			"name": "Slim"
		},
		{
			"userCode": "instr-2",
			"email": "MGhantous@gmail.com",
			"name": "Milad Ghantous"
		},
		{
			"userCode": "instr-1",
			"email": "HSoubra@gmail.com",
			"name": "Hassan Soubra"
		}
	]

-----------------------------------------------------------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can view all staff members in his department.
Route: '/api/hod/staff-crs'
Request type: GET
Request body:
	{
		"courseId": "5fdff79bc5acf437a4cb29cf"
	}
Response: Staff members' name,email, id(userCode)
Note: (I'm just using userCode ^^ to avoid confusion between "_id" and "id", "_id" is the mongoose ObjectId, and "id" is the user's id like "hr-33051")
Response Example: 
	[
		{
			"userCode": "instr-2",
			"email": "MGhantous@gmail.com",
			"name": "Milad Ghantous"
		}
	]
-----------------------------------------------------------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can view all staff members in his department's day offs.
Route: '/api/hod/staff-do'
Request type: GET
Response: array of objects containing All staff members' id, name, day off.
Response Example: 
[
    {
        "id": "hod-1",
        "staffMemberName": "Slim",
        "dayOff": "Saturday"
    },
    {
        "id": "instr-2",
        "staffMemberName": "Milad Ghantous",
        "dayOff": "Wednesday"
    },
    {
        "id": "instr-1",
        "staffMemberName": "Hassan Soubra",
        "dayOff": "Saturday"
    }
]

-----------------------------------------------------------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can view a single staff members in his department's day offs.
Route: '/api/hod/staff-dos'
Request type: GET
Request body:
	{
	"staffId": "5fdfc4756d5db10be4c36278"
	}
Response: object containing the staff members' id, name, day off.
Response Example: 
{
    "id": "instr-1",
    "staffMemberName": "Hassan Soubra",
    "dayOff": "Saturday"
}
-----------------------------------------------------------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can view all the requests “change day off/leave” sent by staff members in his/her department
Route: '/api/hod/leave-do-reqs'
Request type: GET
Response: Array of Objects, each object containing a request's information (for all requests in hod's department)
Response Example: 
[
    {
        "requestId": "5fdff79ec5acf437a4cb29d6",
        "reqSenderId": "inst-1",
        "reqSenderName": "Hassan Soubra",
        "reqRecieverId": "hod-1",
        "reqRecieverName": "Slim",
        "requestReason": "My horse is stuck in a fridge",
        "status": "pending",
        "startOfLeave": "2020-12-21T01:17:18.632Z",
        "endOfLeave": "2020-12-21T01:17:18.632Z",
        "replacementSlot": "5fdff79dc5acf437a4cb29d4"
    }
]
-----------------------------------------------------------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can Accept a <leave> or <change day off> request.
Note: 
==>  I didn't put a limit that you can't accept an already rejected request. only because I thought HOD should have option to change his mind later.
Route: '/api/hod/leave-do-req-a'
Request type: POST
Request body: 
	{
    "reqId" : "5fdff79ec5acf437a4cb29d6"
	}
Response: Indication of operation success
Response Example: 
	"Request Acceptance successful!"
-----------------------------------------------------------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can Decline a <leave> or <change day off> request.
Note: 
==>  Same as with accept, I didn't put a limit that you can't reject an already accepted request. Only because I thought 
==>  HOD should have option to change his mind later.
Route: '/api/hod/leave-do-req-r'
Request type: POST
Request body: note that reqRejectReason field is OPTIONAL, and could be removed
	{
    "reqId" : "5fdff79ec5acf437a4cb29d6",
    "reqRejectReason" : "my house is on fire"
	}
Response: Indication of operation success
Response Example: 
	"Request Rejection successful!"
-----------------------------------------------------------------------------------------------------------------------


-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can view Course Coverage for course in his department
Route: '/api/hod/course-cov'
Request type: GET
Request body: 
	{
	"courseId": "5fdff79bc5acf437a4cb29cf"
	}
Response: The course coverage of the course in %, and the number of unassigned slots 
Response Example: 
	"course CSEN 701 - Embedded Systems has coverage 50%, and 1 unassigned slots"


-----------------------------------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------
Functionality: HOD can view Teaching Assignment for course in his department
Route: '/api/hod/teaching-assignments'
Request type: GET
Request body: 
	{
	"courseId": "5fdff79bc5acf437a4cb29cf"
	}
Response: The slots of the course, their general info, whether they're assigned to someone or not, and if they are, then the person they are assigned to.
Response Example: 
	[
		{
			"slotId": "5fdff79dc5acf437a4cb29d4",
			"startTime": "2020-12-21T01:17:17.062Z",
			"endTime": "2020-12-21T01:17:17.062Z",
			"location": "C6.304",
			"isAssigned": false
		},
		{
			"slotId": "5fdff79dc5acf437a4cb29d5",
			"startTime": "2020-12-21T01:17:17.523Z",
			"endTime": "2020-12-21T01:17:17.523Z",
			"location": "C6.305",
			"isAssigned": true,
			"staffTeachingSlotId": "instr1",
			"staffTeachingSlotName": "Hassan Soubra"
		}
	]

-----------------------------------------------------------------------------------------------------------------------

===========================================================================================================
---------------------------------------------courseInstructorRoutes----------------------------------------
===========================================================================================================
Functionality: View the coverage of course(s) current user is assigned to.
Route: '/api/view-courses/:id'        --example id: 43-8530
Request type: GET
Response: JSON file The courses assigned to a user academic.
Response Example:
 {
    "Courses": 
    [
        "ABC123",
        "XYZ567"
    ]
}
	
-----------------------------------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------
Functionality: View the slots asignment of course(s) current user  is assigned to.
Route: '/api/view-slot-assign-course/:id'        --example id: 43-8530
Request type: GET
Response: JSON file The slots assigned to a user academic.
Response Example:
 {
    {
			"slotId": "5fdff79dc5acf437a4cb29d4",
			"startTime": "2020-12-21T01:17:17.062Z",
			"endTime": "2020-12-21T01:17:17.062Z",
			"location": "C6.304",
			"isAssigned": false
		},
		{
			"slotId": "5fdff79dc5acf437a4cb29d5",
			"startTime": "2020-12-21T01:17:17.523Z",
			"endTime": "2020-12-21T01:17:17.523Z",
			"location": "C6.305",
			"isAssigned": true,
			"staffTeachingSlotId": "instr1",
			"staffTeachingSlotName": "Hassan Soubra"
		}
}
-----------------------------------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------
Functionality: View all the staff's profiles per course the academic teach 
Route: '/api/view-staf-course/:id'        --example id: 43-8530
Request type: GET
Response:JSON file All staff with their profiles per the current current each course 
Response Example:
 { 
  {
    {
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530"
    },
     
    { 
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530"
    },

    { 
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530"
    }
  }

  {
    {
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530"
    },
     
    { 
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530"
    },

    { 
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530"
    }
  }


}
-----------------------------------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------
Functionality: View all the staff's profiles per departement the academic teach 
Route: '/api/view-staf-dep/'        --example id: 43-8530
Request type: GET
Response: JSON file All staff with their profiles per the current user's departement 
Response Example:
 { 
  
    {
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530"
    },
     
    { 
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530"
    },

    { 
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530"
    }
  
}
-----------------------------------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------
Functionality: Assign an academic member to an unassigned slots in course(s)
Route: '/api/assign-course/:id'        --example id: 43-8530
Request type: POST
Request Body:
{
         "courseId": "5fdff79bc5acf437a4cb29cf",
         "academicId":"2435",
         "slotID":"5fdfc265685d492a48fbd303"
}
Response: JSON file course and slot updated with assignment of academic to an unassigned slot

Response Example:  
{ 
"courseId": "5fdff79bc5acf437a4cb29cf"
 "courseName" : "CSEN 701 ",
  "instructors" : " 43-8530",
  " teachingAssistants": {"1425" ,"2435"},
   "coordinator" : "3455",
   "teachingSlots":
   {
       {
        "startTime": "2012-01-01T22:00:00.000Z",
        "endTime": "2012-01-01T22:00:00.000Z",
        "staffTeachingSlot": "Shaka Zulu",
        "courseTaughtInSlot": CSEN701: Embedded Systems,
        "slotLocation": "H14",
        "replacementStaff": "NA"
    },
    {
        "startTime": "2012-01-01T22:00:00.000Z",
        "endTime": "2012-01-01T22:00:00.000Z",
        "staffTeachingSlot": "Shaka Zulu",
        "courseTaughtInSlot": CSEN701: Embedded Systems
        "slotLocation": "H19",
        "replacementStaff": "NA"
    }
   },
        "unassignedSlots" : "1"

}  
  
-----------------------------------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------
Functionality: Update assignment of academic member in course(s) he/she is assigned to.
Route: '/api/update-assign/:id'        --example id: 43-8530
Request type: POST
Request Body:
{
         "courseId": "5fdff79bc5acf437a4cb29cf",
         "academicID" : "3455"
}
Response: Induction updated assignment of academic member successfuly 

Response Example:  
             "Updated successfully"
-----------------------------------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------
 Functionality:delete assignment of academic member in course(s) he/she is assigned to.
Route: '/api/delete-assign/:id"'        --example id: 43-8530
Request type: POST
Request Body:
{
         "courseId": "5fdff79bc5acf437a4cb29cf",
         "academicID" : "3455"
}
Response: Induction deleted assignment of academic member successfuly 

Response Example:  
             "Deleted successfully"
-----------------------------------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------
Functionality:Assign an academic member in each of his/her course(s) to be a course coordinator
Route: '/api/assign-academic/:id"'        --example id: 43-8530
Request type: POST
Request Body:
{
         "courseId": "5fdff79bc5acf437a4cb29cf",
         "academicID" : "5647"
}
Response: JSON file for the uodated course 

Response Example:  
            { 
"courseId": "5fdff79bc5acf437a4cb29cf"
 "courseName" : "CSEN 701 ",
  "instructors" : " 43-8530",
  " teachingAssistants": {"1425" ,"2435"},
   "coordinator" : "5647",
   "teachingSlots":
   {
       {
        "startTime": "2012-01-01T22:00:00.000Z",
        "endTime": "2012-01-01T22:00:00.000Z",
        "staffTeachingSlot": "Shaka Zulu",
        "courseTaughtInSlot": CSEN701: Embedded Systems,
        "slotLocation": "H14",
        "replacementStaff": "NA"
    },
    {
        "startTime": "2012-01-01T22:00:00.000Z",
        "endTime": "2012-01-01T22:00:00.000Z",
        "staffTeachingSlot": "Shaka Zulu",
        "courseTaughtInSlot": CSEN701: Embedded Systems
        "slotLocation": "H19",
        "replacementStaff": "NA"
    }
   },
        "unassignedSlots" : "1"

}  
-----------------------------------------------------------------------------------------------------------------------

-----------------------------------------------------------------------------------------------------------------------