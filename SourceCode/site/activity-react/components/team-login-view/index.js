import * as React from 'react';

import api, { authApi } from '../../utils/api';

import SMSBlock from '../../components/smsCode'
import './style.scss'

//import WxLoginDialog from '../../components/wx-login-dialog'
export class TeamLoginView extends React.Component {
    state = {

        loginBlock: "login",

        username: '',
        password: '',

        createNickname:'',
        createUsername: '',
        createPassword: '',
        smsCode: '',

        infoCheck: {
            createUsernameEmpty: true,
            createPasswordEmpty: true,
            createNicknameEmpty:true,
            smsCodeEmpty: true,
            usernameEmpty: true,
            passwordEmpty: true
        },
    }

    setToSignUpHandle = () => {
        this.setState({
            loginBlock: 'signUp'
        });
    }
    setToLoginHandle = () => {
        this.setState({
            loginBlock: 'login'
        });
    }

    usernameHandle = (e) => {
        const username = e.target.value
        var usernameEmpty = true
        if (username) {
            usernameEmpty = false
        } else {
            usernameEmpty = true
        }
        this.setState({
            username: e.target.value,
            infoCheck: {
                ...this.state.infoCheck,
                usernameEmpty: usernameEmpty
            }
        })
    }
    passwordHandle = (e) => {
        const password = e.target.value
        var passwordEmpty = true
        if (password) {
            passwordEmpty = false
        } else {
            passwordEmpty = true
        }
        this.setState({
            password: password,
            infoCheck: {
                ...this.state.infoCheck,
                passwordEmpty: passwordEmpty
            }
        })
    }
    createNicknameHandle = (e) => {
        const nickname = e.target.value;
        var empty = true;
        if(nickname){
            empty = false;
        }else{
            empty = true;
        }
        this.setState({
            createNickname: nickname,
            infoCheck:{
                ...this.state.infoCheck,
                createNicknameEmpty: empty
            }
        })
    }
    createUsernameHandle = (e) => {
        const createUsername = e.target.value
        var createUsernameEmpty = true
        if (createUsername) {
            createUsernameEmpty = false
        } else {
            createUsernameEmpty = true
        }
        this.setState({
            createUsername: createUsername,
            infoCheck: {
                ...this.state.infoCheck,
                createUsernameEmpty: createUsernameEmpty
            }
        })
    }
    smsCodeHandle = (e) => {
        const smsCode = e.target.value
        var smsCodeEmpty = true
        if (smsCode) {
            smsCodeEmpty = false
        } else {
            smsCodeEmpty = true
        }
        this.setState({
            smsCode: smsCode,
            infoCheck: {
                ...this.state.infoCheck,
                smsCodeEmpty: smsCodeEmpty
            }
        })
    }
    createPasswordHandle = (e) => {
        const createPassword = e.target.value
        var createPasswordEmpty = true
        if (createPassword) {
            createPasswordEmpty = false
        } else {
            createPasswordEmpty = true
        }
        this.setState({
            createPassword: createPassword,
            infoCheck: {
                ...this.state.infoCheck,
                createPasswordEmpty: createPasswordEmpty
            }


        })
    }


    loginHandle = async () => {
        if (this.state.infoCheck.usernameEmpty) {
            window.toast("???????????????")
            return
        }
        if (this.state.infoCheck.passwordEmpty) {
            window.toast("????????????")
            return
        }

        const result = await authApi(this.state.username, this.state.password)
        if (result.state.code === 0) {
            window.toast("????????????")
            if (this.props.join)
                location.href = location.href
            else
                location.href = '/team'
        } else {
            window.toast(result.state.msg || "????????????")
        }
    }

    signHandle = async () => {
        if (this.state.createUsernameEmpty) {
            window.toast("????????????")
            return
        }
        if (this.state.infoCheck.smsCodeEmpty) {
            window.toast("???????????????")
            return
        }
        if (this.state.infoCheck.createPasswordEmpty) {
            window.toast("????????????")
            return
        }

        // ??????????????????
        const result = await api('/api/signUp', {
            method: 'POST',
            body: {
                userInfo: {
                    username: this.state.createUsername, // ???????????? ?????????????????????
                    password: this.state.createPassword, // ?????????????????????????????????
                    nickname:this.state.createNickname,
                    code: this.state.smsCode,
                }
            }
        })


        if (result.state.code === 0) {
            window.toast("????????????")
            setTimeout(() => {
                if (this.props.join)
                    location.href = location.href
                else
                    location.href = '/team'
            }, 300);
        }
        else {
            window.toast(result.state.msg || "????????????")
        }
    }
    forgetPwd = async() => {
        setTimeout(() => {
            location.href = '/password-reset'
        }, 300);
    }

    render() {
        return (
            <div>
                {
                this.state.loginBlock == "signUp" ?
                    <div className='auth-form'>
                        <div className="auth-desc">??????</div>
                        <input type='text' placeholder='???????????????' className='auth-input' 
                            value = {this.state.createNickname}onChange={this.createNicknameHandle}></input>
                        <input type="number" pattern="[0-9]*" placeholder="??????????????????" className="auth-input" 
                            value={this.state.createUsername} onChange={this.createUsernameHandle}></input>
                        <input type="text" placeholder="???????????????" className="auth-input" type="password" 
                            value={this.state.createPassword} onChange={this.createPasswordHandle}></input>
                        <SMSBlock
                            smsCodeInputHandle={this.smsCodeHandle}
                            smsCode={this.state.smsCode}
                            phoneNumber={this.state.createUsername}
                            phoneEmpty={this.state.createUsernameEmpty}
                        />
                        <div className="auth-desc"></div>
                        <div className="submit-btn" onClick={this.signHandle}>??????</div>
                        <br />
                        <div>
                            <span>???????????????</span><a onClick={this.setToLoginHandle}>????????????</a>
                        </div>
                    </div>
                    : ""
            }
            {
                this.state.loginBlock == "login" ?
                    <div className='auth-form'>
                        <div className="auth-desc">??????</div>
                        <input type="number" pattern="[0-9]*" placeholder="??????" className="auth-input" value={this.state.username} onChange={this.usernameHandle}></input>
                        <div className="auth-desc"></div>
                        <input type="text" placeholder="??????" className="auth-input" type="password" value={this.state.password} onChange={this.passwordHandle}></input>
                        <div className="forgetPwd" onClick={this.forgetPwd}>?????????????</div>
                        <div className="submit-btn" onClick={this.loginHandle}>??????</div>
                        {/* <div className="submit-btn" onClick={this.props.showWxDialogHandle}>????????????</div> */}
                        <div className="wx-alarm">
                            <hr />
                            <span className = 'text'>Or connect with </span>
                            <span className='line'></span>
                        </div>
                        <div className="wx-submit-btn" onClick={this.props.showWxDialogHandle}>
                            <img className="wx-submit-img" src={require('./wxlogo.png')} style={{width:60, height:60}}/>
                        </div>
                        <div>
                        <span>???????????????</span><a onClick={this.setToSignUpHandle}>????????????</a>
                        </div>
                    </div>
                    : ""
            }
            </div> 
        );
    }

}