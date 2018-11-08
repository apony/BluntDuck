//线性同余随机算法(seedNum为本次使用的随机系数)
export function seededRandom(max, min, seedNum){ 
    Math.seed = seedNum; 
    max = max || 1;
    min = min || 0; 
    Math.seed = (Math.seed * 9301 + 49297) % 233280; 
    var rnd = Math.seed / 233280.0;
    return min + rnd * (max - min); 
};

//四舍六入五成双
export function evenRound(num, decimalPlaces) {
    var d = decimalPlaces || 0;
    var m = Math.pow(10, d);
    var n = +(d ? num * m : num).toFixed(8); // Avoid rounding errors
    var i = Math.floor(n), f = n - i;
    var e = 1e-8; // Allow for rounding errors in f
    var r = (f > 0.5 - e && f < 0.5 + e) ?
                ((i % 2 == 0) ? i : i + 1) : Math.round(n);
    return d ? r / m : r;
}

/**
 * 伪随机算法：产生随机整数，包含下限值，但不包括上限值
 * @param {Number} lower 下限
 * @param {Number} upper 上限
 * @return {Number} 返回在下限到上限之间的一个随机整数
 */
export function randomEasy(lower, upper) {
	return Math.floor(Math.random() * (upper - lower)) + lower;
}