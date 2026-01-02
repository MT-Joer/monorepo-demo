"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var i = 1, n = arguments.length, s; i < n; i++) {
            s = arguments[i];
            for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return Reflect.apply(__assign, this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const validator_1 = require("../common/validator");
const shared_1 = require("./shared");
const utils_1 = require("./utils");

(0, component_1.VantComponent)({
    props: __assign(__assign(__assign(__assign({ disabled: Boolean, multiple: Boolean, uploadText: String, useBeforeRead: Boolean, afterRead: null, beforeRead: null, previewSize: {
        type: null,
        value: 80,
    }, name: {
        type: null,
        value: "",
    }, accept: {
        type: String,
        value: "image",
    }, fileList: {
        type: Array,
        value: [],
        observer: "formatFileList",
    }, maxSize: {
        type: Number,
        value: Number.MAX_VALUE,
    }, maxCount: {
        type: Number,
        value: 100,
    }, deletable: {
        type: Boolean,
        value: true,
    }, showUpload: {
        type: Boolean,
        value: true,
    }, previewImage: {
        type: Boolean,
        value: true,
    }, previewFullImage: {
        type: Boolean,
        value: true,
    }, videoFit: {
        type: String,
        value: "contain",
    }, imageFit: {
        type: String,
        value: "scaleToFill",
    }, uploadIcon: {
        type: String,
        value: "photograph",
    } }, shared_1.imageProps), shared_1.videoProps), shared_1.mediaProps), shared_1.messageFileProps),
    data: {
        lists: [],
        isInCount: true,
    },
    methods: {
        formatFileList () {
            const _a = this.data; const _b = _a.fileList; const fileList = _b === void 0 ? [] : _b; const maxCount = _a.maxCount;
            const lists = fileList.map((item) => { return (__assign(__assign({}, item), { isImage: (0, utils_1.isImageFile)(item), isVideo: (0, utils_1.isVideoFile)(item), deletable: (0, validator_1.isBoolean)(item.deletable) ? item.deletable : true })); });
            this.setData({ lists, isInCount: lists.length < maxCount });
        },
        getDetail (index) {
            return {
                name: this.data.name,
                index: index == null ? this.data.fileList.length : index,
            };
        },
        startUpload () {
            const _this = this;
            const _a = this.data; const maxCount = _a.maxCount; const multiple = _a.multiple; const lists = _a.lists; const disabled = _a.disabled;
            if (disabled)
                return;
            (0, utils_1.chooseFile)(__assign(__assign({}, this.data), { maxCount: maxCount - lists.length }))
                .then((res) => {
                    _this.onBeforeRead(multiple ? res : res[0]);
                })
                .catch((error) => {
                    _this.$emit("error", error);
                });
        },
        onBeforeRead (file) {
            const _this = this;
            const _a = this.data; const beforeRead = _a.beforeRead; const useBeforeRead = _a.useBeforeRead;
            let res = true;
            if (typeof beforeRead === "function") {
                res = beforeRead(file, this.getDetail());
            }
            if (useBeforeRead) {
                res = new Promise((resolve, reject) => {
                    _this.$emit("before-read", __assign(__assign({ file }, _this.getDetail()), { callback (ok) {
                        ok ? resolve() : reject();
                    } }));
                });
            }
            if (!res) {
                return;
            }
            if ((0, validator_1.isPromise)(res)) {
                res.then((data) => { return _this.onAfterRead(data || file); });
            }
            else {
                this.onAfterRead(file);
            }
        },
        onAfterRead (file) {
            const _a = this.data; const maxSize = _a.maxSize; const afterRead = _a.afterRead;
            const oversize = Array.isArray(file)
                ? file.some((item) => { return item.size > maxSize; })
                : file.size > maxSize;
            if (oversize) {
                this.$emit("oversize", __assign({ file }, this.getDetail()));
                return;
            }
            if (typeof afterRead === "function") {
                afterRead(file, this.getDetail());
            }
            this.$emit("after-read", __assign({ file }, this.getDetail()));
        },
        deleteItem (event) {
            const index = event.currentTarget.dataset.index;
            this.$emit("delete", __assign(__assign({}, this.getDetail(index)), { file: this.data.fileList[index] }));
        },
        onPreviewImage (event) {
            if (!this.data.previewFullImage)
                return;
            const index = event.currentTarget.dataset.index;
            const _a = this.data; const lists = _a.lists; const showmenu = _a.showmenu;
            const item = lists[index];
            wx.previewImage({
                urls: lists.filter((item) => { return (0, utils_1.isImageFile)(item); }).map((item) => { return item.url; }),
                current: item.url,
                showmenu,
                fail () {
                    wx.showToast({ title: "预览图片失败", icon: "none" });
                },
            });
        },
        onPreviewVideo (event) {
            if (!this.data.previewFullImage)
                return;
            const index = event.currentTarget.dataset.index;
            const lists = this.data.lists;
            const sources = [];
            const current = lists.reduce((sum, cur, curIndex) => {
                if (!(0, utils_1.isVideoFile)(cur)) {
                    return sum;
                }
                sources.push(__assign(__assign({}, cur), { type: "video" }));
                if (curIndex < index) {
                    sum++;
                }
                return sum;
            }, 0);
            wx.previewMedia({
                sources,
                current,
                fail () {
                    wx.showToast({ title: "预览视频失败", icon: "none" });
                },
            });
        },
        onPreviewFile (event) {
            const index = event.currentTarget.dataset.index;
            wx.openDocument({
                filePath: this.data.lists[index].url,
                showMenu: true,
            });
        },
        onClickPreview (event) {
            const index = event.currentTarget.dataset.index;
            const item = this.data.lists[index];
            this.$emit("click-preview", __assign(__assign({}, item), this.getDetail(index)));
        },
    },
});
