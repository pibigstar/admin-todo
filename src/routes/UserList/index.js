import React from 'react'
import {Card, Popconfirm,  Table, Form, InputNumber, Input} from 'antd'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react/index'
import moment from "moment";

@withRouter @inject('appStore') @observer @Form.create()
class UserList extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    loading: false,
    data: [],
    pagination: {
      pageSize: 8
    },
    count: 2,
    editingKey: '',
  }

  componentDidMount() {
    // 页面完成后加载数据
    this.getRemoteData()
  }
  
  columns = [
    {
        title: '用户名',
        dataIndex: 'UserName',
        sorter: true,
        width: '20%',
        editable: true,
      },
      {
        title: '描述',
        dataIndex: 'Desc',
        width: '20%',
        editable: true,
      },
    {
      title: '密码',
      dataIndex: 'Password',
      width: '15%',
      editable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'CreateTime',
      render: time => `${moment(time).format('YYYY-MM-DD HH:mm:ss')}`,
      width: '30%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => {
        //是否可编辑
        const editable = this.isEditing(record);
        return (
          <div>
            {editable ? (
              <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        onClick={() => this.save(form, record.ID)}
                        style={{marginRight: 8}}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="确定取消?"
                    onConfirm={() => this.cancel(record.ID)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
            ) : (
              <a onClick={() => this.edit(record.ID)}>编辑</a>
            )}
            <span>
                <Popconfirm title="确认删除?" onConfirm={() => this.onDelete(record.ID)}>
                <a style={styles.operation}>删除</a>
                </Popconfirm>
            </span>
          </div>
        );
      },
    },
  ]

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    })
  }

  // 加载远程数据
  getRemoteData(params) {
    this.setState({
      loading: true
    })
    const domain = this.props.appStore.domain
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    axios({
      method: 'get',
      url: domain+'user/list',
    }).then(res => {
        const pagination = {...this.state.pagination};
        pagination.total = 200
        this.setState({
          loading: false,
          data: res.data.data,
          pagination
        })
    })
  }

  // 表格改变
  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.getRemoteData({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    })
  }
  // 删除
  onDelete = (ID) => {
    const arr = this.state.data.slice()
    this.setState({
      data: arr.filter(item => item.ID !== ID)
    })
  }

  // 添加
  handleAdd = () => {
    const {data, count} = this.state 
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      data: [...data, newData],
      count: count + 1
    })
  }

  isEditing = (record) => {
    return record.ID === this.state.editingKey;
  };

  /// 编辑，设定编辑key
  edit(key) {
    this.setState({editingKey: key});
  }

  // 保存编辑
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.ID);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({data: newData, editingKey: ''});
      } else {
        //newData.push(data8);
        this.setState({data: newData, editingKey: ''});
      }
    });
  }

  // 取消编辑，清除编辑key
  cancel = () => {
    this.setState({editingKey: ''});
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <div>
        <Card bordered={false} title='用户管理' style={{marginBottom: 10, minHeight: 440}} id='editTable'>
          <Table rowKey={record => record.ID}
                 components={components} 
                 bordered 
                 dataSource={this.state.data}
                 onChange={this.handleTableChange}
                 columns={columns}/>
        </Card>
      </div>
    )
  }
}

const FormItem = Form.Item;
const EditableContext = React.createContext();
const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);


// 可输入列组件
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber/>;
    }
    return <Input/>;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const {getFieldDecorator} = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{margin: 0}}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

const styles = {
    operation:{
        marginLeft: 20,
    },
  }


export default UserList