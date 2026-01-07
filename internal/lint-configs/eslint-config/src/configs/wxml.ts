import type { Linter } from "eslint";

import wxmlParser from "@wxml/parser";
import wxml from "eslint-plugin-wxml";

/**
 * WXML ESLint Configuration
 *
 * 这是微信小程序 WXML 模板文件的 ESLint 配置，包含所有可用的 eslint-plugin-wxml 规则。
 * 更多信息请参考: https://eslint-plugin-wxml.js.org/
 */
export function wxmlConfig(): Linter.Config[] {
    // 为 wxmlParser 添加 meta 信息以支持 ESLint 9 的配置序列化
    const wxmlParserWithMeta = {
        ...wxmlParser,
        meta: wxmlParser.meta || {
            name: "@wxml/parser",
            version: "0.4.0",
        },
    };

    return [
        {
            files: [ "**/*.wxml", "**/*.wxs" ],
            languageOptions: {
                parser: wxmlParserWithMeta,
            },
            plugins: {
                wxml,
            },
            rules: {
                // ===========================
                // 核心语法错误检查
                // ===========================

                /**
                 * 检查 WXML 语法错误
                 * 在开发时提示 wxml 语法错误，节省开发人员时间
                 * @example
                 * ✅ 正确: <view><view /></view>
                 * ❌ 错误: <view><view />{{</view>
                 */
                "wxml/report-wxml-syntax-error": "error",

                /**
                 * 检查 WXS 语法错误
                 * 提示 wxs 语法错误。使用 espree 解析内联 wxs
                 * @example
                 * ✅ 正确: <wxs module="util">var s = 100;module.exports = {data: s}</wxs>
                 * ❌ 错误: <wxs module="util">funcytion ss () {}</wxs>
                 */
                "wxml/report-wxs-syntax-error": "error",

                /**
                 * 检查插值语法错误
                 * 使用 @wxml/parser 解析插值内容，提供语法错误消息
                 * @example
                 * ✅ 正确: <view>{{a + b}}</view>
                 * ❌ 错误: <view style="idx-{{isOdd ? 'single'}}" /> (缺少冒号)
                 * ❌ 错误: <view>{{a + }}</view> (表达式不完整)
                 */
                "wxml/report-interpolation-error": "error",

                // ===========================
                // WXS 相关规则
                // ===========================

                /**
                 * 禁止在 WXS 中使用 let 和 const
                 * 微信小程序 wxs 当前不支持使用 let 和 const 来声明变量
                 * @example
                 * ✅ 正确: <wxs module="util">var s = 100;module.exports = {data: s}</wxs>
                 * ❌ 错误: <wxs module="util">let s = 100;module.exports = {data: s}</wxs>
                 * ❌ 错误: <wxs module="util">const s = 100;module.exports = {data: s}</wxs>
                 */
                "wxml/no-const-and-let-in-wxs": "error",

                /**
                 * 禁止内联 WXS，强制使用 .wxs 文件
                 * 强制开发者使用 .wxs 文件而不是 <wxs /> 标签，以获得更好的 IDE 支持
                 * @example
                 * ✅ 正确: <wxs module="util" src="../../../util.wxs" />
                 * ❌ 错误: <wxs module="util">function util () { }module.exports = {util: util}</wxs>
                 */
                "wxml/no-inline-wxs": "error",
                /**
                 * 检查 WXS 模块属性
                 * 检查缺少 module 属性并验证 module 名称
                 * module 属性必须是英文字母或下划线开头，后续可以是英文字母、下划线或数字
                 * @example
                 * ✅ 正确: <wxs module="util" src="../../utils.wxs" />
                 * ✅ 正确: <wxs module="_internal" src="../../utils.wxs" />
                 * ❌ 错误: <wxs src="../../utils.wxs" /> (缺少 module 属性)
                 * ❌ 错误: <wxs module="123invalid" src="../../utils.wxs" /> (模块名以数字开头)
                 */
                "wxml/wxs-module-prop": "error",

                // ===========================
                // 标签相关规则
                // ===========================

                /**
                 * 空标签必须是自闭合的
                 * 所有微信小程序 wxml 标签都可以自闭合。此规则强制减少代码大小和更好的代码风格
                 * @example
                 * ✅ 正确: <view bind:tap="clickhandler" />
                 * ✅ 正确: <view />{{interpolation}}</view>
                 * ❌ 错误: <view bind:tap="clickhandler" ></view>
                 * ❌ 错误: <view></view>
                 */
                "wxml/empty-tag-self-closing": "error",

                /**
                 * 检查开始和结束标签名称是否一致
                 * 发现起始标签名称和结束标签名称不相等
                 * @example
                 * ✅ 正确: <same-tag-name>content</same-tag-name>
                 * ❌ 错误: <view>content</text>
                 */
                "wxml/no-inconsistent-tagname": "error",

                /**
                 * 禁止使用特定的标签
                 * 你可以配置禁止的标签列表和它们的替代品
                 * @example
                 * ✅ 正确: <view></view>, <text></text>
                 * ❌ 错误: <div></div> (HTML 标签)
                 * ❌ 错误: <span></span>
                 * ❌ 错误: <p></p>
                 */
                "wxml/forbid-tags": "error",

                /**
                 * 禁止使用特定的属性
                 * 例如，JSX 使用 'className' 但 wxml 使用 'class' 作为类名
                 * @example
                 * ✅ 正确: <text class="text-center">{{name}}</text>
                 * ❌ 错误: <text className="text-center">{{name}}</text>
                 */
                "wxml/forbid-attributes": "error",

                /**
                 * 强制使用所需的根标签
                 * 为 wxml 文件的根标签提示所需的特定标签
                 * @example
                 * ✅ 正确: <page><main /><list /></page>
                 * ❌ 错误: <app name="e-commerce"><main /><list /></app>
                 */
                // "wxml/required-root-tag": "error",

                /**
                 * 强制使用所需的特定标签
                 * 为特殊 wxml 文件提示所需的标签。例如，特定页面需要特定的标签来注入通用逻辑
                 * @example
                 * ✅ 正确: <page><observer /><main /></page>
                 * ❌ 错误: <app name="e-commerce"><main /><list /></app>
                 */
                // "wxml/required-tags": "warn",

                /**
                 * 强制使用所需的属性
                 * 为配置的 wxml 标签提示所需属性
                 * @example
                 * ✅ 正确: <popup showModal popupId="modal1" />, <img src="image.jpg" width="100px" />
                 * ❌ 错误: <popup name="welcome" />
                 * ❌ 错误: <img useWebp />
                 */
                "wxml/required-attributes": "warn",

                // ===========================
                // 属性相关规则
                // ===========================

                /**
                 * 禁止重复属性
                 * 此规则强制开发者不要写多个重复属性
                 * @example
                 * ✅ 正确: <view title="{{title}}" name="{{name}}"><goods /></view>
                 * ❌ 错误: <view title="{{title}}" title="{{title}}">...</view>
                 */
                "wxml/no-duplicate-attributes": "error",

                /**
                 * 省略值为 true 的布尔属性
                 * 强制开发者省略 true 属性，以获得更好的编码风格并节省小程序包大小
                 * @example
                 * ✅ 正确: <cart showBadge />
                 * ✅ 正确: <swiper autoplay />
                 * ✅ 正确: <virtual-list hideSpinner="{{false}}" />
                 * ❌ 错误: <cart showBadge="{{true}}" />
                 * ❌ 错误: <swiper autoplay="{{true}}" />
                 */
                "wxml/omit-bool-attributes": "error",

                /**
                 * 禁止使用字符串布尔值
                 * 此规则强制开发者避免在 wxml 数据绑定中使用错误的布尔值
                 * @example
                 * ✅ 正确: <checkbox checked="{{false}}" ></checkbox>
                 * ✅ 正确: <popup showMask />
                 * ❌ 错误: <checkbox checked="false" ></checkbox>
                 * ❌ 错误: <popup showMask="true" />
                 */
                "wxml/no-unexpected-string-bool": "error",

                /**
                 * 强制引号风格一致
                 * 强制开发者在所有 wxml 代码库中使用相同的引号样式（单引号或双引号）
                 * @example
                 * ✅ 正确: <component attr="{{data}}" />
                 * ✅ 正确: <view wx:if="{{show}}">{{title}}</view>
                 * ❌ 错误: <component attr='{{data}}' />
                 */
                "wxml/quotes": [ "error", "double" ],

                // ===========================
                // 事件绑定相关规则
                // ===========================

                /**
                 * 强制事件绑定风格一致
                 * 支持 'colon' (bind:tap) 或 'no-colon' (bindtap) 两种风格
                 * @example
                 * ✅ 正确 (colon style): <view bind:tap="clickhandler" />, <view mut-bind:tap="clickhandler" />, <view catch:tap="clickhandler" />
                 * ❌ 错误 (no-colon style): <view bindtap="clickhandler" />
                 */
                "wxml/event-binding-style": [ "error", "colon" ],

                // ===========================
                // wx:for 和 wx:key 相关规则
                // ===========================

                /**
                 * 强制在 wx:for 中使用 wx:key
                 * 提示开发者在循环数据时不要忘记添加 wx:key
                 * @example
                 * ✅ 正确: <view wx:for="{{list}}" wx:key="goodsId"><view>item.title</view></view>
                 * ❌ 错误: <view wx:for="{{list}}"><view>item.title</view></view>
                 */
                "wxml/wx-key": "error",

                /**
                 * 禁止在 wx:key 中使用数组下标
                 * 此规则强制开发者使用属性标识符而不是数组下标作为 wx:key
                 * @example
                 * ✅ 正确: <view wx:for="{{goodsList}}" wx:key="goodsId">{{item.name}}</view>
                 * ❌ 错误: <view wx:for="{{goodsList}}" wx:key="{{index}}">{{item.name}}</view>
                 */
                "wxml/no-index-in-wx-key": "warn",


                /**
                 * 禁止动态 wx:key
                 * 此规则强制开发者不设置动态 wx:key
                 * @example
                 * ✅ 正确: <view wx:for="{{goodsList}}" wx:key="goodsId">{{item.name}}</view>
                 * ❌ 错误: <view wx:for="{{goodsList}}" wx:key="{{index}}">{{item.name}}</view>
                 */
                "wxml/no-dynamic-wx-key": "error",

                /**
                 * 禁止在 wx:for 中使用 wx:else
                 * 你不能在同一标签上使用 wx:for 和 wx:else，这会导致微信小程序编译错误
                 * @example
                 * ✅ 正确: <view wx:for="{{list}}">{{item.name}}</view>
                 * ✅ 正确: <view wx:if="{{showList}}" wx:for="{{list}}">{{item.name}}</view>
                 * ✅ 正确: <block wx:if="{{showList}}"><view wx:for="{{list}}">{{item.name}}</view></block><block wx:else><view wx:for="{{otherList}}">{{item.name}}</view></block>
                 * ❌ 错误: <view wx:for="{{list}}" wx:else>{{item.name}}</view>
                 */
                "wxml/no-wx-for-with-wx-else": "error",

                // ===========================
                // 条件渲染相关规则
                // ===========================

                /**
                 * 禁止在 wx:if/wx:elif 中使用字符串
                 * 如果你使用 wx:if/wx:elif 作为控制流，确保 wx:if/wx:elif 的值是布尔值，而不是字符串
                 * @example
                 * ✅ 正确: <view wx:if="{{user}}">{{user.name}}</view>
                 * ✅ 正确: <view wx:elif="{{show}}">show this view</view>
                 * ❌ 错误: <view wx:if="{{showList}} ">I will be always show</view>
                 * ❌ 错误: <view wx:if="string">I will be always show</view>
                 * ❌ 错误: <view wx:if="{{showSwitch}}-string">I will be always show</view>
                 */
                "wxml/no-wx-if-string": "error",

                /**
                 * 禁止不必要的 block 标签
                 * 在某些情况下，你不需要 <block />。此规则在 block 只包含单个子元素时允许使用
                 * @example
                 * ✅ 正确: <block wx:if="{{show}}">{{title}}</block>
                 * ✅ 正确: <block wx:if="{{showList}}"><view wx:for="{{list}}">{{item.name}}</view></block>
                 * ❌ 错误: <block><goods name="{{item.name}}" img="{{item.imgUrl}}" /></block>
                 */
                "wxml/no-unnecessary-block": "error",

                // ===========================
                // 复杂性控制规则
                // ===========================

                /**
                 * 强制最大嵌套深度
                 * 强制标签的最大嵌套深度，以减少代码复杂性。许多开发者认为超过某个深度的代码很难阅读
                 * @example
                 * ✅ 正确: <view depth="1"><view depth="2"><view depth="3"></view></view><view depth="2"></view></view>
                 * ❌ 错误: 超过配置的最大深度
                 */
                "wxml/max-depth": [ "warn", 10 ],


                /**
                 * 强制文件的最大行数
                 * 强制文件的最大行数，以帮助可维护性和减少复杂性
                 * @example
                 * ✅ 正确: 文件行数不超过指定数量
                 * ❌ 错误: 超过最大行数的文件
                 */
                "wxml/max-lines": [ "warn", { max: 500 } ],

                // ===========================
                // 其他规则
                // ===========================

                /**
                 * 禁止 Vue 指令
                 * 这是一个有趣的规则，因为许多小程序开发者有 Vue 开发经验，会在 wxml 代码中写 v-xx 指令
                 * 此规则用于避免这种肌肉记忆错误
                 * @example
                 * ✅ 正确: <view wx:if="{{show}}">{{title}}</view>
                 * ❌ 错误: <view v-if="{{show}}">{{title}}</view>
                 * ❌ 错误: <view v-else-if="{{hide}}">{{title}}</view>
                 */
                "wxml/no-vue-directive": "error",

                /**
                 * 禁止指定的语法
                 * 此规则允许您禁止特定的语法，例如某或些元素、属性模式
                 * 高级用法，需要自定义配置
                 * @see https://eslint-plugin-wxml.js.org/rules/no-restricted-syntax.html
                 */
                "no-restricted-syntax": "off",
            },
        },
    ];
}
