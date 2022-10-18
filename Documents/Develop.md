# IHCI-Develop-Guide
> 要使用日历模块请先运行[Calendar](https://github.com/IHCI-2022/calendar)
## 依赖

- **Node.js 8.9.0**
- **npm 5.5.1**
- MongoDB
- Redis

## 开始
```shell
git clone https://github.com/IHCI-2022/IHCI-2022.git
cd IHCI-2022/SourceCode
npm i
npm run build:dev    //webpack的watch模式会监听文件变化自动重新打包

// 再重新启动一个terminal
cd IHCI-2022/SourceCode
npm run start        //默认在5000端口
```
项目会在`127.0.0.1:8000`运行，本地运行没开https使用不了微信相关功能

## 部署
首先打包项目
```shell
npm run build        //打包site
gulp                 //打包server 
```
完成后会生成dest和public文件，将public文件复制到dest中，压缩dest文件夹即可完成打包，获得dest.zip

在要部署的服务器上
```shell
unzip dest.zip
cd dest
npm i
npm run start        //默认在端口5000运行
```
