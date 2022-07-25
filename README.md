# 🌸ANI◈SAIKA🌸

## 机制设计

打开页面后，弹出模态框，用户选择是作为服务机，还是作为客户机。

1. 若作为服务机  
   1. 创建一个 Peer 对象
   2. 围绕 Peer 对象构建一个服务器对象
2. 若作为客户机
   1. 直接连接至目标服务机
   2. 接收服务机的数据并渲染

服务机的服务器对象拥有以下数据：

1. 储存已连接用户的 connections
2. 与 connections 一一对应的 users（Map），key 为 connection，而 value 则为用户传入的个人用户签名
3. 储存已初始化的插件的 plugins
4. 储存对话数据的 messages

服务器的启动流程大致如下：

1. 构建服务器对象
2. 从缓存中读入已添加的插件
   1. 使用 ShadowRealms 初始化每个插件，并向其中暴露必要的参数
      1. 执行插件的 initialize 函数
      2. 若插件被启用，执行插件的 enable 函数
   2. 将初始化完毕的插件存入 plugins
3. 初始化 connections
4. 监听 connection 事件
   1. 发生此事件时，构造一个异步流程
      1. 等待 connection 发送「用户信息」
      2. 若「用户信息」已存在于当前 users，告知 connection 原因并断开连接，结束流程
      3. 若「用户信息」不存在于当前 users，将 connection 和「用户信息」存入 users
      4. 向所有已存在 connection 发送一个「用户进入房间」的公告
   2. 监听 connection 的 data 事件
      1. 发生此事件时，构造一个异步流程
         1. 按优先级顺序遍历插件，并调用其 process 函数
         2. 若函数返回 1，则不再继续处理此消息，并结束流程
         3. 若没有函数返回 1，重复步骤1直到所有插件都被遍历
         4. 打印此消息，并遍历所有 connection，向其发送此消息
   3. 监听 connection 的 close 事件
      1. 发生此事件时，若 connection 存在于 users，向所有其他 connection 发送一个「用户离开房间」的公告

## 模型设计

### 事件机制

- Event:
  ```typescript
  namespace Saika {
    // 基础事件类型
    interface Event {
      id: string;
      timestamp: number;
    }
  }
  ```
- LoginEvent:
  ```typescript
  namespace Saika {
    interface LoginEvent extends Event {
      type: "login";
    }
  }
  ```
- RenderEvent:
  ```typescript
  namespace Saika {
    // 渲染事件，其中的数据会被渲染到消息框里。
    interface RenderEvent extends Event {
      type: "notification";
      from: string;
    }
  }
  ```
- MessageEvent:
