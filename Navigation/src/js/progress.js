//进度条
var eventBtn = document.getElementById("box");
eventBtn.onclick = function() {
    var t = 1;
    var max = 617;
    var progress = document.getElementById("process");
    var process_texts = document.getElementsByClassName("process-text");
    var interval = setInterval(function () {
        if (t == max) {
            clearInterval(interval);
            for (var i in process_texts){
                process_texts[i].innerHTML = '完成'
            }
        } else {
            progress.style.width = t + "px";
            for (var i in process_texts){
                process_texts[i].innerHTML = 'Loading' + '&nbsp&nbsp&nbsp&nbsp' + (t / max * 100).toFixed(2) + "%"
            }
            t++;
        }
    }, 10)
}
