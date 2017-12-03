/**
 * 用于打包服务器直出部分的逻辑
 */
import { createApp } from './app'
export default context => {
    const { app } = createApp()
    return app
}