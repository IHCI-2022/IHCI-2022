# IHCI-Build-Guide
*****
### 原IHCI平台(IHCI-RE项目)的项目结构：
* api-doc：&emsp;关于user的api文档。
* icon-font：&emsp;图标、字体的静态文件。
* public: &emsp;前端编译后文件的所在目录。
* server: &emsp;后端文件夹。
* site: &emsp;前端文件夹。
    * activity-react: &emsp;前端项目文件夹。
* dest: &emsp;项目打包后文件所在目录（若没有，可手动生成）
*****
### 原IHCI平台(IHCI-RE项目)的依赖软件：
* NodeJS
* mongodb
* redis
* docker
*****
### 原IHCI平台(IHCI-RE项目)的打包和运行：
<p>&emsp;由于本人并不是IHCI平台的作者，也没有拿到详细的部署文档，所以这里只是给出了我自己的部署情况。</p>

### &emsp;1. 打包环境
<p>&emsp;Node版本非常重要，不建议使用除8.9.0以外的版本，否则打包失败需要自行确认依赖包安装情况。</p>
&emsp;Windows 10:
<ul>
    <li>OS: Windows 10 Version: 1903</li>
    <li>Node: 8.9.0</li>
    <li>npm: 5.5.1</li>
    <li>IDE: vscode</li>
</ul>
&emsp;CentOS 7
<ul>
    <li>OS: CentOS 7</li>
    <li>Node: 8.9.0</li>
    <li>npm: 5.5.1</li>
</ul>
&emsp;如果本地环境已有其他Node版本建议使用nvm进行Node版本切换以免影响其他Node项目。

### &emsp;2. 构建项目
<p>&emsp;此部分指令的默认目录均是在项目的Sourcecode执行。</p>

```shell
    npm install
    npm run build
    gulp //如果未安装gulp先要运行 npm install -g gulp 安装gulp
```
&emsp;执行完上述指令后会在当前目录下生成一个dest文件夹，将当前目录的public复制到dest文件夹中即可完成构建。
<p>&emsp;构建完成后，dest文件夹的文件夹结构为：</p>
<ul>
<li>public: &emsp;同根目录public文件夹
<li>server: &emsp;同根目录server文件夹
<li>site: &emsp;同根目录site文件夹
</ul>

### &emsp;3. 运行项目
<p>该操作所在的文件夹在构建完成的dest中。</p>

```shell
    cd server
    node startup.js             //默认在5000端口
    或node startup.js --port 80 //指定在80端口运行项目
```

### Calendar组件
<p>Calendar组件是IHCI平台的关键组件，部署Calendar组件后需要在IHCI平台前端的Calendar页面中设置calendar的网址，具体目录为IHCI-RE\SourceCode\site\activity-react\pages\container\calendar\iframeUrlConfig.js，网址格式protocol://ipOrDomain:port，ipOrDomain填写Calendar组件部署域名，一般来说Calendar都与IHCI平台在同一个服务器部署，即域名相同，port填写Calendar组件运行端口，Calendar组件默认运行在8000端口，如果使用nginx代理的话则填写对应监听端口。</p>
