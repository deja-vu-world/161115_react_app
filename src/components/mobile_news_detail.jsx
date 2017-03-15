import React from 'react'
import {BackTop} from 'antd';
import axios from 'axios'

import NewsComment from './news_comments';

/**
 * Created by xfzhang on 2017/3/5.
 * 移动端新闻详情
 */
export default class MobileNewsDetails extends React.Component{

    constructor () {
        super()
        this.state = {
            news: ''
        }
    }

    componentDidMount () {
        const {news_id} = this.props.params
        const url = `http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey=${news_id}`
        axios.get(url)
            .then(response => {
                const news = response.data
                this.setState({news})
                document.title = news.title + " - React News | React驱动的新闻平台";
            })
    }

    render () {
        return (
            <div style={{padding: "10px"}}>
                <div className="mobileDetailsContainer" dangerouslySetInnerHTML={{__html: this.state.news.pagecontent}}></div>
                <hr/>
                <NewsComment newsId={this.props.params.news_id}/>
                <BackTop/>
            </div>
        )
    }
}