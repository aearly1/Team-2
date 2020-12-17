const server = require('../routes/staffRoutes.js')
const app = server.app
const supertest = require('supertest')
const request = supertest(app);
const mongoose = require('mongoose')
const staffMembers = require('../models/staffMembers.js');
beforeAll(async()=>{
    await mongoose.connect('')

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
