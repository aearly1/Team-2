# Team-2
IMPORTANT NOTE FOR MILESTONE 2

-our deployed website: https://staffsprotal.herokuapp.com/
- run npm i and nmp i client in terminal
-Paste your mongoDB cnnection string in the config/default.json to connect to your database
-to run website locally run npm run dev in terminal

EXTREMELY IMPORTANT

There are FIVE routes that need to be run to seed the database (not all of them at once).
    a) localhost:3000/api/init/academic-coordinator. This route is responsible to insert ALL the data need so you can be able to test the academic member and coordinator routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    b)localhost:3000/api/init/staffMems. This route is responsible to insert ALL the data need so you can be able to test the staff member routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    c)localhost:3000/api/init/hod-init. This route is responsible to insert ALL the data need so you can be able to test the HOD routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    d)localhost:3000/api/init/courseInstructor. This route is responsible to insert ALL the data need so you can be able to test the course instructor routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    e)localhost:3000/api/init/hr-init. This route is responsible to insert ALL the data need so you can be able to test the HR routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.

-List of accounts of userthat you can login in with (make sure to run the appropiate seeding route before logging in with user):
1-HOD:
email: Slim@gmail.com, password: SlimSlim (use this to test HOD stuff)
2-Instructor:
email: HSoubra@gmail.com, password: SoubraSoubra (Use this to test Course instructor)
3-TA: 
email: shaka@guc.com, password: 12345 (USE THIS TO TEST THE ACADEMIC STAFF FEATURES SINCE IT HAS DATA FOR THESE PAGES)
email: AHesham@gmail.com, password: AhmedAhmed (
4-Coordinator:
email: ali@guc.com@gmail.com, password: 123456 (USE THIS TO TEST THE ACADEMIC STAFF and coordicator FEATURES SINCE IT HAS DATA FOR THESE PAGES)
5-HR: 
email: HR1@guc.edu.eg, password:12345


____________________________________________________________________________________________________
READ ME OF MILESTONE 1 (might have outdated info)

1.  Which file should be run to launch the server of your project and under which folder (if
    not in the root)?
    The file that should be run is the app.js. It is under the root.

2.  Which port is the server listening to?
    The server is listening to port 3000.

3.  Write npm run dev in the terminal to run the server

4.  Paste your mongoDB cnnection string in the config/default.json to connect to your database

5.  There are FIVE routes that need to be run to seed the database (not all of them at once).
    a) localhost:3000/api/init/academic-coordinator. This route is responsible to insert ALL the data need so you can be able to test the academic member and coordinator routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    b)localhost:3000/api/init/staffMems. This route is responsible to insert ALL the data need so you can be able to test the staff member routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    c)localhost:3000/api/init/hod-init. This route is responsible to insert ALL the data need so you can be able to test the HOD routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    d)localhost:3000/api/init/courseInstructor. This route is responsible to insert ALL the data need so you can be able to test the course instructor routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    e)localhost:3000/api/init/hr-init. This route is responsible to insert ALL the data need so you can be able to test the HR routes. Once the data is inserted, you can use postman to copy our examples and you will see the same response that is written in the readme file.
    =======

6. THE MOST IMPORTANT NOTE: WHEN YOU RUN THE SEEDING ROUTE, IT AUTOMATICALLY CLEARS THE DATABASE. THEREFORE, PLEASE DO NOT RUN ALL FIVE SEEDING ROUTES AT THE BEGINING. WHENEVER YOU NEED TO TEST A PART, JUST RUN ITS SEEDING ROUTE BEFORE TESTING IT.

7. IMPORTANT NOTE: TO BE ABLE TO USE THE COURSE COORDINATOR ROUTES, PLEASE USE THE /api/login ROUTE TO LOGIN USING EMAIL:ali@guc.com AND PASSWORD: 12345

8. IMPORTANT NOTE: TO BE ABLE TO USE THE ACADEMIC MEMBERS ROUTES, PLEASE USE THE /api/login ROUTE TO LOGIN USING EMAIL:shaka@guc.com AND PASSWORD: 12345

9. IMPORTANT NOTE: TO BE ABLE TO USE THE HEAD OF DEPARTMENT ROUTES, PLEASE USE THE /api/login ROUTE TO LOGIN USING EMAIL:Slim@gmail.com AND PASSWORD: SlimSlim

10. IMPORTANT NOTE: TO BE ABLE TO USE THE COURSE INSTRUCTOR ROUTES, PLEASE USE THE /api/login ROUTE TO LOGIN USING EMAIL:soubra@gmail.com AND PASSWORD: 12345

11. You will find the UML in the root (UML.jpg)

12. # You will find below the description of each route. When you are testing our routes, you can copy the examples written in this document in postman. When you run the routes, you will get a response. The response you get should be identical to the response written in the examples here. That way, you can verify that our work is working correctly

=================================================================================
--------------------------------staffMembers-------------------------------------
=================================================================================

Functionality: Logs the staff member in
Route: /api/login
Request type: POST
Request Body: {"email":"sexysoso@hotmail.com",
"password":"passwordsha2y"}

---

Functionality: Logs the staff member out
Route: /api/staffs/logout
Request type: POST

---

Functionality: Views the profile of the staff member
Route: /api/staffs/profile
Request type: GET
Response: JSON Object containing staff member details
Example: {
    "Name": "7amada sha3r",
    "Email": "sexysoso@hotmail.com",
    "ID": "43-8530",
    "Office": "C4.404",
    "FacultyName": "Tegara",
    "DepartmentName": "Fawanees",
    "Courses": [
        "ABC123",
        "XYZ567"
    ],
    "DayOff": "SAT",
    "annualLeaves": 5,
    "Salary": 10
}

---

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
NOTE: faculty, department & salary only update in the DB only if the logged in member is not "academic"

---

Functionality: Resets the password of the staff member
Route: /api/staffs/passwordreset
Request type: PUT
Request Body: {
"oldpassword":"passwordsha2y",
"newpassword":"passwordmeshsha2y"
}

---

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

---

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

---

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

---

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

---

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

---

Functionality: Views the net missing hours of the current month
Route: /api/staffs/missinghours
Request type: GET
Response: The number of missing hours
Example: -8 Hours -22 Mins

---

=================================================================================
---------------------------courseCoordinatorRoutes-------------------------------
=================================================================================
To begin testing you will need a token. To get the token, send a post request using use the "/api/login" route with 
the follow body:
{
    "email":"ali@guc.com",
    "password":"12345"
}
then the token will be returned in the header. For any upcoming request, include 
the returend token in the header of the request to authenticate.

---

Functionality: View "slot linking" request(s) from academic members linked to his/her course.
Route: /api/coordinator/slotLinkingRequest
Request type: GET
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

---

Functionality: Accept/reject \slot linking" requests from academic members linked to his/her cours
Route: /api/coordinator/acceptRejectslotLinkingRequest
Request type: POST
Request body:
{
"requestID":"5fdf4da964feaf10444d8c26",
"coursename":"CSEN701: Embedded Systems"
}
Response: A statement indicating acceptance of request or rejection with reason for rejection.
Example: "accepted" OR "Rejected because you are already teaching a slt during the same time" OR "Rejected because some other staff member is already teaching this slot" OR "Rejected because this is not a slot in course" OR

NOTES (PLEASE READ VERRRRRRRRRRYYYYYY IMPORTANT!!!!!!!!!!!!!!!!):
"requestID" is the object ID assigned by mongoose when the request object was created and placed in the request collection. It represents the object id of the request that the course coordinator wants to accept/reject.

## THE REQUESTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT REQUEST ID.

---

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

---

Functionality: Updates course slot(s) in his/her course (By updating I mean he can change the location of the slot or the staff member teaching the slot).
Route: /api/coordinator/updateCourseSlot
Request type: PUT
Request Body:
{
"courseName":"CSEN701: Embedded Systems",
"slotID":"5fdfc265685d492a48fbd303",
"staffTeachingSlot":"Ali",
"slotLocation":"H14"
}
Response: the mongoose record of the updated slot
Example:
{
    "startTime": "2020-12-20T10:10:00.000Z",
    "endTime": "2020-12-20T10:11:30.000Z",
    "courseTaughtInSlot": "CSEN701: Embedded Systems",
    "staffTeachingSlot": "Ali",
    "slotLocation": "H14"
}

NOTES (PLEASE READ VERRRRRRRRRRYYYYYY IMPORTANT!!!!!!!!!!!!!!!!):
"slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that the course coordinator wants to update.

## THE SLOTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT SLOTID OF ONE OF SLOTS BELONGING TO THE EMBEDDED SYSTEMS COURSE.

Functionality: Delete course slot(s) in his/her course.
Route: /api/coordinator/deleteCourseSlot
Request type: POST
Request Body: {
"courseName":"CSEN701: Embedded Systems",
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
To begin testing you will need a token. To get the token, send a post request using use the "/api/login" route with 
the follow body:
{
    "email":"shaka@guc.com",
    "password":"12345"
}
then the token will be returned in the header. For any upcoming request, include 
the returend token in the header of the request to authenticate.

# PLEASE RERUN localhost:3000/api/init/academic-coordinator AGAIN
----------------------------------------------------------------------------------

Functionality: Academic member views their own schedule, seeing their teaching activities and replacements (if present).
Route: /api/academicMember/schedule
Request type: GET
Response: Array containing JSON objects representing the slots.
Example:
[
    {
        "day": 5,
        "slotNr": 1,
        "startTime": "2020-12-20T10:10:00.000Z",
        "endTime": "2020-12-20T10:11:30.000Z",
        "courseTaughtInSlot": "CSEN701: Embedded Systems",
        "staffTeachingSlot": "Shaka",
        "slotLocation": "H14",
        "replacementStaff": "NA"
    }
]

---

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

# NOTES (PLEASE READ VERRRRRRRRRRYYYYYY IMPORTANT!!!!!!!!!!!!!!!!):
# "slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that the academic member wants to find a replacement for

# THE SLOTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT SLOTID OF ONE OF SLOTS BEING TAUGHT BY TA SHAKA.

---

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

---

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

---

Functionality: Reject a replacement request sent from another academic staff member
Route: /api/academicMember/rejectReplacementRequest
Request type: POST
{
"requestID": "5fe4a640f667a61d54ccc13f"
}
Response: Statement indicating the rejection of the replacement request
Example: "Rejected"

# NOTE:
# THE REQUESTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT REQUESTID OF ONE OF REQUESTS SENT TO TA SHAKA BY TA ALI.

# use the same request that you used in the previous route. Just changed the accepted status to pending in the database and call this route.

---

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

# NOTES:
# "slotID" is the object ID assigned by mongoose when the slot object was created and placed in the slot collection. It represents the object id of the slot that te academic member desires to teach/link to.

# THE SLOTID WILL DIFFER EVERYTIME YOU SEED THE DATABASE. THERE IT WONT ALWAYS BE "5fdf4da964feaf10444d8c26". CHECK THE DATABASE FOR THE CORRECT SLOTID OF ONE OF A SLOT DOESNT HAVE A TA TEACHING IN IT.

---

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
"requestReason": I love eating chocolate cake on Sataurday and I can't eat chocolate cake at uni
}

---

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

---

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

---

Functionality: View the status of accepted submitted requests.
Route: /api/academicMember/requestStaus/accepted
Request type: GET
Response: Array of JSON Objects representing the accepted submitted requests
Example:
[
    {
        "request sent to": "Ali",
        "requestType": "replacement",
        "status": "accepted"
    },
    {
        "request sent to": "Slim",
        "requestType": "change day off",
        "status": "accepted"
    }
]

---

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

---

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

---

Functionality: Cancel a still pending request or a request whose day is yet to come
Route: /api/academicMember/cancleRequest
Request type: POST
Request body:
{
"requestID": "5fdf0f28ae6eb318c8c0621f"
}
Response: A statement that indicates that the deletion process was successful
Example: "Successfully deleted"

# NOTE: AGAIN PLEASE GET CORRECT ID FROM DB
=================================================================================
----------------------------HeadOfDepartmentRoutes-------------------------------
=================================================================================

/////// VERY IMPORTANT NOTES \\\\\\\\\\

1.  Before testing these routes, please send a "get" request to < "http://localhost:3000/api/init/hod-init" > to seed the database.

2.  I did my best to have it so you don't have to get an ObjectId from the Database, and tried to use constant values for the req.body

3.  Seeding will add the following items.
    -One faculty "Engineering"
    -One Department "MET" under "Engineering" Faculty
    -One course "CSEN 701 - Embedded Systems" under MET department, with two teaching slots,
    1 of which is unassigned.
    -Three "instructor" subType users. ("Slim","ac-1")|("Hassan Soubra","ac-2")|("Milad Ghantous","ac-3")
    where "Slim" is Head of "MET" department.
    -One "ta" subType user. ("Ahmed Hesham", "ac-4"), which is a TA for course "CSEN 701 - Embedded
    Systems".
    -Two locations (C6.304,lab), (C6.305,tutorial)
    -Two slots (location: C6.304, not assigned to anyone)
    and (location: C6.305, assigned to instructor "Hassan Soubra")
    -One Request of type "annual leave" from "Hassan Soubra" to "Slim"
4.  You will need to use the "http://localhost:3000/api/login/" route to log in as "Slim" the head of the department, in order to get his token to conduct tests
    Slim's login info ==> { email : Slim@gmail.com
    password : SlimSlim }
5.  After logging in as Slim, take his token from the response header in postman, and use it in the request header of all the routes below

6.  Finally, I exported all my postman tests to a collection file, which you might be able to import. You'll find it in the project directory in "postman-collection/HOD-Tests.postman_collection.json".
    Thought it might save you some time :)

---

Functionality: HOD can assign a course instructor to a course in his department.
Route: '/api/hod/assign-instr-course'
Request type: POST
Request body:
{
"courseName": "CSEN 701 - Embedded Systems",
"instructorId": "ac-2"
}
Response: Statement to indicate assignment
Response Example:
"HOD user: Slim made change ==> instructor Hassan Soubra is now assigned to course CSEN 701 - Embedded Systems."

---

---

Functionality: HOD can remove a course instructor from a course in his department.
Route: '/api/hod/del-instr-course'
Request type: DELETE
Request body:
{
"courseName": "CSEN 701 - Embedded Systems",
"instructorId": "ac-2"
}
Response: Statement to indicate deletion
Response Example:
"HOD user: Slim made change ==> instructor Hassan Soubra is now removed from course CSEN 701 - Embedded Systems."

---

---

Functionality: HOD can update a course instructor for one of his courses
Note:
==> since assignment and removal of instructor to course are already implemented, and since your
==> description is very vague about this, I decided to implement update as in an OverWriting
==> Assignment. (i.e. make the instructor given in body the only instructor )
Route: '/api/hod/update-instr-course'
Request type: POST
Request body:
{
"courseName": "CSEN 701 - Embedded Systems",
"instructorId": "ac-1"
}
Response: Statement to indicate update
Response Example:
"HOD user: Slim made change ==> instructor Slim is now assigned to course CSEN 701 - Embedded Systems (Overwritingly)."

---

---

Functionality: HOD can view all staff members in his department.
Route: '/api/hod/staff'
Request type: GET
Response: All staff members in his department's names ,emails , ids(userCode) , and subType
Note: (I'm just using userCode ^^ to avoid confusion between "\_id" and "id", "\_id" is the mongoose ObjectId, and "id" is the user's id like "ac-33")
Response Example:
[
{
"userCode": "ac-1",
"subType": "head of department",
"email": "Slim@gmail.com",
"name": "Slim"
},
{
"userCode": "ac-2",
"subType": "instructor",
"email": "HSoubra@gmail.com",
"name": "Hassan Soubra"
},
{
"userCode": "ac-3",
"subType": "instructor",
"email": "MGhantous@gmail.com",
"name": "Milad Ghantous"
},
{
"userCode": "ac-4",
"subType": "ta",
"email": "AHesham@gmail.com",
"name": "Ahmed Hesham"
}
]

---

---

Functionality: HOD can view all staff members for a course in his department.
Route: '/api/hod/staff-crs'
Request type: GET
Request body:
{
"courseName": "CSEN 701 - Embedded Systems"
}
Response: Staff members' names, emails, ids(userCode) , subTypes
Response Example:
[
{
"userCode": "ac-1",
"subType": "head of department",
"email": "Slim@gmail.com",
"name": "Slim"
},
{
"userCode": "ac-4",
"subType": "ta",
"email": "AHesham@gmail.com",
"name": "Ahmed Hesham"
}
]

---

---

Functionality: HOD can view all staff members in his department's day offs.
Route: '/api/hod/staff-do'
Request type: GET
Response: array of objects containing All staff members' id, name, day off.
Response Example:
[
{
"id": "ac-1",
"staffMemberName": "Slim",
"subType": "head of department",
"dayOff": "SAT"
},
{
"id": "ac-2",
"staffMemberName": "Hassan Soubra",
"subType": "instructor",
"dayOff": "SAT"
},
{
"id": "ac-3",
"staffMemberName": "Milad Ghantous",
"subType": "instructor",
"dayOff": "TUE"
},
{
"id": "ac-4",
"staffMemberName": "Ahmed Hesham",
"subType": "ta",
"dayOff": "MON"
}
]

---

---

Functionality: HOD can view a single staff members in his department's day offs.
Route: '/api/hod/staff-dos'
Request type: GET
Request body:
{
"staffId": "ac-2"
}
Response: object containing the staff members' id, name, day off.
Response Example:
{
"id": "ac-2",
"staffMemberName": "Hassan Soubra",
"subType": "instructor",
"dayOff": "SAT"
}

---

---

Functionality: HOD can view all the requests “change day off/leave” sent by staff members in his/her department
Route: '/api/hod/leave-do-reqs'
Request type: GET
Response: Array of Objects, each object containing a request's information (for all requests sent by staffMembers in HOD's department)
Response Example:
[
{
"requestId": "5fe50013460d320d2c04e06d",
"reqSenderId": "ac-2",
"reqSenderName": "Hassan Soubra",
"reqRecieverId": "ac-1",
"reqRecieverName": "Slim",
"requestReason": "My horse is stuck in a fridge",
"status": "pending",
"startOfLeave": "2020-12-24T20:54:43.904Z",
"endOfLeave": "2020-12-24T20:54:43.904Z",
"replacementSlot": "5fe50011460d320d2c04e06b"
}
]

---

---

Functionality: HOD can Accept a <leave> or <change day off> request.
Note:
==> I didn't put a limit that you can't accept an already rejected request. only because I thought HOD
should have option to change his mind later.
==> Also, sadly there's no unique identifier for request so you have to get ObjectId for this one manually
from the DB to test
Route: '/api/hod/leave-do-req-a'
Request type: POST
Request body:
{
"reqId" : "5fe50013460d320d2c04e06d"
}
Response: Indication of operation success
Response Example:
"Request Acceptance successful!"

---

---

Functionality: HOD can Decline a <leave> or <change day off> request.
Note:
==> Same as with accept, I didn't put a limit that you can't reject an already accepted request. Only
because I thought HOD should have option to change his decision.
==> Also, sadly there's no unique identifier for request so you have to get ObjectId for this one manually
from the DB to test
Route: '/api/hod/leave-do-req-r'
Request type: POST
Request body: note that reqRejectReason field is OPTIONAL, and could be removed
{
"reqId" : "5fe50013460d320d2c04e06d",
"reqRejectReason" : "my house is on fire"
}
Response: Indication of operation success
Response Example:
"Request Rejection successful!"

---

---

Functionality: HOD can view Course Coverage for course in his department
Route: '/api/hod/course-cov'
Request type: GET
Request body:
{
"courseName": "CSEN 701 - Embedded Systems"
}
Response: The course coverage of the course in %, and the number of unassigned slots
Response Example:
"course CSEN 701 - Embedded Systems has coverage 50%, and 1 unassigned slots"

---

---

Functionality: HOD can view Teaching Assignment for course in his department
Route: '/api/hod/teaching-assignments'
Request type: GET
Request body:
{
"courseName": "CSEN 701 - Embedded Systems"
}
Response: The slots of the course, their general info, whether they're assigned to someone or not, and if they are, then the person they are assigned to.
Response Example:
[
{
"slotId": "5fe50011460d320d2c04e06b",
"startTime": "2020-12-24T20:54:41.245Z",
"endTime": "2020-12-24T20:54:41.245Z",
"location": "C6.304",
"isAssigned": false
},
{
"slotId": "5fe50012460d320d2c04e06c",
"startTime": "2020-12-24T20:54:42.061Z",
"endTime": "2020-12-24T20:54:42.061Z",
"location": "C6.305",
"isAssigned": true,
"staffTeachingSlotId": "ac-2",
"staffTeachingSlotSubType": "instructor",
"staffTeachingSlotName": "Hassan Soubra"
}
]

---

===========================================================================================================
---------------------------------------------courseInstructorRoutes----------------------------------------
===========================================================================================================
To begin testing you will need a token. To get the token, send a post request using use the "/api/login" route with 
the follow body:
{
    "email":"soubra@guc.com",
    "password":"12345"
}
then the token will be returned in the header. For any upcoming request, include 
the returned token in the header of the request to authenticate.

----------------------------------------------------------------------------------

Functionality: View the coverage of course(s) current instructor is assigned to.
Route: /api/instructor/view-course-coverage/:course 
Parameters: course is the name of the course that the instructor teaches and that we want to get the course coverage of
Example of how to call the route: /api/instructor/view-course-coverage/CSEN605: DSD
Request type: GET
Response: The course coverage of a specific course that the instructor teaches
Response Example:
Course coverage of this course is 0.5%

Note: this route is used to get the course coverage for a particular course. To get the course coverage of ALL courses that the instructor teaches, just call this route for every single course
---

---

Functionality: View the slots asignment of course(s) course instructror is assigned to.
Route: /api/instructor/view-slot-assign-course/:course
Parameters: course is the name of the course that the instructor teaches and that he wants to see the slot assignment of
Example of how to call the route: /api/instructor/view-slot-assign-course/CSEN605: DSD
Request type: GET
Response: JSON file containing the slots assignments of a course that an instuctor is assigned to
Response Example:
[
    {
        "startTime": "2020-12-20T10:10:00.000Z",
        "endTime": "2020-12-20T10:11:30.000Z",
        "staff assigned to course": "Slot not assigned yet"
    },
    {
        "startTime": "2020-12-20T10:08:00.000Z",
        "endTime": "2020-12-20T10:09:30.000Z",
        "staff assigned to course": "Hassan Soubra"
    }
]

Note: this route is used to get the course assignments for a particular course. To get the course assignments of ALL courses that the instructor teaches, just call this route for every single course
---

---

Functionality: View all the staff member per course along with their profiles
Route: /api/instructor/view-staff-course/:course 
Parameters: course is the name of the course of which we want to view its staff profiles
Example of how to call the route: /api/instructor/view-staff-course/CSEN605: DSD
Request type: GET
Response:JSON file All staff teaching this course with their profiles 
Response Example:
[
    {
        "userCode": "ac-10272",
        "subType": "Instructor",
        "email": "soubra@guc.com",
        "name": "Hassan Soubra",
        "office": "C7-219"
    },
    {
        "userCode": "ac-10273",
        "subType": "Teaching Assistant",
        "email": "loaa@guc.com",
        "name": "Loaa",
        "office": "C3-203"
    },
    {
        "userCode": "ac-10272",
        "subType": "Teaching Assistant",
        "email": "walid@guc.com",
        "name": "Walid",
        "office": "C3-203"
    }
]

Note: this route allows the course instructor to see the profiles of ALL staff members that are in a SPECIFiC course that HE teaches. If you want to see the profiles of staff members in ALL of the courses he teaches, then you have to call this route for every single course he teaches.
## }

---

Functionality: View all the staff in the course instructor's department along with their profiles
Route: /api/instructor/view-staff-dep
Request type: GET
Response: JSON file containing all the staff in the course instructor's department along with their proles
Response Example:
[
    {
        "userCode": "ac-10272",
        "subType": "lecturer",
        "email": "soubra@guc.com",
        "name": "Hassan Soubra",
        "office": "C7-219"
    },
    {
        "userCode": "ac-10272",
        "email": "walid@guc.com",
        "name": "Walid",
        "office": "C3-203"
    },
    {
        "userCode": "ac-10273",
        "email": "loaa@guc.com",
        "name": "Loaa",
        "office": "C3-203"
    }
]

## }

---

Functionality: Assign an academic member to an unassigned slots in course(s)
Route: /api/instructor/assign-course/course
Parameters: course is the name of the course that the course instructor is responsible for
Example of how to call the route: /api/instructor/assign-course/CSEN605: DSD
Request type: POST
Request Body:
{
"academicId":"ac-10272",
"slotID":"5fe5e58470505416e45f4b0f"
}
Response: JSON object representing the updated slot  after assigning academic member to it

Response Example:  
{
    "startTime": "2020-12-20T10:10:00.000Z",
    "endTime": "2020-12-20T10:11:30.000Z",
    "staffTeachingSlot": "Walid"
}

NOTE: slotID IS AN OBJECT ID REPRESENTING THE SLOT THAT YOU WANT TO ASSIGN THE ACADEMIC MEmBER TO. IT WILL BE DIFFERENT EVERYTIME YOU SEED THE DATABASE. SO PLEASE CHECK YOUR DB FOR A DSD UNASSIGNED SLOT AND GET ITS OBJECTID
---

---

Functionality: Update assignment of academic member in course(s) he/she is assigned to.
Route: /api/instructor/update-assign/:course
Parameters: course is the name of the course that the course instructor is responsible for
Example of how to call the route: /api/instructor/update-assign/CSEN605: DSD
Request type: POST
Request Body:
{
    "academicId" : "ac-10273",
    "slotID": "5fe5fdb5e8a9dd17449c8228"
}
Response: The updated slot after updating the assignment of the slot

Response Example:  
{
    "startTime": "2020-12-20T10:10:00.000Z",
    "endTime": "2020-12-20T10:11:30.000Z",
    "staffTeachingSlot": "Loaa"
}

NOTE: slotID IS AN OBJECT ID REPRESENTING THE SLOT THAT YOU WANT TO UPDATE ITS ASSIGNMENT. IT WILL BE DIFFERENT EVERYTIME YOU SEED THE DATABASE. SO PLEASE CHECK YOUR DB FOR A DSD UNASSIGNED SLOT AND GET ITS OBJECTID
---

---

Functionality:delete assignment of academic member in course(s) he/she is assigned to.
Route: /instructor/delete-assign/:course
Parameters: course is the name of the course that the course instructor is responsible for
Example of how to call the route: /api/instructor/delete-assign/CSEN605: DSD
Request type: POST
Request Body:
{
    "slotID": "5fe5fdb5e8a9dd17449c8228"
}
Response: The updated slot after deleting the assignment of the slot

Response Example:  
{
    "startTime": "2020-12-20T10:10:00.000Z",
    "endTime": "2020-12-20T10:11:30.000Z",
    "staffTeachingSlot": "N/A"
}

NOTE: slotID IS AN OBJECT ID REPRESENTING THE SLOT THAT YOU WANT TO UPDATE ITS ASSIGNMENT. IT WILL BE DIFFERENT EVERYTIME YOU SEED THE DATABASE. SO PLEASE CHECK YOUR DB FOR A DSD UNASSIGNED SLOT AND GET ITS OBJECTID
---

---

Functionality: Remove an assigned academic member in course(s) he/she is assigned to.
Route: /api/instructor/remove-academicMember/:course/:id
Parameters: id is the id of the academic member that the course instructor wants to remove
Example of how to call the route: /api/instructor/remove-academicMember/CSEN605: DSD/ac-10273
Request type: POST
Response: Indication that the academic instructor has been succesfully deleted from course

Response Example: "Academic member succsfully removed"

---

---

Functionality:Assign an academic member in each of his/her course(s) to be a course coordinator
Route: /api/instructor/assign-academic/:course
Parameters: course is the name of the course for which the course instructor wants to assign a course coordinator
Example of how to call the route: /api/instructor/assign-academic/CSEN605: DSD
Request type: POST
Request Body:
{
    "academicID" : "ac-10272"
}
Response: JSON file for the updated course

Response Example:  
{
    "courseName": "CSEN605: DSD",
    "coordinator": "Walid",
    "unassignedSlots": 3
}

=================================================================================
-----------------------------------HRRoutes-----------------------------------
=================================================================================
To begin testing you will need a token. To get the token, send a post request with 
the follow body:
{
    "email":"HR1@guc.edu.eg",
    "password":"12345"
}
then the token will be returned in the header. For any upcoming request, include 
the returend token in the header of the request to authenticate.
----------------------------------------------------------------------------------


Functionality: Adds a new location
Route: /api/hr/addLocation
Request type: POST
Request Body: {
    "roomNr":"C3.101",
    "roomType":"tutorial room",
    "capacity":10
}
---------------------------------------------------------------------------------


Functionality: Adds a new location
Route: /api/hr/addLocation
Request type: POST
Request Body: {
    "roomNr":"C3.210",
    "roomType":"lab",
    "capacity":25
}
---------------------------------------------------------------------------------

Functionality: Edits an existing location
Route: /api/hr/editLocation
Request type: POST
Request Body: {
	"roomNr":"C3.210",
	"capacity":14,
    "roomType":"office"
}
---------------------------------------------------------------------------------

Functionality: Deletes an existing location
Route: /api/hr/deleteLocation
Request type: POST
Request Body: {
    "roomNr":"C3.101"
}

---------------------------------------------------------------------------------

Functionality: Adds a new faculty
Route: /api/hr/addFaculty
Request type: POST
Request Body: {
    "facultyName":"MET"
}

---------------------------------------------------------------------------------

Functionality: Adds a new faculty
Route: /api/hr/addFaculty
Request type: POST
Request Body: {
    "facultyName":"IET"
}

---------------------------------------------------------------------------------

Functionality: Adds a new faculty
Route: /api/hr/addFaculty
Request type: POST
Request Body: {
    "facultyName":"EMS"
}

---------------------------------------------------------------------------------

Functionality: Update an existing faculty by adding the department we defined in the
init route to it. the ._id used in the department array is the retrived from the 
depratment that is defined in the init file
Route: /api/hr/editFaculty
Request type: POST
Request Body: {
    "facultyName":"MET",
    "departments": ["5fe52b88b0bf8714dc4987d0"]
}

---------------------------------------------------------------------------------

Functionality: delete an existing Faculty
Route: /api/hr/deleteFaculty
Request type: POST
Request Body: {
    "facultyName":"MET"
}

---------------------------------------------------------------------------------

Functionality: add a department under a faculty
Route: /api/hr/addDepartment
Request type: POST
Request Body: {
    "departmentName":"CSEN",
    "facultyName":"IET"
}

---------------------------------------------------------------------------------

Functionality: Update a department under faculty
Route: /api/hr/editDepartment
Request type: POST
Request Body: {
    "departmentName":"CSEN",
    "oldFacultyName":"IET",
    "newFacultyName":"EMS"
}
---------------------------------------------------------------------------------

Functionality: delete a department under faculty
Route: /api/hr/deleteDepartment
Request type: POST
Request Body: {
    "departmentName":"CSEN",
    "oldFacultyName":"EMS"
	}

---------------------------------------------------------------------------------

Functionality: add a course under a department
Route: /api/hr/addCourse
Request type: POST
Request Body: {
    "departmentName":"CSEN",
    "courseName":"Csen301"
}

---------------------------------------------------------------------------------

Functionality: Update a course under a department
Route: /api/hr/editCourse
Request type: POST
Request Body: {
    "courseName":"Csen301",
    "oldDepartmentName":"CSEN",
    "newDepartmentName":"DMET"
}
---------------------------------------------------------------------------------

Functionality: delete a course under a department
Route: /api/hr/deleteCourse
Request type: POST
Request Body: {
    "courseName":"Csen301",
    "oldDepartmentName":"DMET"
	}
---------------------------------------------------------------------------------

Functionality: add a new staff member
Route: /api/hr/addStaffMember
Request type: POST
Request Body: {
          "email":"HR2@guc.edu.eg",
          "name":"HR Employee Name",
	      "type":"HR",
	      "office":"C3.210",
	      "dayOff":"Saturday",
          "Salary":3000,
          "facultyName":"MET"
}

---------------------------------------------------------------------------------

Functionality: update staff member
Route: /api/hr/editStaffMember
Request type: POST
Request Body: {
	      "id":"hr-2",
          "email":"HRNew@guc.edu.eg",
          "name":"HRNew Employee Name"
}


---------------------------------------------------------------------------------

Functionality: delete staff member
Route: /api/hr/deleteStaffMember
Request type: POST
Request Body: {
          "id":"hr-2"
}

---------------------------------------------------------------------------------

Functionality: add missing attendance record
Route: /api/hr/addAttendanceRecord
Request type: POST
Request Body: {
"id":"ac-1",
"attendanceRecord":  [{
        "op": "sign in",
        "time": "2020-12-20T14:08:31.848Z"}
        ,{
        "op": "sign out",
        "time": "2020-12-20T14:11:31.848Z",
		"net":"-324"
}
]
}

---------------------------------------------------------------------------------

Functionality: view staff member attendance record
Route: /api/hr/viewAttendance
Request type: POST
Request Body: {
"id":"ac-1"
}
Response: Returns the overall attendance record
Example: [
    {
        "op": "sign in",
        "time": "2020-12-20T14:08:31.848Z"}
        ,
        {
        "op": "sign out",
        "time": "2020-12-20T17:08:31.848Z",
		"net":"-324"
}
]


---------------------------------------------------------------------------------

Functionality: view staff members with missing days/hours
Route: /api/hr/viewMissingDaysOrHours
Request type: POST

Response: Returns an array containing the ids + names of staff with missing days/hours
Example: [
[
    "ac-1 Academic Member",
    "hr-1 HR 1",
    "ac-2 Academic Member2"
]]

---------------------------------------------------------------------------------

Functionality: edit staff members base salary(before deductions)
Route: /api/hr/updateSalary
Request type: POST
Request Body: {
          "id":"hr-1",
		  "salary":5000
}



---------------------------------------------------------------------------------

Functionality: view staff members salary after deductions
Route: /api/hr/viewSalary
Request type: POST
Request Body: {
          "id":"hr-1"
}
Response: Returns the salary after the deduction based on missing days, hours and minutes
Example: 4000

---------------------------------------------------------------------------------


## }

---
