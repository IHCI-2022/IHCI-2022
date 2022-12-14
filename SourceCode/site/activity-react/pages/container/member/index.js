import * as React from 'react';
import './style.scss'

import api from '../../../utils/api';
import Page from '../../../components/page'


export default class Members extends React.Component{
    componentDidMount = async() => {
        if (this.props.personInfo.teamList.length != 0){
            this.setState({
                teamList: this.props.personInfo && this.props.personInfo.teamList || [],
            })
        }
        else this.initTeamList()
        this.initMemberList()
    }

    initMemberList = async (id) => {
        let result = null

        //如果过了一定时间，后端数据还没全部取回来，则显示loading图标
        setTimeout(()=>{
            if(!result){
                this._page.loading.show(true)
            }
        },100)

        result = await api('/api/member', {
            method: 'POST',
            body: id ? {
                teamId : id
            }:{}
        })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
        this.setState({ 
            memberList: result.data
        })
        //已取回全部后端数据，关闭loading图标
        this._page.loading.show(false)

    }

    loadMoreHandle = () => { 
        this.setState({ 
            index: this.state.index + 10
        })
    }

    showMemberList = () => {
        if (this.state.index == 0){
            return this.state.memberList.slice(0,this.state.memberList.length >= 10 ? 10 : this.state.memberList.length)
        }
        else if (this.state.memberList.length - this.state.index > 10 ){
            return this.state.memberList.slice(0,this.state.index)
        }
        else return this.state.memberList
    }

    initTeamList = async () => {
        const result = await api('/api/getMyInfo', {
            method: 'POST',
            body: {}
        })
        if(result.data.userObj) {
            this.setState({
                teamList: result.data.userObj.teamList,
            })
        }
    }

    toTimeLineHandle = (memberId , event) => {
        const query = {userId:memberId,}
        const location = {pathname:'/timeline', query:query}
        this.props.activeTagHandle('/timeline')
        this.props.router.push(location)
    }

    toTeamHandle = (teamId, teamName) => {
        if (teamId){
            this.initMemberList(teamId)
            if (!teamName){
                const teamList = this.props.personInfo.teamList
                for(var i in teamList)
                {
                    if(teamList[i].teamId == teamId)
                        teamName = teamList[i].teamName
                }
            }
        }
        else this.initMemberList()
        this.setState({
            activeTag: teamName == null ? 'all' : teamName,
            index: 0
        })
    }

    state = {
        activeTag: 'all',

        teamList: [],

        index: 0,

        memberList: [],

    }

    render() {
        return (
            <Page title={"成员 - IHCI"} className="member-page" ref={page => this._page = page}>
                <div className="page-wrap">
                    <div className="teamList">
                        <div className={this.state.activeTag == "all" ? "act team-tag-item" : "team-tag-item"} onClick={this.toTeamHandle.bind(this, null,null)}>全部</div>
                        { 
                            this.state.teamList.map((item) => {
                                return(
                                    <div className={this.state.activeTag == item.teamName ? "act team-tag-item" : "team-tag-item"} key={'teamId-' + item.teamId} onClick={this.toTeamHandle.bind(this,item.teamId,item.teamName)}>{item.teamName}</div>
                                )
                            })
                        }
                    </div>

                    <div className="team-name">
                    <h1>{this.state.activeTag == "all" ? "所有成员" : this.state.activeTag}</h1><h2>{"( " + this.state.memberList.length + "人 )"}</h2>
                    </div>

                    <div className="member-list">
                    {
                        this.showMemberList().map((item) => {
                            return(
                                <div className="member-item" key={'member-item-' + item._id}>
                                    <img src={item.personInfo.headImg} onClick={this.toTimeLineHandle.bind(this, item._id)}  alt="" className="head-img"/>
                                    <span className="name">{item.personInfo.name}</span>
                                    <span className="phone">{item.username}</span>
                                    <span className="mail">{item.personInfo.mail}</span>
                                </div>
                            )
                        })
                    }
                    </div>

                    <div className="load-more" style={{display: this.state.memberList.length > (this.state.index + 10) ? 'block' : 'none'}} onClick={this.loadMoreHandle}>加载更多</div>
                    <div className="no-more" style={{display: this.state.memberList.length > (this.state.index + 10) ? 'none' : 'block'}}>无更多成员</div>


                </div>
            </Page>
        )
    }
}


