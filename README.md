## 任务发布系统后端管理


### 技术栈

 - react
 - antd
 - react-router
 - mobx
 - canvas
 - ES6
 - cookie

### 项目目录结构

```
assets--------存储静态图片资源和共用icon图标
components----存储共用组件
routes--------业务页面入口和常用模板
store---------状态管理
utils---------工具函数

```


### 项目截图

![登录页面](https://github.com/pibigstar/admin-todo/blob/master/docs/screenshot/login.png)
![列表页面](https://github.com/pibigstar/admin-todo/blob/master/docs/screenshot/groups.png)

### 启动

```bash
npm run start

```

### 快速开发

##### 1. 添加页面JS

在src/routes/ 下新增页面JS

##### 2. 添加导航菜单
在src/components/SiderNav/index.js

1） 在menus数组中新增链接

##### 3. 添加页面链接

在src/components/ContentMain/index.js中

1）新增链接位置
```javascript
const UserList = LoadableComponent(()=>import('../../routes/UserList/index'))
```
2) 注册路由
```javascript
<PrivateRoute exact path='/home/user/list' component={UserList}/>
```



### 相关项目

- [任务发布系统后端-go语言编写](https://github.com/pibigstar/go-todo)
- [任务发布系统小程序端](https://github.com/pibigstar/wx-todo)
- [任务发布系统后端-react编写](https://github.com/pibigstar/admin-todo)
