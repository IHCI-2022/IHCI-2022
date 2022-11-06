import { remindSchedule } from '../components/wx-utils/wx-utils'
import apiAuth from '../components/auth/api-auth'
var mongoose = require('mongoose')

var userDB = mongoose.model('user')

const remind = async (req, res, next) => {
    const target = req.body.target;
    const schedule = req.body.schedule;
    const source = req.body.source;
    remindSchedule(target, source, schedule);
    res.send({'status': 200});
}

const notice = async (req, res, next) => {
    const userID = req.body.userID
    const scheduleObj = req.body.Obj
    const teamname = ' '
    const type = req.body.type
    let creator
    await userDB.findByUserId(scheduleObj.creatorId).then((result) => {
        console.log(result)
        creator = {
            name: result.personInfo.name,
            username: result.username,
            _id: result._id,
        }
    })
    const noticeObj = {
        create_time: Date.parse(scheduleObj.dateCreated),
        teamId: ' ',
        creator: creator,
        title: scheduleObj.scheduleName,
        _id: scheduleObj.calendarId,
        content: ' ',
        scheduleId: scheduleObj.scheduleId,
    }
    try{
        await userDB.addCreateNotice(userID, noticeObj, teamname, type)
        res.send({'status':200})
    }
    catch(error){
        res.send({
            'status':400,
            'error':error
        })
    }
    
}


module.exports = [
    ['POST', '/api/calendar/remind', apiAuth, remind],
    ['POST', '/api/calendar/notice', apiAuth, notice]
];
