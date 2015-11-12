/**
 * Created by kenkozheng on 2015/11/12.
 *
 * 运行的例子
 * 把highcharts原来的文件highcharts-convert修改了，增加-input参数，可以取代-infile，直接命令行把数据输入，减少读文件，可能会受到linux系统限制，每个命令行有最大长度
 */

var process = require("child_process");
var data = {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0,
            135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
};
process.exec('phantomjs.exe ./highcharts/highcharts-convert.js -input ' + encodeURIComponent(JSON.stringify(data)) + ' -outfile chart1.png -constr Chart', {cwd: './'}, function (err, stdout, stderr) {
    console.log(err, stdout, stderr);
});