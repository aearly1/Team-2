# Team-2

=================================================================================
-----------------------------------staffRoutes-----------------------------------
=================================================================================

Functionality: Logs the staff member in
Route: /api/staffs/login
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
    "Office": "C694220",
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
	"office":"C4.404",
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
Example: -8 Hours 37 Mins

---------------------------------------------------------------------------------
=================================================================================
---------------------------courseCoordinatorRoutes-------------------------------
=================================================================================

Functionality: View "slot linking" request(s) from academic members linked to his/her course.
Route: /slotLinkingRequest
Request type: GET
Request Body: 
{
    "courseID":"5fde50634697eb0980b6b6b4"
}
Response: Array of "slot linking" request objects sent from academic members linked to his/her course.
Example: [
    {
        "request sent by": "Shaka Zulu",
        "requestType": "slot linking",
        "status": "accepted",
        "Desired slot": {
            "_id": "5fdee7aac500ee0f14d630a7",
            "startTime": "2012-01-01T22:00:00.000Z",
            "endTime": "2012-01-01T22:00:00.000Z",
            "courseTaughtInSlot": "5fde50634697eb0980b6b6b4",
            "slotLocation": "5fde596463f84924107476f0",
            "__v": 0,
            "staffTeachingSlot": "5fdde841c77a572248510f5c"
        }
    },
    {
        "request sent by": "Shaka",
        "requestType": "slot linking",
        "status": "pending",
        "Desired slot": {
            "_id": "5fdee7aac500ee0f14d630a7",
            "startTime": "2012-01-01T22:00:00.000Z",
            "endTime": "2012-01-01T22:00:00.000Z",
            "courseTaughtInSlot": "5fde50634697eb0980b6b6b4",
            "slotLocation": "5fde596463f84924107476f0",
            "__v": 0,
            "staffTeachingSlot": "5fdde841c77a572248510f5c"
        }
    }
]
NOTE: "courseID" is the object ID assigned by mongoose when the course object was created and placed in the course collection. It represent the object ID of the course that the coordinator is responsible for.
---------------------------------------------------------------------------------

Functionality: Accept/reject \slot linking" requests from academic members linked to his/her cours
Route: /acceptRejectslotLinkingRequest
Request type: POST
Request body: {
    "requestID":"5fdf4da964feaf10444d8c26",
    "courseID":"5fde50634697eb0980b6b6b4"
}
Response: A statement indicating acceptance of request or rejection with reason for rejection. 
Example: "accepted" OR "Rejected because you are already teaching a slt during the same time" OR "Rejected because some other staff member is already teaching this slot" OR "Rejected because this is not a slot in course" OR

NOTES: 
"courseID" is the object ID assigned by mongoose when the course object was created and placed in the course collection. It represents the course that the user is supposedly the coordinator of.

"requestID" is the object ID assigned by mongoose when the request object was created and placed in the request collection. It represents the object id of the request that the course coordinator wants to accept/reject
---------------------------------------------------------------------------------

Functionality: Add course slot(s) in his/her course
Route: /addCourseSlot
Request type: POST
Request body: {
   
}
Response: Returns the newly created slot (a mongoose record of type slot)
Example: {
   
}

---------------------------------------------------------------------------------

Functionality: Updates course slot(s) in his/her course (By updating I mean he can change the location of the slot or the staff member teaching the slot).
Route: /updateCourseSlot
Request type: PUT
Request Body: {
    "courseID":"5fde50634697eb0980b6b6b4",
    "slotID":"5fde6e9457ea432df038adc7",
    "staffTeachingSlot":"5fdde841c77a572248510f5b",
    "slotLocation":"5fde596463f84924107476f0"
}

NOTES: 
you can update the slot location or staff teaching or both. If you don't want to update both values, then only pass the value you want to update. The code handels the null value in that case.

"courseID" is the object ID assigned by mongoose when the course object was created and placed in the course collection. It represents the course that the user is supposedly the coordinator of.

"slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that the course coordinator wants to update.

---------------------------------------------------------------------------------

Functionality: Delete course slot(s) in his/her course.
Route: /deleteCourseSlot
Request type: PUT
Request Body: {
    "courseID":"5fde50634697eb0980b6b6b4",
    "slotID":"5fde6e9457ea432df038adc7"
}
Response: statement idicating that slot has been successfully deleted
Example: "Successfully deleted slot"

NOTEs:
"courseID" is the object ID assigned by mongoose when the course object was created and placed in the course collection. It represents the course that the user is supposedly the coordinator of.

"slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that the course coordinator wants to update.

=================================================================================
-----------------------------academicMemberRoutes--------------------------------
=================================================================================

Functionality: Academic member views their own schedule, seeing their teaching activities and replacements (if present).
Route: /schedule
Request type: GET
Response: Array containing JSON objects representing the slots.
Example:
[
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
]

---------------------------------------------------------------------------------

Functionality: Sending replacement requests
Route: /replacementRequest
Request type: POST
Request Body: 
{
    "recieverID": "5fdde841c77a572248510f5",
    "slotID": "5fdde841c77a572248510f5b"
}
Response: Returns a mongoose record representing the newly created slot.
Example:

NOTES:
In order to replace a staff member for the ENTIRE day and not just a single slot, you will call this route for EVERY single slot of the day. 

"recieverID" is the object ID assigned by mongoose when the staff member object was created and placed in the staff member collection. It represents the staff member that the raplacement request is being sent to.

"slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that te academic member is trying to find a replacement for.

---------------------------------------------------------------------------------

Functionality: View "replacement" request(s) sent to me from other academic staff members
Route: /replacementRequest
Request type: GET
Response: An array of JSON objects representing the replacement requests sent from other academic staff members
Example: {
    
}

---------------------------------------------------------------------------------

Functionality: Accept a replacement request sent from another academic staff member
Route: /acceptReplacementRequest
Request type: POST
Request Body: 
{
	"requestID": "5fdde841c77a572248510f5"
}
Response: Statement indicating the acceptance of the replacement request
Example: "Accepted"

NOTE:
"requestID" is the object ID assigned by mongoose when the request object was created and placed in the request collection. It represents the object id of the request that the academic staff member wants to accept

---------------------------------------------------------------------------------

Functionality: Reject a replacement request sent from another academic staff member
Route: /rejectReplacementRequest
Request type: POST
Request Body: 
{
	"requestID": "5fdde841c77a572248510f5"
}
Response: Statement indicating the rejection of the replacement request
Example: "Rejected"

NOTE:
"requestID" is the object ID assigned by mongoose when the request object was created and placed in the request collection. It represents the object id of the request that the academic staff member wants to reject

---------------------------------------------------------------------------------

Functionality: Send a "slot linking" request to course coordinator
Route: /slotLinkingRequest
Request type: POST
Request body: 
{
    "slotID":"5fdee7aac500ee0f14d630a7"
}
Response: Returns the newly created replacement object
Example:
{
    "_id": "5fdfad3a55a35f11bca370ca",
    "senderID": "5fdde841c77a572248510f5c",
    "recieverID": "5fdf4d1574d9742bd8705f42",
    "requestType": "slot linking",
    "status": "pending",
    "replacementSlot": "5fdee7aac500ee0f14d630a7",
    "__v": 0
}

NOTES:
"slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that te academic member desires to teach/link to.
    
"senderID" is the object ID assigned by mongoose when the staff member object was created and placed in the staff member collection. It represents the object id of the academic member sending the slot linking request.

"recieverID" is the object ID assigned by mongoose when the staff member object was created and placed in the staff member collection. It represents the object id of the course coordinator who recieves all the slot linking requests of his course.

"replacementSlot" is the object ID assigned by mongoose when the slot  was created and placed in the slot collection. It represents the object id of the slot that the academic member desires to teach/link to (IT IS THE SAME AS THE SLOTID THAT WAS PLACED IN THE REQUEST.BODY)

---------------------------------------------------------------------------------

Functionality: Change their day off by sending a "change day off" request to HOD,
and optionally leave a reason.
Route: /changeDayOffRequest
Request type: POST
Request body:
{
    "reasonForChange":"I am bored",
    "desiredDayOff":"SAT"
}
Response: Returns the newly created "change day off" request object
Example:

---------------------------------------------------------------------------------

Functionality: Submit any type of "leave" request (automatically sent to HOD)
Route: '/leave'
Request type: POST
Request body:
{

}
Response: Returns the newly created "leave" request object
Example:
{

}
---------------------------------------------------------------------------------

Functionality: View the status of all submitted requests.
Route: '/requestStatus'
Request type: GET
Response: Array of JSON Objects representing the submitted requests
Example:
[
    {
        "request sent to": "Shaka",
        "requestType": "slot linking",
        "status": "accepted"
    },
    {
        "request sent to": "Shaka",
        "requestType": "slot linking",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "rejected"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "accepted"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "rejected"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "compensation leave",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "maternity leave",
        "status": "pending"
    },
    {
        "request sent to": "zulu",
        "requestType": "slot linking",
        "status": "rejected"
    },
    {
        "request sent to": "zulu",
        "requestType": "slot linking",
        "status": "pending"
    },
    {
        "request sent to": "zulu",
        "requestType": "slot linking",
        "status": "pending"
    }
]

---------------------------------------------------------------------------------

Functionality: View the status of accepted submitted requests.
Route: '/requestStaus/accepted'
Request type: GET
Response: Array of JSON Objects representing the accepted submitted requests
Example:
[
    {
        "request sent to": "Shaka Zulu",
        "requestType": "slot linking",
        "status": "accepted"
    },
    {
        "request sent to": "Shaka Zulu",
        "requestType": "slot linking",
        "status": "accepted"
    }
]

---------------------------------------------------------------------------------

Functionality: View the status of rejected submitted requests.
Route: '/requestStaus/rejected'
Request type: GET
Response: Array of JSON Objects representing the rejected submitted requests
Example:
[
    {
        "request sent to": "Shaka",
        "requestType": "slot linking",
        "status": "rejected"
    }
]

---------------------------------------------------------------------------------
---------------------------------------------------------------------------------

Functionality: View the status of pending submitted requests.
Route: '/requestStaus/pending'
Request type: GET
Response: Array of JSON Objects representing the pending submitted requests
Example: 
[
    {
        "request sent to": "Shaka",
        "requestType": "slot linking",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "slot linking",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "change day off",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "compensation leave",
        "status": "pending"
    },
    {
        "request sent to": "Shaka",
        "requestType": "maternity leave",
        "status": "pending"
    },
    {
        "request sent to": "zulu",
        "requestType": "slot linking",
        "status": "rejected"
    },
    {
        "request sent to": "zulu",
        "requestType": "slot linking",
        "status": "pending"
    },
    {
        "request sent to": "zulu",
        "requestType": "slot linking",
        "status": "pending"
    }
]

---------------------------------------------------------------------------------

Functionality: Cancel a still pending request or a request whose day is yet to come
Route: /cancleRequest
Request type: GET
Response: A statement that indicates that the deletion process was successful
Example: "Successfully deleted"


