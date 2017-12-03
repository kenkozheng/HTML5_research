这个目录文件纯粹做一个示例。目的是展示一般单页面Vue-SSR的文件。
需要一个app.js用于创建前后端公用的app，而entry-client和entry-server分别用于前后端的webpack打包，分别用于webpack.client.config.js和webpack.server.config.js
其实这部分代码没有任何业务逻辑，纯粹Vue打包需要而已。


build/appEntryTemplate的文件就是从这里复制过去的，做成了自动生成，目的是减少多页面的重复代码。