import * as React from 'react';
import './style.scss'

import api from '../../../utils/api';
import { timeParse, formatDate, createMarkup } from '../../../utils/util'
import Page from '../../../components/page'


const newTimeLineItemNum = 20
const moreTimeLineItemNum = 10


class TeamChoseItem extends React.PureComponent{
    render() {
        return(
            <div className="admin-team-item" onClick={() => {location.href = '/timeline?teamId=' + this.props.teamId }}>
                <img className="team-img" src={this.props.teamImg}></img>
                <div className="team-name">{this.props.teamName}</div>
            </div>
        )
    }
}


class TimelineItem extends React.PureComponent{

    toOriginHandle = () => {
        var pathname = ''
        var type = 'TOPIC'

        switch(this.props.type){
            case 'CREATE_TOPIC':
            case 'EDIT_TOPIC':
            {
                pathname = '/discuss/topic/' + this.props.content._id
                break
            }
            case 'REPLY_TOPIC':
            case 'EDIT_REPLY':
            {
                pathname = '/discuss/topic/' + this.props.content.topicId
                type = 'REPLY'
                break
            }
            case 'CREATE_TASK':
            case 'CREATE_CHECK_ITEM':
            case 'COPY_TASK':
            case 'MOVE_TASK':
            {
                type = 'TASK'
                pathname = '/todo/' + this.props.tarId
                break
            }
            case 'FOLDER':
            case 'FILE':
            {
                type = 'FILE'
                pathname = '/files/' + this.props.team
                break
            }
            default:
                

        }

        const location = {
            pathname: pathname,
            state:{
                type: type,
                id: this.props.tarId
            },
            query:this.props.folderName? {
                dir: this.props.path
            }
            :this.props.dir ?{
                 dir: this.props.dir,
            } :{}
        }
        this.props.router.push(location)
    }


    typeMap = {
        'CREATE_TOPIC': '??????????????????',
        'REPLY_TOPIC': '??????????????????',
        'DELETE_TOPIC': '??????????????????',

        'DELETE_TOPIC_REPLY': '????????????????????????',

        'CREATE_TASK': '??????????????????',
        'DELETE_TASK': '??????????????????',
        'FINISH_TASK': '??????????????????',

        'REPLY_TASK': '??????????????????',
        'DELETE_TASK_REPLY': '????????????????????????',

        'CREATE_CHECK_ITEM': '?????????????????????',
        'DELETE_CHECK_ITEM': '??????????????????',
        'FINISH_CHECITEM_ITEM': '??????????????????',

        'COPY_TASK': '??????????????????',
        'MOVE_TASK': '??????????????????',
        'EDIT_TOPIC': '??????????????????',
        'EDIT_REPLY': '????????????????????????',
        'CREATE_TASKLIST':'??????????????????',
        'DELETE_TASKLIST':'??????????????????',

        'CHANGE_TASK_HEADER':'???????????????',
        'CHANGE_CHECKITEM_HEADER':'??????????????????',
        'CHANGE_TASK_DDL':'???????????????',
        'CHANGE_CHECKITEM_DDL':'??????????????????',
        'REOPEN_TASK':'????????????????????????',
        'REOPEN_CHECKITEM':'???????????????????????????',
        'EDIT_TASK':'??????????????????',
        'EDIT_CHECK_ITEM':'?????????????????????',
    }
    componentDidMount = () =>{
        if(this.props.content.header){
            this.getUserName(this.props.content.header)
        }
        else(this.setState({headerName:"?????????"}))
    }
    getUserName = async(id) => {
        const result = await api('/api/getUserInfo', {
            method: 'POST',
            body: {
                userId: id,
            }
        })
      
        if(result.state.code === 0){
            this.setState({
                headerName: result.data.userObj.personInfo.name
            })
        }
    }
    state = {
        headerName:""
    }
    deleteTask = ()=>{
        window.toast("?????????????????????")
    }
    render() {
        switch(this.props.type){
            case 'CHANGE_TASK_DDL': 
                return(
                    <div className='news-item-wrap' onClick={() => this.toOriginHandle(this.props.type)}>
                        <div className="time">{formatDate(this.props.create_time, 'hh:mm')}</div>
                        <img src={this.props.creator.headImg} alt="" className="head-img" />

                        <div className="news-con">
                            <div className="des-line">
                                <span className="name">{this.props.creator.name}</span>
                                <span className="type">{this.typeMap[this.props.type]}</span>
                                <span className="topic">&nbsp; {this.props.content.title}&nbsp; ??????????????????&nbsp; </span>
                                <span className="content">{this.props.content.deadline}</span>
                            </div>

                        </div>
                    </div>
                )
            case 'CHANGE_CHECKITEM_DDL':
                return(
                    <div className='news-item-wrap'onClick={() => this.toOriginHandle(this.props.type)}>
                        <div className="time">{formatDate(this.props.create_time, 'hh:mm')}</div>
                        <img src={this.props.creator.headImg} alt="" className="head-img" />

                        <div className="news-con">
                            <div className="des-line">
                                <span className="name">{this.props.creator.name}</span>
                                <span className="type">{this.typeMap[this.props.type]}</span>
                                <span className="topic">&nbsp; {this.props.content.content}&nbsp; ??????????????????&nbsp; </span>
                                <span className="content">{this.props.content.deadline}</span>
                            </div>

                        </div>
                    </div>
                )
            case 'CHANGE_TASK_HEADER': 
                return(
                    <div className='news-item-wrap'onClick={() => this.toOriginHandle(this.props.type)}>
                        <div className="time">{formatDate(this.props.create_time, 'hh:mm')}</div>
                        <img src={this.props.creator.headImg} alt="" className="head-img" />

                        <div className="news-con">
                            <div className="des-line">
                                <span className="name">{this.props.creator.name}</span>
                                <span className="type">{this.typeMap[this.props.type]}</span>
                                <span className="topic">&nbsp; {this.props.content.title} &nbsp;????????????: &nbsp;</span>
                                <span className="content">{this.state.headerName}</span>
                            </div>
                        </div>
                    </div>
                )
            case 'CHANGE_CHECKITEM_HEADER':
                return(
                    <div className='news-item-wrap'onClick={() => this.toOriginHandle(this.props.type)}>
                        <div className="time">{formatDate(this.props.create_time, 'hh:mm')}</div>
                        <img src={this.props.creator.headImg} alt="" className="head-img" />

                        <div className="news-con">
                            <div className="des-line">
                                <span className="name">{this.props.creator.name}</span>
                                <span className="type">{this.typeMap[this.props.type]}</span>
                                <span className="topic">&nbsp; {this.props.content.content} &nbsp;????????????: &nbsp;</span>
                                <span className="content">{this.state.headerName}</span>
                            </div>
                        </div>
                    </div>
                )
            case 'CREATE_TASKLIST': 
                return(
                    <div className='news-item-wrap' onClick={() => this.toOriginHandle(this.props.type)}>
                        <div className="time">{formatDate(this.props.create_time, 'hh:mm')}</div>
                        <img src={this.props.creator.headImg} alt="" className="head-img" />
        
                        <div className="news-con">
                            <div className="des-line">
                                <span className="name">{this.props.creator.name}</span>
                                <span className="type">{this.typeMap[this.props.type]}</span>
                                <span className="topic">{this.props.title}</span>
                            </div>
                            <div className="BraftEditor-container">
                                    <span className="content public-DraftEditor-content BraftEditor-content" dangerouslySetInnerHTML={{__html: this.props.content.content}}>{}</span>
                                </div>
                        </div>
                    </div>
                )
            case 'DELETE_TASKLIST':    case 'DELETE_TASK':        
             return(
                <div className='news-item-wrap' onClick={()=>this.deleteTask()}>
                    <div className="time">{formatDate(this.props.create_time, 'hh:mm')}</div>
                    <img src={this.props.creator.headImg} alt="" className="head-img" />
    
                    <div className="news-con">
                        <div className="des-line">
                            <span className="name">{this.props.creator.name}</span>
                            <span className="type">{this.typeMap[this.props.type]}</span>
                            <span className="topic">{this.props.title}</span>
                        </div>
                        <div className="BraftEditor-container">
                                <span className="content public-DraftEditor-content BraftEditor-content" dangerouslySetInnerHTML={{__html: this.props.content.content}}>{}</span>
                            </div>
                    </div>
                </div>
            )
            default:
                return(
                    <div className='news-item-wrap' onClick={() => this.toOriginHandle(this.props.type)}>
                        <div className="time">{formatDate(this.props.create_time, 'hh:mm')}</div>
                        <img src={this.props.creator.headImg} alt="" className="head-img" />
        
                        <div className="news-con">
                            <div className="des-line">
                                <span className="name">{this.props.creator.name}</span>
                                <span className="type">{this.typeMap[this.props.type]}</span>
                                <span className="topic">{this.props.content.title}</span>
                            </div>
                            <div className="BraftEditor-container">
                                    <span className="content public-DraftEditor-content BraftEditor-content" dangerouslySetInnerHTML={{__html: this.props.content.content}}>{}</span>
                            </div>
                        </div>
                    </div>
                )
        }
    }
}

export default class Timeline extends React.Component{
    componentDidMount = async() => {
        await this.loadTimelineData()
        this.initTeamList()
    }

    loadTimelineData = async () => {
        const queryTeamId = this.props.location.query.teamId
        const queryPerson = this.props.location.query.userId
        const result = await api('/api/timeline/getTimeline', {
            method: 'POST',
            body: {
                teamId: queryTeamId ? queryTeamId :'',
                userId: queryPerson ? queryPerson : '',
            }
        })
        this.setState({
            newsList: result.data,
            memberJumped: !!queryPerson ? !!queryPerson : false,
        }, () => {
             this.appendToShowList(this.state.newsList)
        })
        // if(result.data.length == 0){
        //     this.setState({
        //         noResult: true,
        //     })
        // }
        // if(result.data.length<newTimeLineItemNum){
        //     this.setState({
        //         noMoreResult: true
        //     })
        // }
    }

    initTeamList = () => {
        this.setState({
            shownTeam: this.props.personInfo && this.props.personInfo.teamList || [],
        })
    }
    getMoreTimelineData = async () => {
        const queryTeamId = this.props.location.query.teamId
        const queryPerson = this.props.location.query.userId
        const lastStamp = this.state.lastStamp

        const result = await api('/api/timeline/getTimeline', {
            method: 'POST',
            body: {
                teamId: queryTeamId ? queryTeamId :'',
                userId: queryPerson ? queryPerson : '',
                timeStamp: lastStamp? lastStamp: '',
            }
        })
        this.setState({
            newsList: result.data
        }, () => {
            this.appendToShowList(this.state.newsList)
        })
        if(result.data.length<moreTimeLineItemNum){
            this.setState({
                noMoreResult: true,
                memberJumped: !!queryPerson ? !!queryPerson : false,
            })
        }
    }

    appendToShowList = (list) => {
        let showList = this.state.showList
        var listLength = list.length
        if(listLength > 0){
            list.map((item) => {
                var timeKey = timeParse(item.create_time)
                if(!showList[timeKey]) {
                    showList.keyList.push(timeKey)
                    showList[timeKey] = {}
                    showList[timeKey].teamKeyList = []
                }
                if(!showList[timeKey][item.teamId]) {
                    showList[timeKey].teamKeyList.push(item.teamId)
                    showList[timeKey][item.teamId] = {}
                    showList[timeKey][item.teamId].teamName = item.teamName
                    showList[timeKey][item.teamId].newsList = []
                }
                showList[timeKey][item.teamId].newsList.push(item)
            })
            this.setState({
                showList: showList,
                lastStamp: list[listLength - 1].create_time
            })
        }
        else if (showList.keyList.length == 0){
            this.setState({
                noResult: true,
            })
        } else {
            this.setState({
                noMoreResult: true,
            })
        }
    }

   

    state = {
        // type: create, reply
        newsList: [],
        loadMoreCount:1,
        // showList????????????????????????
        // showList: {
        //     timeKeyList: ['20170101', '20170102'],
        //     '20170101': {
        //         'teamKeyList': ['teamId1','teamId2']
        //         'teamId1' : {
        //             teamName: '??????????????????111',
        //             newsList: []
        //         },
        //         'teamId2' : {
        //             teamName: '??????????????????222',
        //             newsList: []
        //         },
        //     },
        // }
        showList: {
            keyList : [],
        },

        showTeamFilter: false,
        teamList: [],
        noResult: false,
        noMoreResult: false,
        memberJumped: false,
    }

    loadMoreHandle = () => {
        this.setState({
            loadMoreCount:this.state.loadMoreCount+1
        },this.loadTimelineData)}

    teamFilterHandle = () => {
        this.setState({
            teamList: this.props.personInfo.teamList,
            showTeamFilter: !this.state.showTeamFilter
        })
    }

    searchInputHandle = (e) => {
        this.setState({
            searchInput: e.target.value
        })

        const teamList = []
        var partten = new RegExp(e.target.value)
        if(e.target.value) {
            this.props.personInfo.teamList.map((item) => {
                if(partten.test(item.teamName)) {
                    teamList.push(item)
                }
            })
            this.setState({
                teamList: teamList
            })
        } else {
            this.setState({
                teamList: this.props.personInfo.teamList
            })
        }
    }

    render() {
        const showList = this.state.showList
        return (
            <Page title='?????? - IHCI' className="news-page">

                {
                    this.state.showTeamFilter && <div className="team-list" onMouseLeave={this.teamFilterHandle}>
                        <input type="text" className="search" onChange={this.searchInputHandle} />
                        <div className="admin-team-item" onClick={() => {location.href = '/timeline'}}>
                            <div className="team-name"> ????????????</div>
                        </div>
                        <div className="head">????????????</div>
                        {
                            this.state.teamList.map((item) => {
                                if (item.marked) {
                                    return (
                                        <TeamChoseItem key={'mark-team-' + item.teamId} routerTo={this.routerTo} {...item} />
                                    )
                                }
                            })
                        }
                        <div className="head">????????????</div>
                        {
                            this.state.teamList.map((item) => {
                                return (
                                    <TeamChoseItem key={'team-' + item.teamId} routerTo={this.routerTo} {...item} />
                                )
                            })
                        }
                    </div>
                }

                <div className="news-list page-wrap">
                    {
                        !this.state.memberJumped && <div className='title-bar'>
                            <div className='filter-title'>
                                ????????????:
                                <span className='team-filter'  onClick={this.teamFilterHandle}>
                                {
                                    this.props.location.query.teamId ? this.props.personInfo.teamList.map((item) => {
                                        if(item.teamId == this.props.location.query.teamId)
                                            return item.teamName
                                    }) : "????????????"
                                }
                                </span>
                            </div>

                        </div>
                    }


                    {
                        showList.keyList.map((timeKey) => {
                            return (
                                <div className="news-day" key={'time-group-' + timeKey}>
                                    {/* ????????? */}
                                    <div className="time-ball">{timeKey[4] + timeKey[5] + '/' + timeKey[6] + timeKey[7]}</div>
                                    {
                                        showList[timeKey].teamKeyList.map((teamKey) => {
                                            return (
                                                <div key={'group-line-' + timeKey + teamKey}>
                                                    {/* ????????? */}
                                                    <div className="group-line">{showList[timeKey][teamKey].teamName}</div>
                                                    {
                                                        showList[timeKey][teamKey].newsList.map((item) => {
                                                            return <TimelineItem key={'timeline-' + item._id} router={this.props.router}  {...item}/>
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    }

                    {this.state.noResult && <div className='null-info'>?????????</div>}
                    <div className='load-more-bar'>
                        {!this.state.noResult && !this.state.noQuery && !this.state.noMoreResult && <div className="load-more" onClick={this.getMoreTimelineData}>
                            ??????????????????
                        </div>}
                        {this.state.noMoreResult && <div className="no-more-result-alert">?????????????????????</div>}
                    </div>
                </div>


            </Page>
        )
    }
}
