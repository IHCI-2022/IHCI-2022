import * as React from 'react';

import api, { authApi } from '../../utils/api';

import './style.scss'

import WxLoginDialog from '../../components/wx-login-dialog'

import SMSBlock from '../../components/smsCode'
export class LoginView extends React.Component {
    state = {
        //loginBlock: signUp || login || login_phone
        loginBlock: "login",

        username: '',
        password: '',

        login_phoneNum: '',
        login_phoneCode: '',

        createPhone: '',
        authCode: '',
        createPassword: '',
        createNickname:'',
        infoCheck: {
            usernameEmpty: true,
            passwordEmpty: true,

            createPhoneEmpty: true,
            authCodeEmpty: true,
            createPasswordEmpty: true,
            createNicknameEmpty: true,

            createLogin_phoneCodeEmpty: true,
            createLogin_phoneNumEmpty: true
        },
        helpDisplay: false,
        passwdShow: false
    }

    setToSignUpHandle = () => {
        if (this.state.loginBlock === 'login'||this.state.loginBlock === 'login_phone') {
            this.setState({
                loginBlock: 'signUp'
            })
        }
        if (this.state.loginBlock === 'signUp') {
            this.setState({
                loginBlock: 'login'
            })
        }
    }
    setToLoginHandle = () => {
        this.setState({
            loginBlock: 'login'
        });
    }

    setToLogin_phoneHandle = () =>{
        this.setState({
            loginBlock: 'login_phone'
        });
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
    usernameHandle = (e) => {
        const username = e.target.value
        var usernameEmpty = true
        if (username) {
            usernameEmpty = false
        } else {
            usernameEmpty = true
        }
        // WH_DOING???????????????????????????
        if (!(/^[0-9]*$/.test(username))) {
            return
        }
        this.setState({
            username: e.target.value,
            infoCheck: {
                ...this.state.infoCheck,
                usernameEmpty: usernameEmpty
            }
        })
    }
    login_phoneNumHandle =(e) => {
        const login_phoneNum = e.target.value
        var createLogin_phoneNumEmpty = true
        if (login_phoneNum) {
            createLogin_phoneNumEmpty = false
        } else {
            createLogin_phoneNumEmpty = true
        }
        this.setState({
            login_phoneNum: e.target.value,
            infoCheck: {
                ...this.state.infoCheck,
                createLogin_phoneNumEmpty: createLogin_phoneNumEmpty
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

    createPhoneHandle = (e) => {
        const createPhone = e.target.value
        var createPhoneEmpty = true
        if (createPhone) {
            createPhoneEmpty = false
        } else {
            createPhoneEmpty = true
        }
        // WH_DOING???????????????????????????
        if (!(/^[0-9]*$/.test(createPhone))) {
            return
        }
        this.setState({
            createPhone: createPhone,
            infoCheck: {
                ...this.state.infoCheck,
                createPhoneEmpty: createPhoneEmpty
            }
        })
    }
    authCodeHandle = (e) => {
        const authCode = e.target.value
        var authCodeEmpty = true
        if (authCode) {
            authCodeEmpty = false
        } else {
            authCodeEmpty = true
        }
        this.setState({
            authCode: authCode,
            infoCheck: {
                ...this.state.infoCheck,
                authCodeEmpty: authCodeEmpty
            }
        })
    }
    createPasswordHandle = (e) => {
        const confirmPassword = e.target.value
        var createPasswordEmpty = true
        if (confirmPassword) {
            createPasswordEmpty = false
        } else {
            createPasswordEmpty = true
        }
        this.setState({
            createPassword: e.target.value,
            infoCheck: {
                ...this.state.infoCheck,
                createPasswordEmpty: createPasswordEmpty
            }
        })
    }

    loginHandle = async (e) => {
        e.preventDefault();
        if (this.state.infoCheck.usernameEmpty) {
            window.toast("????????????")
            return
        }
        if (this.state.infoCheck.passwordEmpty) {
            window.toast("????????????")
            return
        }

        const result = await authApi(this.state.username, this.state.password)
        if (result.state.code === 0) {
            window.toast("????????????")
            setTimeout("window.location.href = '/team'", 1000)
        } else {
            window.toast(result.state.msg || "????????????")
        }
    }
    login_phoneHandle =async () =>{
        if (this.state.infoCheck.createLogin_phoneNumEmpty) {
            window.toast("???????????????")
            return
        }
        if (this.state.infoCheck.createLogin_phoneCodeEmpty) {
            window.toast("???????????????")
            return
        }

        const result = await api('/api/login_phone', {
            method: 'POST',
            body: {
                userInfo: {
                    username: this.state.login_phoneNum, // ????????????????????? ?????????????????????
                    code: this.state.login_phoneCode,                 
                }
            }
        })

        if (result.state.code === 0) {
            window.toast("????????????")
            setTimeout("window.location.href = '/team'", 1000)
        } else {
            window.toast(result.state.msg || "????????????")
        }
    }
    signHandle = async (e) => {
        e.preventDefault();
        // todo ??????????????????????????????
        if (this.state.infoCheck.createPhoneEmpty) {
            window.toast("????????????")
            return
        }
        if (this.state.infoCheck.authCodeEmpty) {
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
                    username: this.state.createPhone, // ???????????? ?????????????????????
                    password: this.state.createPassword, // ?????????????????????????????????
                    code: this.state.authCode,
                    nickname: this.state.createNickname
                }
            }
        })


        if (result.state.code === 0) {
            window.toast("????????????")
            setTimeout(() => {
                location.href = '/team'
            }, 300);
        }
        else {
            window.toast(result.state.msg || "????????????")
        }
    }

    forgetPwd = async () => {
        setTimeout(() => {
            location.href = '/password-reset'
        }, 300);
    }

    smsCodeInputHandle = (e) => {
        const code = e.target.value
        this.setState({
            authCode: code,
            infoCheck: {
                ...this.state.infoCheck,
                authCodeEmpty: false
            }
        })
    }

    login_phoneSmsCodeInputHandle =(e) => {
        const code = e.target.value
        this.setState({
            login_phoneCode: code,
            infoCheck: {
                ...this.state.infoCheck,
                createLogin_phoneCodeEmpty: false
            }
        })
    }



    render() {
        return (
          <div className="auth-con">
            <div className="auth-nav">
              <div
                className={
                  this.state.loginBlock === 'login' ||
                  this.state.loginBlock === 'login_phone'
                    ? 'auth-nav-item-login active'
                    : 'auth-nav-item-login'
                }
              >
                {this.state.loginBlock === 'login' ||
                this.state.loginBlock === 'login_phone'
                  ? '??????'
                  : '??????'}
              </div>
              <div
                className={
                  this.state.loginBlock === 'signUp'
                    ? 'auth-nav-item-signup active'
                    : 'auth-nav-item-signup'
                }
                onClick={this.setToSignUpHandle}
              >
                {this.state.loginBlock === 'login' ||
                this.state.loginBlock === 'login_phone'
                  ? '??????'
                  : '??????'}
              </div>
            </div>
            {this.state.loginBlock == 'signUp' ? (
              <div className="login-view-form">
                <input
                  type="text"
                  className="auth-input"
                  placeholder="???????????????"
                  vlaue={this.state.createNickname}
                  onChange={this.createNicknameHandle}
                ></input>
                <input
                  type="number"
                  pattern="[0-9]*"
                  className="auth-input"
                  placeholder="??????????????????"
                  value={this.state.createPhone}
                  onChange={this.createPhoneHandle}
                  onClick={this.judgeUsernameEmptyHandle}
                  autoFocus
                ></input>
                <div className="input-box">
                  <input
                    className="auth-input"
                    placeholder="???????????????"
                    type={this.state.passwdShow ? 'text' : 'password'}
                    value={this.state.createPassword}
                    onChange={this.createPasswordHandle}
                  ></input>
                  <div
                    className={this.state.passwdShow ? 'eye-open' : 'eye-close'}
                    onClick={() => {
                      this.setState({ passwdShow: !this.state.passwdShow })
                    }}
                  ></div>
                </div>
                <SMSBlock
                  smsCodeInputHandle={this.smsCodeInputHandle}
                  smsCode={this.state.authCode}
                  phoneNumber={this.state.createPhone}
                  phoneEmpty={this.state.infoCheck.createPhoneEmpty}
                ></SMSBlock>
                <div
                  className="forgetPwd"
                  onClick={() => {
                    this.setState({ helpDisplay: !this.state.helpDisplay })
                  }}
                >
                  ???????????????????
                </div>
                {this.state.helpDisplay && (
                  <div className="help-block">
                    <div className="menuArrow"></div>
                    <div className="help-title">???????????????????????????</div>
                    <div
                      className="help-close"
                      onClick={() => {
                        this.setState({ helpDisplay: false })
                      }}
                    >
                      <i className="iconfont icon-close"></i>
                    </div>
                    <ul className="help-text">
                      <li className="help-row">
                        1????????????????????????????????????????????????????????????????????????????????????
                      </li>
                      <li className="help-row">
                        2????????????????????????????????????????????????????????????????????????
                      </li>
                      <li className="help-row">
                        3???????????????????????????????????? ??????????????????????????? ???
                      </li>
                      <li className="help-row">
                        4????????????????????????SIM?????????????????????????????????????????????
                      </li>
                    </ul>
                  </div>
                )}
                <button className="submit-btn">????????????</button>
              </div>
            ) : (
              ''
            )}
            {this.state.loginBlock == 'login' ? (
              <div className="login-view-form">
                <div className="auth-desc">??????</div>
                <input
                  type="number"
                  pattern="[0-9]*"
                  className="auth-input"
                  placeholder="?????????"
                  value={this.state.username}
                  onChange={this.usernameHandle}
                ></input>
                <div className="auth-desc">??????</div>
                <input
                  className="auth-input"
                  type="password"
                  value={this.state.password}
                  onChange={this.passwordHandle}
                ></input>
                <div
                  className="forgetPwd"
                  onClick={this.setToLogin_phoneHandle}
                >
                  ???????????????
                </div>

                <div
                  className="wx-submit-btn"
                  onClick={this.props.showWxDialogHandle}
                >
                  <img
                    className="wx-submit-img"
                    src={require('./wechat@2x.png')}
                  />
                  ????????????
                </div>
              </div>
            ) : (
              ''
            )}
            {this.state.loginBlock == 'login_phone' ? (
              <div className="login-view-form">
                <div className="auth-desc">?????????</div>
                <input
                  type="number"
                  pattern="[0-9]*"
                  className="auth-input"
                  placeholder="??????????????????"
                  value={this.state.login_phoneNum}
                  onChange={this.login_phoneNumHandle}
                ></input>
                <SMSBlock
                  smsCodeInputHandle={this.login_phoneSmsCodeInputHandle}
                  smsCode={this.state.login_phoneCode}
                  phoneNumber={this.state.login_phoneNum}
                  phoneEmpty={this.state.infoCheck.createLogin_phoneNumEmpty}
                ></SMSBlock>
                <div className="forgetPwd" onClick={this.setToLoginHandle}>
                  ??????
                </div>

                <div className="submit-btn" onClick={this.login_phoneHandle}>
                  ????????????
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        )
    }

}
