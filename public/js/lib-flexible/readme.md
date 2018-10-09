###1.简述：
    基于淘宝fiexible.js设计方案的移动端适配的rem布局
    
###2.使用
    引入flexible_css.js(含有reset.css)和flexible.js(可以在index.html引入，也可以用模块化方式引入)

* 方法一、flexible+cssrem(推荐)
    * a、`Visual Studio Code`
        * a-1、在插件商店下载cssrem插件并安装(cssrem是一个把px单位自动转换为rem单位的插件)
        * a-2、文件-首选项-设置-搜索cssrem
        * a-3、配置用户参数(行号旁边的小铅笔可以修改用户参数)
            ```vscodeConfig
            // 自动移除0开头的前缀，默认：true
            "cssrem.autoRemovePrefixZero": true,
    
            // 根元素的字体大小 (unit: px), default: 16 (假设设计稿为375px，这里我们设置为3.75 iPhone6/7/8的rem基准值)
            "cssrem.rootFontSize": 37.5, 
    
            //使插件的代码提示提前
            "editor.snippetSuggestions": "inline" => "top"
            ```
    
    * b、`SublimeText`
        >* b-1、下载cssrem插件(git clone https://github.com/flashlizi/cssrem)
        >* b-2、进入packages目录：Sublime Text -> Preferences -> Browse Packages...
        >* b-3、复制下载的cssrem目录到刚才的packges目录里。重启Sublime Text。
        >* b-4、参数配置文件：Sublime Text -> Preferences -> Package Settings -> cssrem
        参数配置如下：
        px_to_rem - px转rem的单位比例，默认为40。
        max_rem_fraction_length - px转rem的小数部分的最大长度。默认为6。
        available_file_types - 启用此插件的文件类型。默认为：[".css", ".less", ".sass"]
    
* 方法二、flexible+Sass函数
    ```sass
    @function px2em($px, $base-font-size: 16px) {
        <a href='http://www.jobbole.com/members/jinyi7016'>@if</a> (unitless($px)) {
            @warn "Assuming #{$px} to be in pixels, attempting to convert it into pixels for you";
            @return px2em($px + 0px); // That may fail.
        } @else if (unit($px) == em) {
            @return $px;
        }
        @return ($px / $base-font-size) * 1em;
    }
    ```
* 方法三、flexible+Sass混合宏

    ```sass
    @mixin px2rem($property,$px-values,$baseline-px:16px,$support-for-ie:false){
        //Conver the baseline into rems
        $baseline-rem: $baseline-px / 1rem * 1;
        //Print the first line in pixel values
        <a href='http://www.jobbole.com/members/jinyi7016'>@if</a> $support-for-ie {
            #{$property}: $px-values;
        }
        //if there is only one (numeric) value, return the property/value line for it.
        <a href='http://www.jobbole.com/members/jinyi7016'>
        @if</a> type-of($px-values) == "number"{
            #{$property}: $px-values / $baseline-rem;
        }
        @else {
            //Create an empty list that we can dump values into
            $rem-values:();
            @each $value in $px-values{
                // If the value is zero or not a number, return it
                <a href='http://www.jobbole.com/members/jinyi7016'>@if</a> $value == 0 or type-of($value) != "number"{
                    $rem-values: append($rem-values, $value / $baseline-rem);
                }
            }
            // Return the property and its list of converted values
            #{$property}: $rem-values;
        }
    }
    ```
    方法四、flexible+PostCSS(px2rem)
    支持`node`、gulp、`webpack`、Grunt => [传送门](https://www.npmjs.com/package/postcss-px2rem)
    PostCSS语法：(不用计算怎么转换成rem，后面解析css样式只需加上/*px*/或者/*no*/不解析)
    ```postCSS
    .selector {
        width: 150px;
        height: 64px; /*px*/
        font-size: 28px; /*px*/
        border: 1px solid #ddd; /*no*/
    }
    .selector {
        width: 2rem;
        border: 1px solid #ddd;
    }
    [data-dpr="1"] .selector {
        height: 32px;
        font-size: 14px;
    }
    [data-dpr="2"] .selector {
        height: 64px;
        font-size: 28px;
    }
    [data-dpr="3"] .selector {
        height: 96px;
        font-size: 42px;
    }
    ```

###3.完成，这样我们就做到移动端适配，又可以继续愉快的敲代码了
