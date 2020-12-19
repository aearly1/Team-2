# Team-2
Diab was here

=================================================================================
-----------------------------------staffRoutes-----------------------------------
=================================================================================

Functionality: Logs the staff member in
Route: /login
Request type: POST
Request Body: {"email":"sexysoso@hotmail.com",
	"password":"passwordsha2y"}

---------------------------------------------------------------------------------

Functionality: Logs the staff member out
Route: /logout
Request type: POST

---------------------------------------------------------------------------------

Functionality: Views the profile of the staff member
Route: /profile
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
Route: /profile/update
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
Route: /passwordreset
Request type: PUT
Request Body: {
	"oldpassword":"passwordsha2y",
	"newpassword":"passwordmeshsha2y"
}

---------------------------------------------------------------------------------

Functionality: Signs the staff member in to mark their attendance
Route: /signin
Request type: POST

---------------------------------------------------------------------------------

Functionality: Signs the staff member out to mark them leaving
Route: /signout
Request type: POST

---------------------------------------------------------------------------------

Functionality: Views the attendance of the staff member for a specified month
Route: /attendance/:month
Request type: GET
Parameters: month is the month of the attendance viewed
Example of how to call the route: /attendance/12
Response: Array of JSON Objects representing the attendance

---------------------------------------------------------------------------------

Functionality: Views the overall attendance 
Route: /attendance
Request type: GET
Response: Array of JSON Objects representing the attendance

---------------------------------------------------------------------------------

Functionality: Views the days missed by a staff member (that was not signed) where it was not neither a dayoff nor a friday
Route: /missingdays
Request type: GET
Response: Array of the days missed

---------------------------------------------------------------------------------

Functionality: Views the net missing hours of the current month
Route: /missinghours
Request type: GET
Response: The number of missing hours

---------------------------------------------------------------------------------