import dayjs from 'dayjs'
// 一天的毫秒数
export const ONE_DAY_MS = 86400000
// 是否dayjs 对象
export const isDayjsObject = v => (typeof v == 'object' ? dayjs().constructor === v.constructor : false)
// 是否Moment对象
// export const isMomentObject = v => v._isAMomentObject
// 是否ISO_8601日期格式字符串
export const isIso8601 = v => typeof v == 'string' && v.trim().length > 19 && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i.test(v)
// 是否空对象
export const isEmptyObject = obj => {
    if (isEmpty(obj)) return true
    for (var n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false
    return true
}
// 是否空
export const isEmpty = v => [undefined, null].includes(v) || (typeof v == 'number' && isNaN(v)) || (typeof v == 'string' && !v.trim()) || (Array.isArray(v) && !v.length)
/**
 * @desc  模板引擎
 * @param  {String}           tpl    模板字符串
 * @param  {Object|Function}  data   替换文字或自定义替换函数
 * @param  {RegExp|Object}    conf
 * @return {String}
 */
 export const templateEngine = (tpl, data, conf) => {
    let [_s, _e, _re, state] = ['#{', '}', null, {}],match
    if (conf) {
        if (conf.constructor === RegExp) _re = conf
        else if (conf.constructor == Object) {
            if (conf._s) _s = conf._s
            if (conf._e) _e = conf._e
            if (conf._re) _re = conf._re
            state = { ...conf }
        }
    }
    if (!_re) _re = new RegExp(String.raw`${_s}(.+?)${_e}`, 'g')
    tpl = tpl.replaceAll(_s + _e, '')
    while ((match = _re.exec(tpl))) {
        tpl = tpl.replace(match[0], typeof data == 'function' ? (m, $1) => data(match[1], { m, $1, _s, _e, state }) : data[match[1]])
        _re.lastIndex = 0
    }
    return tpl
}
/*
        格式化
| 简写      | 关键字         | 含义                   | 参数说明 |
| --------- | -------------- | ---------------------- | -------- |
| n         | number,num     | 数字                   |          |
| f         | float          | 浮点                   |          |
| p         | percentage,per | 百分比                 |          |
| d         | date,datetime  | 日期                   |          |
| wk        | weekday        | 星期                   |          |
| padStart  | padStart       | 值左侧补全             |          |
| padEnd    | padEnd         | 值右侧补全             |          |
| 0         | zero           | 数字补全 0             |          |
| up        | upperCase      | 转大写                 |          |
| low       | lowerCase      | 转小写                 |          |
| ts        | timeStamp      | 时间戳                 |          |
| unix      | unixTimeStamp  | unix 时间戳            |          |
| attr      | prop , field   | 从对象中读取属性       |          |
| dict      |                | 字典匹配               |          |
| join      |                | 数字或驼峰转换连续字符 |          |
| hump      |                | 连续字符转换驼峰       |          |
| dict      |                | 字典                   |          |
| dateRange |                | 时间范围               |          |
    */
export const methods = {
    undefined: { f: v => v },
    /*  简写: {f: 格式化函数 ,kw:[ 关联关键字 ]}  */
    0: { f: (v, len) => String(v).padStart(len, '0'), kw: ['zero'] },
    n: { f: (num, len) => len && len > 0 ? Number(num).toString().replace(/\d+/, n => n.replace(new RegExp(String.raw`(\d)(?=(?:\d{${len}})+$)`, 'g'), '$1,')) : +num, kw: ['number', 'num'], },
    f: { f: (val, fx) => (fx ? (+val).toFixed(Number(fx || 0)) : val), kw: ['float'] },
    p: { f: (val, fx, c) => parseFloat((val * 100).toFixed(Number(fx || 0))) + (c || '%'), kw: ['percentage', 'per', '%'] },
    d: { f: (val, f) => dayjs(+val).format(f == '0' || f ? ['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm', 'YYYY/MM/DD HH:mm:ss'][f] || f : 'YYYY-MM-DD HH:mm:ss'), kw: ['date', 'datetime'] },
    wk: { f: (val, zh) => (zh ? '日一二三四五六七'[dayjs(+new Date()).day()] : dayjs(+val).day()), kw: ['weekday'] },
    up: { f: v => String(v).toUpperCase(), kw: ['upperCase'] },
    low: { f: v => String(v).toLowerCase(), kw: ['lowerCase'] },
    len: { f: v => (Array.isArray(v) || typeof v == 'string' || v.length ? v.length : 0), kw: ['length'] },
    ts: { f: (v, exact) => (exact ? parseInt(+v / 10 ** exact) * 10 ** exact : +v), kw: [] },
    unix: { f: v => +dayjs(v).endOf('day').unix(), kw: ['unixTimeStamp'] },
    padStart: { f: (v, ...args) => String(v).padStart(args[0], args[1] || ' ') },
    padEnd: { f: (v, ...args) => String(v).padEnd(args[0], args[1] || ' ') },
    attr: { f: (v, keys, str = null) => keys.split('.').reduce((value, currentKey, currentIndex, arr) => (value && value[currentKey] ? value[currentKey] : null), v) || str, kw: ['prop', 'field'] },
    join: { f: (v, c = '-') => (Array.isArray(v) ? v.join(c) : v.replace(/([A-Z])/g, c + '$1').toLowerCase()) },
    hump: { f: v => v.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : '')) },
    dict: { f: (v, ds, p) => (typeof ds == 'string' ? ds.split(p || '/') : ds)[v] },
    dateRange: { f: (v, d, k) => (Array.isArray(v) ? (v.length > 1 ? v[0] : v[1]) : [v, v]).map((_, i) => findMethod(k)(dayjs(_)[(i == 0 ? 'start' : 'end') + 'Of'](d || 'day'))) },
}
/**
 * @desc  根据关键字查询函数
 * @param {String|Number} prop 搜索关键字
 * @return {Function}
 */
 export const findMethod = (prop) => {
    let fmt = methods[prop]
    if (!fmt) {
        let k = Object.keys(methods).find(k => methods[k].kw && methods[k].kw.includes(prop))
        if (k) fmt = methods[k]
    }
    if (fmt && fmt.f) return (...args) => (!isEmpty(args[0]) ? fmt.f(...args) : undefined)
}
/**
 * @desc  根据函数格式化  
 */
 export const formatMethods = new Proxy({}, { get: (target, prop, receiver) => findMethod(prop) })
/* 格式化方式匹配 */
export const matchFormatMethod = {
    /**
     * @desc  根据函数格式化
     * @param {Any}      oVal     原始数据
     * @param {Function} formatFn 格式化函数
     * @return {Any}
     */
    function: (oVal, formatFn, ...args) => formatFn(oVal, ...args),
    /**
     * @desc  根据字符串格式化
     * @param {Any}  oVal       原始数据
     * @param {Any}  strFormat  匹配模板字符串
     * @param {Any}  templConf  格式化模板配置
     * @return {Any}
     */
    string: (oVal, strFormat, templConf) => {
        if (!strFormat.trim()) return oVal
        let val = typeof oVal == 'function' ? oVal() : oVal // 防止变量污染
        if (isEmpty(val)) return
        const exec = (val, batchStr, def) => {
            let batch= batchStr.split('&').map(str=>{
                let [f, ...args] = str.split(':'); 
                return [formatMethods[f.trim()],args?args.join(":"):args]
            }).filter(v=>!!v[0]) 
            if (!isEmpty(batch)) return batch.reduce((v,bfn, index, arr) =>bfn[0](v, ...(bfn[1] ? bfn[1].split(',').map(v => v.trim()) : []) ) ,val)
            return def
        }    
        const likeTempl = (templConf && ['_s', '_e', '_re'].find(k => templConf[k])) || strFormat.includes('#{')
        /* 直接匹配 ||  模板规则匹配 */
        return (likeTempl? templateEngine(strFormat, (item, opt) => (!item || !item.trim() ? item : exec(val, item, item)), templConf): exec(val, strFormat))||val
    },
    /**
     *
     * @desc  批量格式化
     * @param {Any}
     * @return {Any}
     */
    array: (oVal, arr, ...args) => arr.map(f => valueFormat(oVal, f, ...args)),
    /**
     *
     * @desc  根据配置格式化
     * @param {Any}
     * @return {Any}
     */
    object: (oVal, obj, ...args) => {
        if (obj.methods) return formatMethods[obj.methods](oVal, ...(obj.args ? (Array.isArray(obj.args) ? obj.args : [obj.args]) : args))
        let val = obj.value ? (typeof obj.value == 'function' ? obj.value(oVal) : obj.value) : oVal
        return valueFormat(val, obj.format, ...args)
    },
}

/**
 *
 * @desc  格式化值函数
 * @param {Any} value
 * @param {Any} 格式
 * @param {Any} 自定义格式化相关配置或参数
 * @return {Any}
 */
 export const valueFormat = (...args) => {
    if (args.length == 0) return undefined
    const val = args[0]
    if (args.length == 1) return val
    // 获取格式化函数
    const fn = args[1]
    // 获取格式化函数类型
    const fnType = Array.isArray(args[1]) ? 'array' : typeof args[1]
    // 匹配并执行，多余的的 args 作为附加参数处理
    if (matchFormatMethod[fnType]) return matchFormatMethod[fnType](...args)
    else return val
}

/**
 *
 * @desc  格式化值函数
 * @param {Function} fn     格式化函数或配置
 * @param {Any}      value   被格式化值
 * @return {Any}
 */
 export const formatValue = (...args) => {
    return valueFormat(args[1], args[0], ...args.slice(2))
}