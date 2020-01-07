import React from 'react';
import "../styles/index.less";
import "../styles/login.less";
import { Button, Checkbox, Input } from 'antd';
import {BindAll} from 'lodash-decorators';
import { userLogin } from '@/services/user';
import { getPageQuery } from '@/utils/request';
import router from 'umi/router';
import User from '@/storage/User';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

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
        this.state={
            userName:User.userName,
            password:User.password,
            remember:!!User.password,
            userNameActive:!!User.userName,
            passwordActive:!!User.password,
            login:false
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
        const {password="",userName="",remember} = this.state;
        userLogin({
            username:userName,
            password:password
        }).then((res)=>{
            // 登录成功，跳转到原来的页面
            // 缓存用户信息
            User.setUser(Object.assign({},User.localUser,{
                ...remember?{
                    userName:userName,
                    password:password,
                }:{
                    userName:"",
                    password:"",
                },
                token:res?.data?.token
            }));
            const urlParams = new URL(window.location.href);
            const params = getPageQuery();
            let { redirect } = params as { redirect: string };
            if (redirect) {
                const redirectUrlParams = new URL(redirect);
                if (redirectUrlParams.origin === urlParams.origin) {
                    redirect = redirect.substr(urlParams.origin.length);
                    if (redirect.match(/^\/.*#/)) {
                        redirect = redirect.substr(redirect.indexOf('#') + 1);
                    }
                } else {
                    window.location.href = redirect;
                    return;
                }
            }
            router.replace(redirect || '/');
        }).catch(({message})=>{
            this.setState({
                userNameError:message,
                passwordError:message
            })
        }).finally(()=>{
            this.setState({
                login:false
            });
        });
    }
    private onRememberChange(e:CheckboxChangeEvent){
        this.setState({
            remember:e.target.checked
        })
    }
    render() {
        const {userNameActive,passwordActive,userName,password="",userNameError,passwordError,login,remember} = this.state;
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
                        <Input type="password" autoComplete="new-password" spellCheck={false} value={password} className="login-input" onFocus={this.onPasswordFocus} onChange={this.onInputPassword} onBlur={this.onPasswordBlur}/>
                        <label className={`login-input-label ${passwordActive?"login-input-label-value":""}`}>
                            密码
                        </label>
                        <label className="login-error-label">
                            {passwordError}
                        </label>
                    </div>
                    <Checkbox checked={remember} className="login-remember" onChange={this.onRememberChange}>下次自动登录</Checkbox>
                    <Button loading={login} disabled={!userName||!password} type="primary" className="login-btn" onClick={this.login}>登录</Button>
                </div>
            </main>
        );
    }
}

export default Login;
