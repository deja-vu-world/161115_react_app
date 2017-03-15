import React from 'react'
import {
    Icon,
    Tabs,
    message,
    Form,
    Input,
    Button,
    Modal
} from 'antd'
const FormItem = Form.Item
const TabPane = Tabs.TabPane
import {Link} from 'react-router'
import axios from 'axios'

import logo from '../images/logo.png'

/**
 * header组件
 */
class MobileNewsHeader extends React.Component {

    constructor () {
        super()
        this.state = {
            username: null,
            userId: null,
            modalVisible: false
        }
    }

    componentDidMount () {
        if(localStorage.userId) {
            this.setState({
                username: localStorage.username,
                userId: localStorage.userId
            })
        }
    }

    setModalVisible = (modalVisible) => {
        this.setState({modalVisible})
    }

    handleSubmit = (isRegist, event) => {
        event.preventDefault() //阻止默认行为
        //确定行为
        const action = isRegist ? 'register' : 'login'
        //得到表单数据
        const formData = this.props.form.getFieldsValue()
        const url = "http://newsapi.gugujiankong.com/Handler.ashx?action=" + action
            + "&username="+formData.userName+"&password="+formData.password
            +"&r_userName=" + formData.r_userName + "&r_password="
            + formData.r_password + "&r_confirmPassword="
            + formData.r_confirmPassword
        console.log(url)

        axios.get(url)
            .then(response => {
                const json = response.data
                this.props.form.resetFields()
                console.log(json, '=====')
                if(isRegist) {
                    message.success('注册成功')
                } else {
                    if(!json) {
                        message.error('登陆失败')
                    } else {
                        message.success('登陆成功')
                        localStorage.userId = json.UserId
                        localStorage.username = json.NickUserName
                        this.setState({
                            userId : json.UserId,
                            username: json.NickUserName
                        })
                    }
                }
            })
        this.setState({modalVisible: false})
    }

    login = () => {
        this.setModalVisible(true);
    }

    render () {
        const { getFieldDecorator} = this.props.form
        const {username, modalVisible} = this.state

        const userItem = username
            ? <Link to='/usercenter'>
            <Icon type="inbox"/>
        </Link>
            : <Icon type="setting" onClick={this.login.bind(this)}/>

        return (
            <div id="mobileheader">
                <header>
                    <Link to="/">
                        <img src={logo} alt="logo"/>
                        <span>ReactNews</span>
                    </Link>
                    {userItem}
                </header>
                <Modal title="用户中心"
                       visible={modalVisible}
                       onOk={this.setModalVisible.bind(this, false)}
                       onCancel={this.setModalVisible.bind(this, false)}
                       okText="关闭">
                    <Tabs type="card" onChange={() => {this.props.form.resetFields()}}>
                        <TabPane tab="登陆" key="1">
                            <Form onSubmit={this.handleSubmit.bind(this, false)}>
                                <FormItem label="账户">
                                    {
                                        getFieldDecorator('userName')(<Input placeholder="请输入账号" />)
                                    }
                                </FormItem>
                                <FormItem label="密码:">
                                    {
                                        getFieldDecorator('password')(<Input placeholder="请输入密码" />)
                                    }
                                </FormItem>
                                <Button type="primary" htmlType='submit'>登陆</Button>
                            </Form>
                        </TabPane>
                        <TabPane tab="注册" key="2">
                            <Form horizontal onSubmit={this.handleSubmit.bind(this, true)}>
                                <FormItem label="账户">
                                    {
                                        getFieldDecorator('r_userName')(<Input placeholder="请输入账号" />)
                                    }
                                </FormItem>
                                <FormItem label="密码:">
                                    {
                                        getFieldDecorator('r_password')(<Input placeholder="请输入密码" />)
                                    }
                                </FormItem>
                                <FormItem label="确认密码:">
                                    {
                                        getFieldDecorator('r_confirmPassword')(<Input placeholder="请再次输入您的密码" />)
                                    }
                                </FormItem>
                                <Button type="primary" htmlType='submit'>注册</Button>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}
export default Form.create()(MobileNewsHeader)