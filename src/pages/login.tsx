import React from 'react';
import "../styles/index.less";
import "../styles/login.less";
import { Button, Checkbox, Input } from 'antd';
import {BindAll} from 'lodash-decorators';

declare interface ILoginState {
    remember:boolean;
    userName?:string;
    password?:string;// 真实密码
    showPassword?:string;// 显示密码，防止浏览器记住密码
    userNameActive:boolean;
    passwordActive:boolean;
    userNameError?:string;
    passwordError?:string;
    login:boolean;
}

@BindAll()
class Login extends React.PureComponent<{},ILoginState>{
    constructor(props:{}){
        super(props);
        const account = localStorage.getItem("account");
        const user = account?JSON.parse(account):{};
        this.state={
            userName:user.userName,
            password:user.password,
            remember:!!account,
            userNameActive:false,
            passwordActive:false,
            login:false
        }
    }
    componentDidMount(): void {
        // 从本地读取存储的账号，如果账号存在则直接进行
        const {account,password} = this.state;
        if(account){
            // login
        }
    }
    private onUserNameFocus(){
        this.setState({
            userNameActive:true
        })
    };
    private onInputUserName(e:React.ChangeEvent<HTMLInputElement>){
        const value = e.target.value;
        this.setState({
            userName:value,
        })
    }
    private onUserNameBlur(){
        const {userName} = this.state;
        this.setState({
           userNameActive:!!userName
        });
    }
    private onPasswordFocus(){
        this.setState({
            passwordActive:true
        })
    };
    private onInputPassword(e:React.ChangeEvent<HTMLInputElement>){
        const value = e.target.value;
        this.setState({
            password:value,
        })
    }
    private onPasswordBlur(){
        const {password} = this.state;
        this.setState({
            passwordActive:!!password
        });
    }
    private login(){
        this.setState({
            login:true
        });

        setTimeout(()=>{
            this.setState({
                login:false,
                userNameError:"用户名错误",
                passwordError:"密码不正确"
            })
        },1000);
    }
    render() {
        const {userNameActive,passwordActive,userName,password="",userNameError,passwordError,login} = this.state;
        const showPwd = password.replace(/./g,"●");
        return (
            <main className="main login-bg">
                <div className="login-logo">
                    供应链管理中台
                </div>
                <div className="login-box">
                    <div className="login-title">
                        登录
                    </div>
                    <div className={`login-item ${userNameError?"login-error":""}`}>
                        <Input spellCheck={false} value={userName} className="login-input" onFocus={this.onUserNameFocus} onChange={this.onInputUserName} onBlur={this.onUserNameBlur}/>
                        <label className={`login-input-label ${userNameActive?"login-input-label-value":""}`}>
                            用户名
                        </label>
                        <label className="login-error-label">
                            {userNameError}
                        </label>
                    </div>
                    <div className={`login-item ${passwordError?"login-error":""}`}>
                        <Input autoComplete="new-password" spellCheck={false} value={showPwd} className="login-input" onFocus={this.onPasswordFocus} onChange={this.onInputPassword} onBlur={this.onPasswordBlur}/>
                        <label className={`login-input-label ${passwordActive?"login-input-label-value":""}`}>
                            密码
                        </label>
                        <label className="login-error-label">
                            {passwordError}
                        </label>
                    </div>
                    <Checkbox className="login-remember">下次自动登录</Checkbox>
                    <Button loading={login} disabled={!userName||!password} type="primary" className="login-btn" onClick={this.login}>登录</Button>
                </div>
            </main>
        );
    }
}

export default Login;
