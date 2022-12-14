import * as React from 'react';
import { render } from 'react-dom';

import Page from '../../components/page';

import api, { authApi } from '../../utils/api';

import './style.scss'
import '../../commen/style.scss'

import WxLoginDialog from '../../components/wx-login-dialog'
// import { LoginView } from '../../components/login-view';
import { SignView } from '../../components/sign';

import Slider from "react-slick";

export default class MainPage extends React.Component {
    
    state = {
        //loginBlock: signUp || login
        // loginBlock: "login",

        // username: '',
        // password: '',

        // createUsername: '',
        // createPassword: '',

        showWxDialog: false,
        staticUrl: 'https://ihci.oss-cn-beijing.aliyuncs.com/home/'
    }
    data = {

    }

    componentDidMount = async () => {
        this.data = window.INIT_DATA;
        // console.log("Parent Test:")
        // document.domain = '39.108.68.159';
        // var ifr = document.getElementById('iframeId');
        // //var targetOrigin = 'http://39.108.68.159:5001'
        // console.log("send here");
        // window.addEventListener('message',function(event){
        // console.log(event.data);
        // document.getElementById('iframeId').contentWindow.postMessage('someMessage',"*");
        // console.log("sent");})
        // console.log("send done")
        // document.getElementById('iframeId').onload=function(){
        //     console.log("iframe load done");
        // document.getElementById('iframeId').contentWindow.postMessage('someMessage',"*");}
}

    showWxDialogHandle = () => {
        this.setState({
            showWxDialog: true
        })
    }

    hideWxDialogHandle = () => {
        this.setState({
            showWxDialog: false
        })
    }

    login = async () => {
      setTimeout(() => {
          location.href = '/login'
      }, 300);
    }

    register = async () => {
      setTimeout(() => {
          location.href = '/register'
      }, 300);
    }

    toHomePage = async () => {
      setTimeout(() => {
          location.href = '/'
      }, 100);
    }

    render () {
      return ( 
        <Page title='IHCI' className="main-page">
    
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {
              this.state.showWxDialog && <WxLoginDialog state="auth" closeHandle={this.hideWxDialogHandle}/>
            }
            
            <div className="nav">
                <div className="max-w-con nav-con">
                    <img className="logo" src={`${this.state.staticUrl}logo.png`} onClick={this.toHomePage}/>
                    {/* <div className="slogan">
                            <div className="english">All for the valuable code</div> 
                            <div className="chinese">??????????????????????????????</div>
                    </div> */}
                    <div className="division">iHCI?????????&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;iHCI?????????</div>
                    <div className="sign">
                      <div className="signin" onClick={this.login}>??????</div>
                      <div className="signup" onClick={this.register}>??????</div>
                    </div>
                </div>
            </div>

            <div className="banner">
                <div className="banner-con">
                    {/* <div className="img-wrap"><img className="banner-img" src={require('./tuceng7@2x.png')} /></div> */}
                    <div className="img-wrap"><img className="banner-img1" src={`${this.state.staticUrl}tuceng1.png`} /></div>
                    <div className="img-wrap"><img className="banner-img2" src={`${this.state.staticUrl}tuceng2.jpg`} /></div>
                    <div className="img-wrap"><img className="banner-img3" src={`${this.state.staticUrl}tuceng3.jpg`} /></div>
                    <div className="img-wrap"><img className="banner-img4" src={`${this.state.staticUrl}tuceng4.jpg`} /></div>
                    <div className="img-wrap"><img className="banner-img5" src={`${this.state.staticUrl}tuceng5.jpg`} /></div>
                    <div className="img-wrap"><img className="banner-img6" src={`${this.state.staticUrl}tuceng6.jpg`} /></div>
                    {/* <div className="note">&nbsp;&nbsp;Join a TEAM???<br/> &nbsp;&nbsp;prove YOUR VALUE;<br/>
                                         &nbsp;&nbsp;design and code<br/> &nbsp;&nbsp;for the USERS' VALUE </div> */}
                    {/* <LoginView showWxDialogHandle={this.showWxDialogHandle}/> */}
                    <SignView sign="login" showWxDialogHandle={this.showWxDialogHandle} />
                </div>
            </div>

            <img className="transition" src={require('./background.svg')}></img>

            <div className="slogan">??????????????????????????????</div>
            <div className="text">
              <div className="first">???????????????????????????????????????????????????????????????????????????????????????????????????????????????</div>
              <div className="second">10????????????????????????iHCI?????????????????????????????????????????????</div>
            </div>

            <div className="video">
                {/* <img className="video-title" src={require('./team-video.png')}/> */}
                <div className="video-title">&nbsp;&nbsp;&nbsp;&nbsp;????????????</div>
                <div className="video-wrap">   
                    <img className="video-template" src={`${this.state.staticUrl}team1.png`}/>
                </div>        
            </div>

            <div className="stories">
                <div className="story-title">
                  <div className="p1">??????????????????</div>
                </div>
                <div className="story-con">
                    <div className="story-item" id="first-item">
                        <img  className="head-img" src={`${this.state.staticUrl}toxiang1.png`}/>
                        <div className="item-wrap">
                        <div className="name">Meta Hirschl</div>
                        <div className="title">???????????????</div>
                        <div className="desc">
                        <div>?????????????????????</div>
                        <div>???????????????????????????</div>
                        <div>??????????????????????????????????????????</div>
                        </div>
                        </div>
                    </div>
                    <div className="story-item second-item">
                        <div><img  className="head-img" src={`${this.state.staticUrl}toxiang2.png`}/></div>
                        <div className="item-wrap">
                        <div className="name">Brian Grant</div>
                        <div className="title">??????????????????</div>
                        <div className="desc">
                        <div>???????????????????????????????????????</div>
                        <div>???????????????????????????</div>
                        <div>?????????????????????????????????</div>
                        </div>
                        </div>
                    </div>
                    <div className="story-item third-item">
                        <div><img className="head-img" src={`${this.state.staticUrl}toxiang3.png`}/></div>
                        <div className="item-wrap">
                        <div className="name">Maxim Orlov</div>
                        <div className="title">?????????</div>
                        <div className="desc">
                        <div>???????????????</div>
                        <div>???????????????????????????</div>
                        <div>???????????????????????????????????????</div>
                        </div>
                        </div>
                    </div>
                </div>
                { 
                  window.outerWidth > 550 ?
                  <div className="join-num">
                    <div className="p1">????????????450???</div>
                    {/* <div className="num">450???</div> */}
                    <div className="p1">?????????IHCI</div>
                  </div>
                  :
                  <div className="join-num">
                    <span className="p1">????????????450???</span>
                    {/* <span className="num">450???</span> */}
                    <span className="p1">?????????IHCI</span>
                </div>}              
            </div>

            {/* <div className="deco1">
              <div></div>

            </div> */}

            <div className="footer">
              <div className="trademark">
                {/* <img className="logo" src={require('./logo@2x.png')} /> */}
                <div className="trademark-text"><a href="http://www.beian.miit.gov.cn" target="_blank">???ICP???15032454???-2</a></div>
                <div className="trademark-footer">?????2009-?????? ????????????????????????????????????????????????</div>
              </div>
              {
                window.outerWidth > 600 ?
            
                <div className="footer-list max-w-con">
                    <div className="foot-item">
                        <div className="foot-item-title">IHCI</div>
                        <div href="">????????????</div>
                        <div href=""><img className="wx" width='20px' height="20px" src={`${this.state.staticUrl}wechat@2x.png`} /></div>
                    </div>
                    <div className="foot-item">
                        <div className="foot-item-title">iHCI?????????</div>
                        <div href="">HTML&CSS</div>
                        <div href="">JavaScript</div>
                        <div href="">Python</div>
                    </div>
                    <div className="foot-item">
                        <div className="foot-item-title">iHCI?????????</div>
                        <div href="">????????????</div>
                        <div href="">????????????</div>
                        <div href="">????????????</div>
                    </div>
                </div>
                :
                <div className="footer-list max-w-con">
                    <div className="foot-item">
                        <div className="foot-item-title">iHCI?????????</div>
                        <div className="foot-item-title">iHCI?????????</div>
                        <div className="foot-item-title">IHCI</div>                      
                    </div>

                    <div className="foot-item">                      
                        <div href="">HTML&CSS</div>
                        <div href="">????????????</div>
                        <div href="">????????????</div>            
                    </div>

                    <div className="foot-item">
                        <div href="">JavaScript</div>
                        <div href="">????????????</div>                      
                    </div>

                    <div className="foot-item">
                        <div href="">Python</div>
                        <div href="">????????????</div>                       
                    </div>
                </div>
              }
          </div>
  
        
        </Page>
      )
    }
}


render(<MainPage />, document.getElementById('app'));

