const server = require('../routes/staffRoutes.js')
const app = server.app
const supertest = require('supertest')
const request = supertest(app);
const mongoose = require('mongoose')
const staffMembers = require('../models/staffMembers.js');
const slot = require('../models/slot')
const bcrypt = require('bcrypt')

beforeAll(async()=>{
mongoose.connect('mongodb+srv://admin:admin@cluster0.ccvnk.mongodb.net/diabs_tester_HOD?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true }).then(console.log('Successfully Connected to The Test Database'))
})
beforeEach(async()=>{
    await staffMembers.deleteMany();
    await slot.deleteMany();
})

describe('Tests for Staff Members',()=>{
    it('should log the staff in ',async()=>{
        const salt = await bcrypt.genSalt(12)
        const hashedPassword =await bcrypt.hash("passwordsha2y",salt)
        const mem = new staffMembers({
            email: "sexysoso@hotmail.com",
            password: hashedPassword
        })
        await mem.save()
    const response = await request.post('/login').send({
        email: "sexysoso@hotmail.com",
            password: "passwordsha2y"
    })
    expect(response.status).toBe(200)
    })

    it('should display profile',async()=>{
        const salt = await bcrypt.genSalt(12)
        const hashedPassword =await bcrypt.hash("passwordsha2y",salt)
        const s = new slot({
            slotNumber: 1, //an id for the slot
        startTime: new Date("2015-03-25T12:00:00"), //start time of slot
        endTime: new Date("2015-03-25T12:30:00"), // end time of slot
        courseTaughtInSlot:"ABC123", //what course will be taught in the slot 
        staffTeachingSlot: "43-8530",// null if this slot is still not assigned to anyone
        slotLocation: "H20", //ex. H14, C7.301
        replacementStaff: null //if another staff member will replace a staff member on leave
        })
        await s.save()
        
        const mem = new staffMembers({
            email: "sexysoso@hotmail.com",
            password: hashedPassword,
            id: "43-8530",
            name: "7amada sha3r",
            type: "Academic", // can either be HR or academic
            office: 69420,
            dayOff: "Saturday",
            facultyName: "Tegara", //null for HR
            departmentName: "Fawanees", //null for HR or just set to HR
            attendance: [{day:1,month:9, year:2020, history: [ {signedIn: "7:00", signedOut: "9:00"},{ signedIn: "11:00", signedOut: "13:00"}]}],
            courses: ["ABC123","XYZ567"], //array with course ids of courses they teach && empty list in case of HR
            scheduleSlots: [s._id],
            annualLeaves: 5,
            Salary: 10
        })
        await mem.save()
        const response = await request.get('/profile');
        expect(response.body.Name).toBe("7amada sha3r")
    })
    
})
