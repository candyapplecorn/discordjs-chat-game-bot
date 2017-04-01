
function randomInterval(cb, min, max){
    global.RI = (global.RI || []).concat(setTimeout(function(){
        cb();
        randomInterval(cb, min, max);
    }, Math.floor(Math.random() * (max - min) + min)));
    global.RI.length > 40 && global.RI.shift(); // keep it from getting too big with stale intervals
}
function stopRandomInterval(){ global.RI && global.RI.forEach(ri => clearTimeout(ri)) || (global.RI = []) }

module.exports = {
    randomInterval,
    stopRandomInterval
};
