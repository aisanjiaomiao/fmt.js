## fmt.js

**fmt.js** 一个简单的模板匹配格式化库，你完全可以修改源码增加个性化功能。

###  诞生
在日常编写中，经常会用到对值进行格式化输出的功能。
在此前，项目中如果需要用到格式化相关功能，会在公共函数中编写，或者直接在使用的代码中添加格式化片段。
长此以往，由于接手的人多，那么不可避免的出现一些相同功能的格式化函数在代码中冗余。
另外在很多表格中，我们会对接口返回的字段进行格式化输入，如果都是以函数形式有些过于繁琐，所以想通过更加简单的方式，对输出的值进行格式化显示。
于是就有了**fmt.js**工具库，库名是“format”的简写。

### 安装

#### 依赖

**fmt.js** 中对日期的依赖库为“dayjs”，可以根据需求替换为其它库

#### 浏览器直接引入

浏览器直接通过标签进行引用: `<scropt src="fmt.js"></srcipt>`
#### ESM

ESM项目中，例如在Vue项目中，使用 **fmt.esm.js** 例如: `import { valueFormat } from './fmt.esm.js'`
 
### 使用

#### 内置对象

- [methods](#methods)
- [formatMethods](#formatMethods)
- [matchFormatMethod](#matchFormatMethod)

##### methods
**methods**对象中存放自定义的格式化配置，基本结构是

```
简写关键字名称: {f: 自定义格式化函数 ,kw:[ 关联关键字 ]} 
```

目前内置格式化函数

| 简写      | 关键字         | 含义                   | 参数说明 |
| --------- | -------------- | ---------------------- | -------- |
| 0         | zero           | 数字补全 0             |  v:值, len:补全长度        |
| +         | number,num     |  加        |              v:值, ...args:追加值         |
| -         | number,num     |  减       |               v:值,  ...args:追加值       |
| *         | number,num     |  乘      |                v:值, ...args:追加值       |
| /         | number,num     |  除    |                  v:值, ...args:追加值     |
| n         | number,num     | 数字                   |  v:值, len: 隔位添加逗号类似(10,000,000) |
| f         | float          | 浮点                   |  v:值, fx:保留几位小数          |
| p         | percentage,per | 百分比                 |  v:值, fx:保留几位小数, c:末尾字符，默认"%"          |
| d         | date,datetime  | 日期                   |  v:值, f:格式,参考[示例](#项目中的使用)或参考[dayjs文档](https://dayjs.fenxianglu.cn/category/parse.html#实例)          |
| wk        | weekday        | 星期                   |  v:值, zh: 是否显示中文星期         |
| up        | upperCase      | 转大写                 |  v:值,          |
| low       | lowerCase      | 转小写                 |  v:值,           |
| len       | length         | 获取长度               |    v:值,           |
| ts        | timeStamp      | 时间戳                 |  v:值, exact:精确度，例如mysql中的Date毫秒会自动四舍五入，此时精确度会设置为3       |
| unix      | unixTimeStamp  | unix 时间戳(秒级时间戳)           |  v:值,         |
| padStart  | padStart       | 值左侧补全             |  v:值, c:补全的字符         |
| padEnd    | padEnd         | 值右侧补全             |  v:值, c:补全的字符          |
| attr      | prop , field   | 从对象中读取属性       |  v:值, keys: 键字符例如"key1.key2.key3", str: 默认空显示值        |
| join      |                | 数组或驼峰转换连续字符       |  v:值, c:拼接字符        |
| dict      |                | 字典匹配               |  v:值, ds:字符串或对象 , p:字符串时split分割字符        |
| hump      |                | 连续字符转换驼峰       |  v:值,         |
| [dateRange](#dateRange) |                | 时间范围               |  v:值, d:计算起始值默认以天(day)为单位, k:自定义格式化的key         |

部分格式化函数使用参考:[内置格式化函数附加示例](#内置格式化函数附加示例)

##### formatMethods

**formatMethods** 为 **[methods](#methods)**的代理对象，主要作用是讲访问函数自动根据函数的简称或关键字来匹配到格式化函数。

例如格式化百分比函数，既可以使用`formatMethods.p`来访问，也可以通过`formatMethods.per`、`formatMethods.percentage`这种关键字的方式来访问

实现原理查看函数**[findMethod](#findMethod)**

##### matchFormatMethod

**matchFormatMethod** 主要是为 **[valueFormat](#valueFormat)** 与 **[formatValue](#formatValue)** 函数作为对传入模板的数据类型来区分实际操作流程。

#### 函数 / 方法
- [isDayjsObject](#isDayjsObjectvalue)
- [isIso8601](#isIso8601value)
- [isEmptyObject](#isEmptyObjectvalue)
- [isEmpty](#isEmptyvalue)
- [templateEngine](#formatvalueformatvalueargs)
- [findMethod](#formatvalueformatvalueargs) 
- [valueFormat](#formatvalueformatvalueargs)
- [formatValue](#formatvalueformatvalueargs)

##### isDayjsObject(value)

判断是否dayjs 对象

参数: 
- `value` `<Any>`

返回值: 
- `<Boolean>` 

示例: 

```js
import { isDayjsObject } from './fmt.esm.js'
let ret=isDayjsObject(null)
console.log(ret)

let demo=dayjs()
ret=isDayjsObject(demo)
console.log(ret)
```

##### isIso8601(value)
判断是否ISO_8601日期格式字符串

参数: 
- `value` `<Any>`

返回值: 
- `<Boolean>` 

示例: 

```js
import { isIso8601 } from './fmt.esm.js'
let test='2022-10-31T07:49:18.564Z'
console.log(isIso8601(test))

test='2022-10-31T07:49'
console.log(isIso8601(test))
```


##### isEmptyObject(value)
判断对象是否空

参数: 
- `value` `<Any>`

返回值: 
- `<Boolean>` 

示例: 

```js
import { isEmptyObject } from './fmt.esm.js' 
console.log(isEmptyObject({}))
 
console.log(isEmptyObject({a:1}))
```


##### isEmpty(value)
判断值是否空


参数: 
- `value` `<Any>`

返回值: 
- `<Boolean>` 

示例: 

```js
import { isEmptyObject } from './fmt.esm.js' 

console.log(isEmpty())

console.log(isEmpty(null))
 
console.log(isEmpty(0))

console.log(isEmpty({}))

console.log(isEmpty([]))

console.log(isEmpty(true))
```



##### templateEngine(tpl,data[, conf])
模板引擎


参数: 
- `tpl` `<String>` (模板字符串)
- `data` `<Object|Function>` (替换文字或自定义替换函数)
- `conf` `<RegExp|Object>` (模板引擎配置，例如正则规则、模板符号，默认模板替换字符为`#{ }`)

返回值: 
- `<String>` 格式化后的字符串 

示例: 

```js
import { templateEngine } from './fmt.esm.js' 

let ret=templateEngine("A1= #{ a1 };B1= #{ a2.b.b1 }; ",{a1:1,a2:{b:{b1:2}}})
console.log(ret)
// _s 为开始符 _e 为结束符
ret=templateEngine("A1= <% a1 %>;B1= <% a2.b.b1 %>; ",{a1:1,a2:{b:{b1:2}}}, { _s: '<%', _e: '%>' })
console.log(ret)
// 如果传入函数，第一个匹配到范围字符串内容，第二个为模板引擎配置与附加参数
ret=templateEngine("date1= #{ 2022-10-30 };date2= #{ 2022-10-30T17:34:49.414Z }; ",(item, opt) =>new Date(item.trim()) )
console.log(ret)
// 如果第三个参数为对象，并且其中数据跟模板引擎无关，则视为附加参数
ret=templateEngine("A= #{ a };B= #{ b }; ",(item, opt) => opt.state.demo[item.trim()],{demo:{a:1,b:2}})
console.log(ret) 
```



##### findMethod(prop)
根据关键字查询函数


参数: 
- `prop` `<String|Number>` (搜索关键字)

返回值: 
- `<Function>`  (如果匹配到函数则返回对应函数)

示例: 

```js
import { findMethod } from './fmt.esm.js' 

console.log( findMethod('aaaa'))

console.log( findMethod('d'))

console.log( findMethod('dateRange'))
```

##### valueFormat(value,format[,...args])
格式化值函数


参数: 
- `value` `<Any>` (值)
- `format` `<Any>` (模板字符串，模板替换默认范围是)
- `...args` `<Any>` (其他参数信息) 

返回值: 
- `<Any>`  (根据模板类型不同，返回结果也会不同)


示例: 

```js
import { valueFormat } from './fmt.esm.js'  

let ret= valueFormat(12319874.2222,"12319874.2222, '哈喽#{}--#{n}~~#{n:3}~#{n:4}~ ;  #{p:2}'")
console.log(ret)

ret= valueFormat(1.23, '你好：  #{p:2}')
console.log(ret)

```

##### formatValue(format,value[,...args])
格式化值函数，与**[#valueFormat](#valueFormat)**功能一样，区别只是在于前两个参数顺序不同


参数: 
- `format` `<Any>` (模板字符串)
- `value` `<Any>` (值)
- `...args` `<Any>` (其他参数信息) 

返回值: 
- `<Any>`  (根据模板类型不同，返回结果也会不同)

示例: 

```js
import { formatValue } from './fmt.esm.js' 

let ret= formatValue("12319874.2222, '哈喽#{}--#{n}~~#{n:3}~#{n:4}~ ;  #{p:2}'",12319874.2222)
console.log(ret)

ret= formatValue( '你好：  #{p:2}',1.23)
console.log(ret)
```

#### 项目中的使用

基本上在项目中只会用到`valueFormat`与`formatValue`函数，

拿`valueFormat`为例，在使用时，模板字符串中不存在匹配字符，则默认当作格式化函数关键字去匹配。

所以同样是针对日期的格式化，实现方式有以下几种。

```js
let date=new Date
// 使用“模板字符串”格式化
valueFormat(date,"#{d}")
// 直接通过格式化“函数名”格式化
valueFormat(date,"d")
// 直接通过格式化函数“关键字”格式化
valueFormat(date,"date")
valueFormat(date,"#{date}")

```

在格式化的同时可以进行附加传参，参数只要在格式化函数名或关键字后加 **':'** 然后是参数，大概类似于
```
函数: 参数1,参数2,参数3....

```

> 具体格式化函数查看[methods](#methods)


例如日期格式化中默认设置了以下几种格式
```js
['YYYY-MM-DD', 'YYYY/MM/DD', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH:mm:ss', 'YYYY/MM/DD HH:mm', 'YYYY/MM/DD HH:mm:ss']
```

使用默认时间格式来格式化数据参考

```js
let date=new Date 
valueFormat(date,"#{d:0}") //'YYYY-MM-DD'
valueFormat(date,"d:0") //'YYYY-MM-DD'

valueFormat(date,"#{d:1}")  //'YYYY/MM/DD'
valueFormat(date,"d:1") //'YYYY/MM/DD'

valueFormat(date,"#{d:2}")  //'YYYY-MM-DD HH:mm'
valueFormat(date,"d:2") //'YYYY-MM-DD HH:mm'

valueFormat(date,"#{d:3}")  //'YYYY-MM-DD HH:mm:ss'
valueFormat(date,"d:3") //'YYYY-MM-DD HH:mm:ss'

valueFormat(date,"#{d:4}")  //'YYYY/MM/DD HH:mm'
valueFormat(date,"d:4") //'YYYY/MM/DD HH:mm'

valueFormat(date,"#{d:5}")  //'YYYY/MM/DD HH:mm:ss'
valueFormat(date,"d:5") //'YYYY/MM/DD HH:mm:ss'

```

自定义时间格式化
```js
let date=new Date 
valueFormat(date,"#{d:YYYY年MM月DD日}")  

```

多个参数之间 **','** 隔开，**'&'**符号表示执行完前面的函数后继续执行符号后函数，大概类似于

```
函数1: 参数1,参数2,参数3.... & 函数2: 参数1,参数2,参数3.... &  函数2: 参数1,参数2,参数3....

```

示例

```js
valueFormat(10,'+:20,30,40')

valueFormat({ a: 111, b: { c: 0.0222 }, e: { f: { g: new Date() } } }, 'a= #{ prop : a & 0 : 7  },b= #{ prop : b.c & p: 4},s = #{ prop : b.c & +:0.9778,20,30 } ,g= #{ prop : e.f.g & d:2} ,周#{prop : e.f.g & wk:zh}')

```
 
### 内置格式化函数附加示例

#### dict

说明：字典项目匹配

以下为浏览器控制台使用示例：

```js
< formatMethods.dict(1,'否/是')
> '是'

< formatMethods.dict(0,'否/是')
> '否'

< formatMethods.dict(0,'否、是','、')
> '否'

< formatMethods.dict(1,'否、是','、')
> '是'

< formatMethods.dict(0,['N','Y'])
> 'N'

> formatMethods.dict(1,['N','Y'])
< 'Y'

> formatMethods.dict(3,{ 1: '早餐', 2: '中餐', 3: '晚餐', 4: '夜宵' })
< '晚餐'
```

#### dateRange
说明：获取时间范围  

以下为浏览器控制台使用示例：
```js
// 返回当日dayjs 数组
> formatMethods.dateRange(new Date,)
< (2) [M, M]
// 获取当月时间范围格式化输出
> formatMethods.dateRange(new Date,"month","d:2")
< (2) ['2022-11-01 00:00', '2022-11-30 23:59']
// 获取当日时间范围时间戳
> formatMethods.dateRange(new Date,false,'n')
< (2) [1667232000000, 1667318399999]
// 获取当日时间范围秒级精度时间戳
> formatMethods.dateRange(new Date,false,'ts:3')
< (2) [1667232000000, 1667318399000]
// 获取当日时间范围秒级时间戳
> formatMethods.dateRange(new Date,false,'unix')
< (2) [1667318399, 1667318399]
// 获取时间戳范围并格式化输出
> formatMethods.dateRange([+new Date-86400000*2,+new Date],false,'d:2')
< (2) ['2022-10-30 00:00', '2022-11-01 23:59']
```

#### attr

关键字：prop , field   
说明：从对象中读取属性  

以下为浏览器控制台使用示例：
```js
> formatMethods.attr({ a: 111, b: { c: 0.0222 }, e: { f: { g: new Date() } } },"e.f.g")
< Tue Nov 01 2022 23:39:17 GMT+0800 (中国标准时间)
// 空值默认值显示
> formatMethods.attr({ a: 111, b: { c: 0.0222 }, e: { f: { g: new Date() } } },"e.f.a","--")
< '--'

> formatMethods.attr({ a: 111, b: { c: 0.0222 }, e: { f: { g:0 } } },"e.f.g","--")
< 0

```




### 更多使用示例

#### 结合 element-plus-table 参考

例如自定义表格组件中存在列配置，那么结合`fmt.js`后使用效果大概类似于:

```js
columns: [ 
        ...
        {
            "prop": "venue",
            "label": "供餐场馆",
            "align": "center",
            "minWidth": "200px",
        },
        {
            "prop": "mealTime",
            "label": "就餐日期",
            "align": "center",
            "width": "160px",
            format: 'd:0',
        }, 
        {
            "prop": "mealStandard",
            "label": "供应标准",
            "align": "center",
            "width": "160px",
            format: '#{_} 元/人/天',
        },
        ...
         {
            prop: 'createTime',
            label: '创建时间',
            width: '154px',
            align: 'center',
            format: 'd:2',
        },
        {
            prop: 'updateTime',
            label: '审核时间',
            width: '154px',
            align: 'center',
            format: 'd:2',
        },
        ...
```


#### 更多使用示例查看 **[example](example/demo_1.html)**