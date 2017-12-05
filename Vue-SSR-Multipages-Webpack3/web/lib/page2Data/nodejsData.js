/**
 * 演示客户端和服务器引入不同的文件
 * Created by kenkozheng on 2017/12/5.
 */

export function getData(id) {
    return new Promise((resolve, reject) => {
        resolve({
            msg: 'nodejs msg' + id
        });
    });
}