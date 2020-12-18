const server = require('../routes/staffRoutes.js')
const app = server.app
const supertest = require('supertest')
const request = supertest(app);
const mongoose = require('mongoose')
const staffMembers = require('../models/staffMembers.js');
beforeAll(async()=>{
mongoose.connect('mongodb+srv://admin:admin@cluster0.ccvnk.mongodb.net/diabs_tester_HOD?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true }).then(console.log('Successfully Connected to The Test Database'))
})
beforeEach(async()=>{
    await staffMembers.deleteMany();
})

describe('Tests for Staff Members',()=>{
    it('should log the staff in ',async()=>{
        const mem = new staffMembers({
            email: "sexysoso@hotmail.com",
            password: "passwordsha2y"
        })
        await mem.save();
    const response = await request.post('/login').send({
        email: "sexysoso@hotmail.com",
            password: "passwordsha2y"
    })
    expect(response.status).toBe(200)
    })
    
})
