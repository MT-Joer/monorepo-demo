<template>
    <view class="sp-editor" :style="{ '--icon-size': iconSize, '--icon-columns': iconColumns }">
        <view v-if="!readOnly"
              class="sp-editor-toolbar"
              @tap="format">
            <view v-if="toolbarList.includes('header')"
                  class="iconfont icon-format-header-1"
                  :class="formats.header == 1 ? 'ql-active' : ''"
                  data-name="header"
                  :data-value="1"
                  title="标题">
            </view>
            <view v-if="toolbarList.includes('bold')"
                  class="iconfont icon-zitijiacu"
                  :class="formats.bold ? 'ql-active' : ''"
                  data-name="bold"
                  title="加粗">
            </view>
            <view v-if="toolbarList.includes('italic')"
                  class="iconfont icon-zitixieti"
                  :class="formats.italic ? 'ql-active' : ''"
                  data-name="italic"
                  title="斜体">
            </view>
            <view v-if="toolbarList.includes('underline')"
                  class="iconfont icon-zitixiahuaxian"
                  :class="formats.underline ? 'ql-active' : ''"
                  data-name="underline"
                  title="下划线">
            </view>
            <view v-if="toolbarList.includes('strike')"
                  class="iconfont icon-zitishanchuxian"
                  :class="formats.strike ? 'ql-active' : ''"
                  data-name="strike"
                  title="删除线">
            </view>
            <!-- #ifndef MP-BAIDU -->
            <view v-if="toolbarList.includes('alignLeft')"
                  class="iconfont icon-zuoduiqi"
                  :class="formats.align == 'left' ? 'ql-active' : ''"
                  data-name="align"
                  data-value="left"
                  title="左对齐">
            </view>
            <!-- #endif -->
            <view v-if="toolbarList.includes('alignCenter')"
                  class="iconfont icon-juzhongduiqi"
                  :class="formats.align == 'center' ? 'ql-active' : ''"
                  data-name="align"
                  data-value="center"
                  title="居中对齐">
            </view>
            <view v-if="toolbarList.includes('alignRight')"
                  class="iconfont icon-youduiqi"
                  :class="formats.align == 'right' ? 'ql-active' : ''"
                  data-name="align"
                  data-value="right"
                  title="右对齐">
            </view>
            <view v-if="toolbarList.includes('alignJustify')"
                  class="iconfont icon-zuoyouduiqi"
                  :class="formats.align == 'justify' ? 'ql-active' : ''"
                  data-name="align"
                  data-value="justify"
                  title="两端对齐">
            </view>
            <!-- #ifndef MP-BAIDU -->
            <view v-if="toolbarList.includes('lineHeight')"
                  class="iconfont icon-line-height"
                  :class="formats.lineHeight ? 'ql-active' : ''"
                  data-name="lineHeight"
                  data-value="2"
                  title="行间距">
            </view>
            <view v-if="toolbarList.includes('letterSpacing')"
                  class="iconfont icon-Character-Spacing"
                  :class="formats.letterSpacing ? 'ql-active' : ''"
                  data-name="letterSpacing"
                  data-value="2em"
                  title="字间距">
            </view>
            <view v-if="toolbarList.includes('marginTop')"
                  class="iconfont icon-722bianjiqi_duanqianju"
                  :class="formats.marginTop ? 'ql-active' : ''"
                  data-name="marginTop"
                  data-value="20px"
                  title="段前距">
            </view>
            <view v-if="toolbarList.includes('marginBottom')"
                  class="iconfont icon-723bianjiqi_duanhouju"
                  :class="formats.marginBottom ? 'ql-active' : ''"
                  data-name="marginBottom"
                  data-value="20px"
                  title="段后距">
            </view>
            <!-- #endif -->
            <!-- #ifndef MP-BAIDU -->
            <view v-if="toolbarList.includes('fontSize')"
                  class="iconfont icon-font"
                  :class="formats.fontFamily ? 'ql-active' : ''"
                  data-name="fontFamily"
                  data-value="宋体"
                  title="字体">
            </view>
            <view v-if="toolbarList.includes('fontSize')"
                  class="iconfont icon-fontsize"
                  :class="formats.fontSize == '24px' ? 'ql-active' : ''"
                  data-name="fontSize"
                  data-value="24px"
                  title="字号">
            </view>
            <!-- #endif -->
            <view v-if="toolbarList.includes('color')"
                  class="iconfont icon-text_color"
                  data-name="color"
                  :data-value="textColor"
                  :style="{ color: formats.color ? textColor : 'initial' }"
                  title="文字颜色">
            </view>
            <view v-if="toolbarList.includes('backgroundColor')"
                  class="iconfont icon-fontbgcolor"
                  data-name="backgroundColor"
                  :data-value="backgroundColor"
                  :style="{ color: formats.backgroundColor ? backgroundColor : 'initial' }"
                  title="背景颜色">
            </view>
            <view v-if="toolbarList.includes('date')"
                  class="iconfont icon-date"
                  title="日期"
                  @tap="insertDate">
            </view>
            <view v-if="toolbarList.includes('listCheck')"
                  class="iconfont icon--checklist"
                  data-name="list"
                  data-value="check"
                  title="待办">
            </view>
            <view v-if="toolbarList.includes('listOrdered')"
                  class="iconfont icon-youxupailie"
                  :class="formats.list == 'ordered' ? 'ql-active' : ''"
                  data-name="list"
                  data-value="ordered"
                  title="有序列表">
            </view>
            <view v-if="toolbarList.includes('listBullet')"
                  class="iconfont icon-wuxupailie"
                  :class="formats.list == 'bullet' ? 'ql-active' : ''"
                  data-name="list"
                  data-value="bullet"
                  title="无序列表">
            </view>
            <view v-if="toolbarList.includes('divider')"
                  class="iconfont icon-fengexian"
                  title="分割线"
                  @click="insertDivider">
            </view>
            <view v-if="toolbarList.includes('indentDec')"
                  class="iconfont icon-outdent"
                  data-name="indent"
                  data-value="-1"
                  title="减少缩进">
            </view>
            <view v-if="toolbarList.includes('indentInc')"
                  class="iconfont icon-indent"
                  data-name="indent"
                  data-value="+1"
                  title="增加缩进">
            </view>
            <view v-if="toolbarList.includes('scriptSub')"
                  class="iconfont icon-zitixiabiao"
                  :class="formats.script == 'sub' ? 'ql-active' : ''"
                  data-name="script"
                  data-value="sub"
                  title="下标">
            </view>
            <view v-if="toolbarList.includes('scriptSuper')"
                  class="iconfont icon-zitishangbiao"
                  :class="formats.script == 'super' ? 'ql-active' : ''"
                  data-name="script"
                  data-value="super"
                  title="上标">
            </view>
            <view v-if="toolbarList.includes('direction')"
                  class="iconfont icon-direction-rtl"
                  :class="formats.direction == 'rtl' ? 'ql-active' : ''"
                  data-name="direction"
                  data-value="rtl"
                  title="文本方向">
            </view>
            <view v-if="toolbarList.includes('image')"
                  class="iconfont icon-charutupian"
                  title="图片"
                  @tap="insertImage">
            </view>
            <view v-if="toolbarList.includes('link')"
                  class="iconfont icon-charulianjie"
                  title="超链接"
                  @tap="insertLink">
            </view>
            <view v-if="toolbarList.includes('undo')"
                  class="iconfont icon-undo"
                  title="撤销"
                  @tap="undo">
            </view>
            <view v-if="toolbarList.includes('redo')"
                  class="iconfont icon-redo"
                  title="重做"
                  @tap="redo">
            </view>
            <view v-if="toolbarList.includes('removeFormat')"
                  class="iconfont icon-clearedformat"
                  title="清除格式"
                  @tap="removeFormat">
            </view>
            <view v-if="toolbarList.includes('clear')"
                  class="iconfont icon-shanchu"
                  title="清空"
                  @tap="clear">
            </view>
            <view v-if="toolbarList.includes('export')"
                  class="iconfont icon-baocun"
                  title="导出"
                  @tap="exportHtml">
            </view>
        </view>

        <!-- 自定义功能组件 -->
        <!-- 调色板 -->
        <ColorPicker v-if="toolbarList.includes('color') || toolbarList.includes('backgroundColor')"
                     ref="colorPickerRef"
                     :color="defaultColor"
                     @confirm="confirmColor">
        </ColorPicker>
        <!-- 添加链接的操作弹窗 -->
        <LinkEdit v-if="toolbarList.includes('link') && !readOnly"
                  ref="linkEditRef"
                  @confirm="confirmLink">
        </LinkEdit>

        <view class="sp-editor-wrapper" @longpress="eLongpress">
            <editor :id="editorId"
                    class="ql-editor editor-container"
                    :class="{ 'ql-image-overlay-none': readOnly }"
                    :placeholder="placeholder"
                    :read-only="readOnly"
                    show-img-resize
                    show-img-size
                    show-img-toolbar
                    @input="onEditorInput"
                    @ready="onEditorReady"
                    @statuschange="onStatusChange">
            </editor>
        </view>
    </view>
</template>

<script>
import { addLink, linkFlag } from "../../utils";
import ColorPicker from "./color-picker.vue";
import LinkEdit from "./link-edit.vue";

export default {
    components: {
        ColorPicker,
        LinkEdit
    },
    props: {
        // 编辑器id可传入，以便循环组件使用，防止id重复
        editorId: {
            type: String,
            default: "editor"
        },
        placeholder: {
            type: String,
            default: "写点什么吧 ~"
        },
        // 是否只读
        readOnly: {
            type: Boolean,
            default: false
        },
        // 最大字数限制，-1不限
        maxlength: {
            type: Number,
            default: -1
        },
        // 工具栏配置
        toolbarConfig: {
            type: Object,
            default: () => {
                return {
                    keys: [], // 要显示的工具，优先级最大
                    excludeKeys: [], // 除这些指定的工具外，其他都显示
                    iconSize: "18px", // 工具栏字体大小
                    iconColumns: 10 // 工具栏列数
                };
            }
        }
    },
    data() {
        return {
            formats: {},
            textColor: "",
            backgroundColor: "",
            curColor: "",
            defaultColor: { r: 0, g: 0, b: 0, a: 1 }, // 调色板默认颜色
            iconSize: "20px", // 工具栏图标字体大小
            iconColumns: 10, // 工具栏列数
            toolbarList: [],
            toolbarAllList: [
                "bold", // 加粗
                "italic", // 斜体
                "underline", // 下划线
                "strike", // 删除线
                "alignLeft", // 左对齐
                "alignCenter", // 居中对齐
                "alignRight", // 右对齐
                "alignJustify", // 两端对齐
                "lineHeight", // 行间距
                "letterSpacing", // 字间距
                "marginTop", // 段前距
                "marginBottom", // 段后距
                "fontFamily", // 字体
                "fontSize", // 字号
                "color", // 文字颜色
                "backgroundColor", // 背景颜色
                "date", // 日期
                "listCheck", // 待办
                "listOrdered", // 有序列表
                "listBullet", // 无序列表
                "indentInc", // 增加缩进
                "indentDec", // 减少缩进
                "divider", // 分割线
                "header", // 标题
                "scriptSub", // 下标
                "scriptSuper", // 上标
                "direction", // 文本方向
                "image", // 图片
                "link", // 超链接
                "undo", // 撤销
                "redo", // 重做
                "removeFormat", // 清除格式
                "clear", // 清空
                "export" // 导出
            ]
        };
    },
    watch: {
        toolbarConfig: {
            deep: true,
            immediate: true,
            handler(newToolbar) {
                /**
				 * 若工具栏配置中keys存在，则以keys为准
				 * 否则以excludeKeys向toolbarAllList中排查
				 * 若keys与excludeKeys皆为空，则以toolbarAllList为准
				 */
                if (newToolbar.keys?.length > 0) {
                    this.toolbarList = newToolbar.keys;
                } else {
                    this.toolbarList =
						newToolbar.excludeKeys?.length > 0
						    ? this.toolbarAllList.filter((item) => !newToolbar.excludeKeys.includes(item))
						    : this.toolbarAllList;
                }
                this.iconSize = newToolbar.iconSize || "18px";
                this.iconColumns = newToolbar.iconColumns || 10;
            }
        }
    },
    methods: {
        onEditorReady() {
            // #ifdef MP-BAIDU
            this.editorCtx = requireDynamicLib("editorLib").createEditorContext(this.editorId);
            // #endif

            // #ifdef APP || MP-WEIXIN || H5
            uni
                .createSelectorQuery()
                .in(this)
                .select(`#${  this.editorId}`)
                .context((res) => {
                    this.editorCtx = res.context;
                    this.$emit("init", this.editorCtx, this.editorId);
                })
                .exec();
            // #endif
        },
        undo() {
            this.editorCtx.undo();
        },
        redo() {
            this.editorCtx.redo();
        },
        format(e) {
            const { name, value } = e.target.dataset;
            if (!name) return;
            switch (name) {
                case "backgroundColor":
                case "color": {
                    this.curColor = name;
                    this.showPicker();
                    break;
                }
                default: {
                    this.editorCtx.format(name, value);
                    break;
                }
            }
        },
        showPicker() {
            switch (this.curColor) {
                case "backgroundColor": {
                    this.defaultColor = this.backgroundColor
                        ? this.$refs.colorPickerRef.hex2Rgb(this.backgroundColor)
                        : { r: 0, g: 0, b: 0, a: 0 };
                    break;
                }
                case "color": {
                    this.defaultColor = this.textColor
                        ? this.$refs.colorPickerRef.hex2Rgb(this.textColor)
                        : { r: 0, g: 0, b: 0, a: 1 };
                    break;
                }
            }
            this.$refs.colorPickerRef.open();
        },
        confirmColor(e) {
            switch (this.curColor) {
                case "backgroundColor": {
                    this.backgroundColor = e.hex;
                    this.editorCtx.format("backgroundColor", this.backgroundColor);
                    break;
                }
                case "color": {
                    this.textColor = e.hex;
                    this.editorCtx.format("color", this.textColor);
                    break;
                }
            }
        },
        onStatusChange(e) {
            if (e.detail.color) {
                this.textColor = e.detail.color;
            }
            if (e.detail.backgroundColor) {
                this.backgroundColor = e.detail.backgroundColor;
            }
            this.formats = e.detail;
        },
        insertDivider() {
            this.editorCtx.insertDivider();
        },
        clear() {
            uni.showModal({
                title: "清空编辑器",
                content: "确定清空编辑器吗？",
                success: ({ confirm }) => {
                    if (confirm) {
                        this.editorCtx.clear();
                    }
                }
            });
        },
        removeFormat() {
            uni.showModal({
                title: "文本格式化",
                content: "确定要清除所选择部分文本块格式吗？",
                showCancel: true,
                success: ({ confirm }) => {
                    if (confirm) {
                        this.editorCtx.removeFormat();
                    }
                }
            });
        },
        insertDate() {
            const date = new Date();
            const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            this.editorCtx.insertText({ text: formatDate });
        },
        insertLink() {
            this.$refs.linkEditRef.open();
        },
        /**
		 * 确认添加链接
		 * @param {object} e { text: '链接描述', href: '链接地址' }
		 */
        confirmLink(e) {
            this.$refs.linkEditRef.close();
            addLink(this.editorCtx, e);
            this.$emit("addLink", e, this.editorId);
            // 修复添加超链接后，不触发input更新当前最新内容的bug，这里做一下手动更新
            this.editorCtx.getContents({
      	success: (res) => {
      		this.$emit("input", { html: res.html, text: res.text }, this.editorId);
      	}
            });
        },
        insertImage() {
            // #ifdef APP-PLUS || H5
            uni.chooseImage({
                // count: 1, // 默认9
                success: (res) => {
                    const { tempFiles } = res;
                    // 将文件和编辑器示例抛出，由开发者自行上传和插入图片
                    this.$emit("upinImage", tempFiles, this.editorCtx, this.editorId);
                },
                fail() {
                    uni.showToast({
                        title: "未授权访问相册权限，请授权后使用",
                        icon: "none"
                    });
                }
            });
            // #endif

            // #ifdef MP-WEIXIN
            // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
            uni.chooseMedia({
                // count: 1, // 默认9
                success: (res) => {
                    // 同上chooseImage处理
                    const { tempFiles } = res;
                    this.$emit("upinImage", tempFiles, this.editorCtx, this.editorId);
                },
                fail() {
                    uni.showToast({
                        title: "未授权访问相册权限，请授权后使用",
                        icon: "none"
                    });
                }
            });
            // #endif
        },
        onEditorInput(e) {
            // 注意不要使用getContents获取html和text，会导致重复触发onStatusChange从而失去toolbar工具的高亮状态
            // 复制粘贴的时候detail会为空，此时应当直接return
            if (Object.keys(e.detail).length <= 0) return;
            const { html, text } = e.detail;
            // 识别到标识立即return
            if (text.includes(linkFlag)) return;

            const maxlength = Number.parseInt(this.maxlength);
            const textStr = text.replaceAll(/[ \t\r\n]/g, "");
            if (textStr.length > maxlength && maxlength != -1) {
                uni.showModal({
                    content: `超过${maxlength}字数啦~`,
                    confirmText: "确定",
                    showCancel: false,
                    success: () => {
                        this.$emit("overMax", { html, text }, this.editorId);
                    }
                });
            } else {
                this.$emit("input", { html, text }, this.editorId);
            }
        },
        // 导出
        exportHtml() {
            this.editorCtx.getContents({
                success: (res) => {
                    this.$emit("exportHtml", res.html, this.editorId);
                }
            });
        },
        eLongpress() {
            /**
			 * 微信小程序官方editor的长按事件有bug，需要重写覆盖，不需做任何逻辑，可见下面小程序社区问题链接
			 * @tutorial https://developers.weixin.qq.com/community/develop/doc/000c04b3e1c1006f660065e4f61000
			 */
        }
    }
};
</script>

<style lang="scss">
@import '@/uni_modules/sp-editor/icons/editor-icon.css';

.sp-editor {
	position: relative;
	display: flex;
	flex-direction: column;
	height: 100%;
}

.sp-editor-toolbar {
	box-sizing: border-box;
	display: grid;
	grid-template-columns: repeat(var(--icon-columns), 1fr);
	padding: calc(var(--icon-size) / 4) 0;
	font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	border-bottom: 1px solid #e4e4e4;
}

.iconfont {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: calc(var(--icon-size) * 1.8);
	font-size: var(--icon-size);
	cursor: pointer;
}

.sp-editor-wrapper {
	position: relative;
	flex: 1;
	overflow: hidden;
}

.editor-container {
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	padding: 8rpx 16rpx;
	font-size: 16px;
	line-height: 1.5;
}

.ql-image-overlay-none {
	::v-deep .ql-image-overlay {
		pointer-events: none;
		opacity: 0;
	}
}

::v-deep .ql-editor.ql-blank::before {
	font-style: normal;
	color: #ccc;
}

::v-deep .ql-container {
	min-height: unset;
}

.ql-active {
	color: #6cf;
}
</style>
