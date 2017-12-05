/**
 * 这个文件目的是演示客户端部分和nodejs部分统一使用es6模块。
 * Created by kenkozheng on 2017/12/5.
 */

// export function getTime2(){
//     return '12:12';
// }

/**
 * 上边注释的部分等价于以下
 */
function getTime2(){
    return '12:12';
}
export {getTime2};      //import需要大括号



//这个方式，import的时候不需要大括号
export default function getTime(){
    return '11:11';
}