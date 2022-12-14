var _ = require('underscore'),
    resProcessor = require('../components/res-processor/res-processor'),
    proxy = require('../components/proxy/proxy'),
    conf = require('../conf');

import fetch from 'isomorphic-fetch';
import lo from 'lodash';
import apiAuth from '../components/auth/api-auth'
import{
    isMember,
    isAdmin,
    isCreator
}from '../middleware/auth-judge/auth-judge'

import {
    web_codeToAccessToken,
    web_accessTokenToUserInfo,
    web_codeToUserInfo,
    applyIntoTeam,
    admitIntoTeam
} from '../components/wx-utils/wx-utils'
import { MongooseDocument } from 'mongoose';

var mongoose = require('mongoose')

var teamDB = mongoose.model('team')
var roleDB = mongoose.model('role')
var userDB = mongoose.model('user')
var topicDB = mongoose.model('topic')
var tasklistDB = mongoose.model('tasklist')
var taskDB = mongoose.model('task')
var folderDB = mongoose.model('folder')

var file = require('../models/file')

const creatTeam = async (req, res, next) => {
    const teamName = req.body.teamName
    const teamImg = req.body.teamImg
    const teamDes = req.body.teamDes
    const userId = req.rSession.userId

    if (!teamName) {
        resProcessor.jsonp(req, res, {
            state: { code: 3000, msg: "参数不全" },
            data: {}
        });
        return
    }

    try {
        let teamObj = await teamDB.createTeam(teamName, teamImg, teamDes)
        await teamDB.addMember(teamObj._id, userId, 'creator')
        await userDB.addTeam(userId, teamObj, 'creator')
        await roleDB.createRole(teamObj._id, userId, 'creator') 
        teamObj = await teamDB.findByTeamId(teamObj._id)

        await folderDB.createFolder(teamObj._id,'','')
        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '创建成功' },
            data: {
                teamObj: teamObj
            }
        });
    } catch (error) {
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
        console.error(error);
    }
}

const joinTeam = async (req, res, next) => {
    const teamId = req.body.teamId
    const userId = req.rSession.userId

    if (!teamId) {
        resProcessor.jsonp(req, res, {
            state: { code: 3000, msg: "参数不全" },
            data: {}
        });
        return
    }

    try {
        let teamObj = await teamDB.findByTeamId(teamId)
        if (!teamObj) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: '团队不存在' },
                data: {}
            });
            return
        }

        // 检验是否已经加入该团队
        let isJoined = false
        teamObj.memberList.map((item) => {
            if (item.userId === userId) {
                isJoined = true
            }
        })
        if (isJoined) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: '您已在团队中' },
                data: {}
            });
            return
        }

        //提交申请
        // let userObj = userDB.baseInfoById(userId);
        // applyIntoTeam(teamObj.memberList,userObj);


        await teamDB.addMember(teamId, userId, 'member')
        await userDB.addTeam(userId, teamObj, 'member')
        await roleDB.createRole(teamObj._id, userId, 'member') 
        teamObj = await teamDB.findByTeamId(teamId)
        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '加入成功' },
            data: {
                teamObj: teamObj
            }
        });

    } catch (error) {
        console.error(error);
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
    }
}

const modifyMemberRole = async (req, res, next) => {
    const userId = req.rSession.userId
    const teamId = req.body.teamId
    const role = req.body.role

    if (!teamId || !role) {
        resProcessor.jsonp(req, res, {
            state: { code: 3000, msg: "参数不全" },
            data: {}
        });
        return
    }
    try {
        let teamObj = await teamDB.findByTeamId(teamId)
        if (!teamObj || !teamObj.memberList) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: '团队不存在' },
                data: {}
            });
            return
        }

        let myRole = null
        teamObj.memberList.map((item) => {
            if (item.userId == userId) {
                myRole = item.role
            }
        })

        if (!myRole) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: '你不在这个团队里面' },
                data: {}
            });
            return
        }

        if (myRole == "member") {
            resProcessor.jsonp(req, res, {
                state: { code: 1, msg: '成员没有管理权限' },
                data: {}
            });
            return
        }

        if (role == "creator") {
            resProcessor.jsonp(req, res, {
                state: { code: 1, msg: '不能设置创建者' },
                data: {}
            });
            return
        }

        await teamDB.changeMemberRole(teamId, userId, role)
        await userDB.modifyTeamRole(userId, teamId, role)
        teamObj = await teamDB.findByTeamId(teamId)
        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '修改成功' },
            data: {
                teamObj: teamObj
            }
        });
    } catch (error) {
        console.error(error);
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
    }
}

const modifyTeamInfo = async (req, res, next) => {
    const teamId = req.body.teamId
    const teamInfo = req.body.teamInfo
    const userId = req.rSession.userId

    /* teamInfo

        name: name, 
        teamImg: imgUrl,
        teamDes: des,
    */

    if (!teamInfo || !teamId) {
        resProcessor.jsonp(req, res, {
            state: { code: 3000, msg: "参数不全" },
            data: {}
        });
        return
    }
    try {
        let teamObj = await teamDB.findByTeamId(teamId)
        if (!teamObj) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: '团队不存在' },
                data: {}
            });
            return
        }

        const result = await teamDB.updateTeam(teamId, teamInfo)

        // 团队中所有成员更新team信息
        teamObj = await teamDB.findByTeamId(teamId)
        teamObj.memberList.map((item) => {
            userDB.updateTeam(item.userId, teamObj)
        })

        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '设置成功' },
            data: {
                teamObj: result
            }
        });

    } catch (error) {
        console.error(error);
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
    }

}

const markTeam = async (req, res, next) => {
    const teamId = req.body.teamId
    const markState = req.body.markState
    const userId = req.rSession.userId

    if (!teamId || markState == undefined) {
        resProcessor.jsonp(req, res, {
            state: { code: 3000, msg: "参数不全" },
            data: {}
        });
        return
    }

    try {
        let teamObj = await teamDB.findByTeamId(teamId)
        if (!teamObj) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: '团队不存在' },
                data: {}
            });
            return
        }
        let userObj = await userDB.findByUserId(userId)
        if (!userObj) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: '用户不存在' },
                data: {}
            });
            return
        }

        const result = await userDB.markTeam(userId, teamId, markState)

        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '设置成功' },
            data: {
                teamObj: result
            },
        });


    } catch (error) {
        console.error(error);
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
    }

}
const leaveTeam = async(req,res) =>{
    const teamId = req.body.teamId
    const userId  =  req.rSession.userId
    try{
        let teamObj = await teamDB.findByTeamId(teamId)
        const result = await teamDB.delMember(teamId, userId)
        const result2 = await roleDB.findRole(userId, teamId)
        await roleDB.delRoleById(result2._id)
        await userDB.delTeam(userId, teamId)

        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '删除成功' },
            data: {}
        });
    }catch (error) {
        console.error(error);
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
    }

}
const kikMember = async (req, res, next) => {
    const teamId = req.body.teamId
    const tarMemberId = req.body.memberId
    const userId = req.rSession.userId


    if (!tarMemberId || !teamId) {
        resProcessor.jsonp(req, res, {
            state: { code: 3000, msg: "参数不全" },
            data: {}
        });
        return
    }

    try {
        let teamObj = await teamDB.findByTeamId(teamId)
        if (!teamObj) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: '团队不存在' },
                data: {}
            });
            return
        }

        let power = false
        teamObj.memberList.map((item) => {
            if (item.userId == userId && (item.role == 'creator' || item.role == 'admin')) {
                power = true
            }
        })
        if (!power) {
            resProcessor.jsonp(req, res, {
                state: { code: 1, msg: '没有权限' },
                data: {}
            });
            return
        }
        const result = await teamDB.delMember(teamId, tarMemberId)
        await userDB.delTeam(tarMemberId, teamId)
        const result2 = await roleDB.findRole(tarMemberId, teamId)
        await roleDB.delRoleById(result2._id)

        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '设置成功' },
            data: {
            }
        });

    } catch (error) {
        console.error(error);
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
    }
}

const teamInfo = async (req, res, next) => {
    const teamId = req.body.teamId
    if (!teamId) {
        resProcessor.jsonp(req, res, {
            state: { code: 3000, msg: "参数不全" },
            data: {}
        });
        return
    }
    try {
        let teamObj = await teamDB.findByTeamId(teamId)
        if (!teamObj) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: '团队不存在' },
                data: {}
            });
            return
        }
        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '请求成功' },
            data: {
                teamObj: teamObj
            }
        });
    } catch (error) {
        console.error(error);
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
    }
}


// 个人首页、获取团队列表
const teamInfoList = async (req, res, next) => {
    const teamIdList = req.body.teamIdList

    if (!teamIdList || !teamIdList.length) {
        resProcessor.jsonp(req, res, {
            state: { code: 3000, msg: "参数不全" },
            data: {}
        });
        return
    }

    try {
        const promiseList = []
        teamIdList.map((item) => {
            promiseList.push(teamDB.findByTeamId(item))
        })
        const result = await Promise.all(promiseList)
        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '请求成功' },
            data: {
                teamInfoList: result
            }
        });
    } catch (error) {
        console.error(error);
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
    }
}

// 直接返回团队的成员列表
const memberList = async (req, res, next) => {
    const teamId = req.body.teamId
    if (!teamId) {
        resProcessor.jsonp(req, res, {
            state: { code: 3000, msg: "参数不全" },
            data: {}
        });
        return
    }
    try {
        const teamObj = await teamDB.findByTeamId(teamId)
        if (!teamObj) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: "团队不存在" },
                data: {}
            });
            return
        }
        const promiseList = []
        teamObj.memberList.map((item) => {
            promiseList.push(userDB.baseInfoById(item.userId))
        })
        const result = await Promise.all(promiseList)
        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '请求成功' },
            data: {
                memberList: result
            }
        });
    } catch (error) {
        console.error(error);
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
    }
}

const taskList = async (req, res, nect) => {
    const teamId = req.body.teamId
    if (!teamId) {
        resProcessor.jsonp(req, res, {
            state: { code: 3000, msg: "参数不全" },
            data: {}
        });
        return
    }
    try {
        let team = await teamDB.findByTeamId(teamId)
        if (!team) {
            resProcessor.jsonp(req, res, {
                state: { code: 3001, msg: '团队不存在' },
                data: {}
            });
            return
        }
        const teamObj = team.toObject()
        const taskListTemp = teamObj.taskList
        const taskList = []
        for (var i = 0; i < taskListTemp.length; i++) {
            var headername = ""
            if (taskListTemp[i].header) {
                const headerObj = await userDB.findByUserId(taskListTemp[i].header)
                headername = headerObj.username
            }
            var taskListCom = ""
            if(taskListTemp[i].completed_time) {
                const date = new Date(taskListTemp[i].completed_time)
                taskListCom = date
            }
            var taskListDdl = ""
            if(taskListTemp[i].deadline) {
                const date = new Date(taskListTemp[i].deadline)
                taskListDdl = (date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()).replace(/([\-\: ])(\d{1})(?!\d)/g,'$10$2')
            }
            const obj1 = {
                id: taskListTemp[i]._id,
                title: taskListTemp[i].title,
                content: taskListTemp[i].content,
                deadline: taskListDdl,
                state: taskListTemp[i].state,
                completed_time: taskListCom,
                completer:taskListTemp[i].completer,
                header: {
                    headerId: taskListTemp[i].header,
                    headername: headername
                },
                fileList: taskListTemp[i].fileList
            }
            taskList.push(obj1)
        }
        const tasklistListTemp = teamObj.tasklistList
        const tasklistList = []
        for (var i = 0; i < tasklistListTemp.length; i++) {
            const temp = await tasklistDB.findByTasklistId(tasklistListTemp[i]._id)
            if (!temp) {
                continue;
            }
            const result = temp.toObject()
            const task = []
            for (var j = 0; j < result.taskList.length; j++) {
                var headername = ""
                if (result.taskList[j].header) {
                    const headerObj = await userDB.findByUserId(result.taskList[j].header)
                    headername = headerObj.username
                }
                var taskListCom = ""
                if(result.taskList[j].completed_time) {
                    const date = new Date(result.taskList[j].completed_time)
                    taskListCom = (date.getUTCFullYear()+'-'+(date.getUTCMonth()+1)+'-'+date.getUTCDate()+"T"+(date.getUTCHours()>9?"":"0")+date.getUTCHours()+':'+date.getUTCMinutes()+':'+date.getUTCSeconds()+'.'+date.getUTCMilliseconds()+'Z').replace(/([\-\: ])(\d{1})(?!\d)/g,'$10$2')
                    // taskListCom = date.toUTCString()
                }
                var taskListDdl = ""
                if(result.taskList[j].deadline) {
                    taskListDdl = result.taskList[j].deadline
                }
                const obj2 = {
                    taskId: result.taskList[j]._id,
                    title: result.taskList[j].title,
                    content: result.taskList[j].content,
                    deadline: taskListDdl,
                    state: result.taskList[j].state,
                    completer: result.taskList[j].completer,
                    completed_time: taskListCom,
                    header: {
                        headerId: result.taskList[j].header,
                        headername: headername
                    },
                    fileList: result.taskList[j].fileList
                }
                task.push(obj2)
            }

            const obj3 = {
                _id: tasklistListTemp[i]._id,
                name: tasklistListTemp[i].name,
                taskList: task
            }

            tasklistList.push(obj3)
        }
        var checkitemNum = 0;
        var checkitemDoneNum = 0;
        var taskIdList = []
        for (var i = 0; i < taskList.length; i++) {
            taskIdList.push(taskList[i]._id)
        }
        for (var i = 0; i < tasklistList.length; i++) {
            for (var j = 0; j < tasklistList[i].taskList.length; j++) {
                taskIdList.push(tasklistList[i].taskList[j]._id)
            }
        }
        const task = await taskDB.findByTaskIdList(taskIdList)
        for (var i = 0; i < task.length; i++) {
            if (task[i].checkitemList.length) {
                checkitemNum += task[i].checkitemList.length;
                for (var j = 0; j < task[i].checkitemList.length; j++) {
                    if (task[i].checkitemList[j].state == true)
                        checkitemDoneNum++;
                }
            }
        }
        const taskObj = {
            taskList: taskList,
            tasklistList: tasklistList,
            checkItemNum: checkitemNum,
            checkItemDoneNum: checkitemDoneNum
        }
        resProcessor.jsonp(req, res, {
            state: { code: 0, msg: '请求成功' },
            data: {
                taskObj: taskObj
            }
        });
    } catch (error) {
        console.error(error);
        resProcessor.jsonp(req, res, {
            state: { code: 1000, msg: '操作失败' },
            data: {}
        });
    }
}



module.exports = [
    ['POST', '/api/team/info', apiAuth, teamInfo],
    ['POST', '/api/team/infoList', apiAuth, teamInfoList],

    ['POST', '/api/team/create', apiAuth, isMember, creatTeam],
    ['POST', '/api/team/modifyTeamInfo', apiAuth, isMember, modifyTeamInfo],
    ['POST', '/api/team/join', apiAuth, joinTeam],
    ['POST', '/api/team/roleModify', apiAuth, isCreator, modifyMemberRole],
    ['POST', '/api/team/markTeam', apiAuth, isMember, markTeam],
    ['POST', '/api/team/kikMember', apiAuth, isAdmin, kikMember],
    ['POST', '/api/team/leaveTeam',apiAuth, isMember, leaveTeam],

    ['POST', '/api/team/memberList', apiAuth, isMember, memberList],
    ['POST', '/api/team/taskList', apiAuth, taskList],

];
