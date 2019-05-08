import React from 'react'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import TypingCard from '../../components/TypingCard'
import { Card, Col, Row } from 'antd';

export default class About extends React.Component{
  render(){
    return (
      <div>
        <CustomBreadcrumb arr={['关于']}/>
        <TypingCard source={'很多事，不是会了才能干而是干了才能学会......'} title='关于' />
        <div>
          <Row gutter={20}>
            <Col span={10}>
              <Card
                  title="微信小程序"
                >
                  <img style={styles.todo} src={require('../../assets/img/todo.jpg')} alt=""/>
              </Card>
            </Col>
            <Col span={10}>
              <Card
                  title="微信公众号"
                >
                  <img style={styles.java} src={require('../../assets/img/java.png')} alt=""/>
                </Card>
            </Col>
          </Row>
        </div>
    </div>
    )
  }
}

const styles = {
  todo:{
    width: 400,
    height: 400,
  },
  java:{
    marginLeft: 30,
    width: 400,
    height: 400,
  }
}
