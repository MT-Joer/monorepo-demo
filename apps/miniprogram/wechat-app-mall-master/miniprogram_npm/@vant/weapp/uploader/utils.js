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
exports.chooseFile = exports.isVideoFile = exports.isImageFile = void 0;
const utils_1 = require("../common/utils");
const validator_1 = require("../common/validator");

function isImageFile(item) {
    if (item.isImage != null) {
        return item.isImage;
    }
    if (item.type) {
        return item.type === "image";
    }
    if (item.url) {
        return (0, validator_1.isImageUrl)(item.url);
    }
    return false;
}
exports.isImageFile = isImageFile;
function isVideoFile(item) {
    if (item.isVideo != null) {
        return item.isVideo;
    }
    if (item.type) {
        return item.type === "video";
    }
    if (item.url) {
        return (0, validator_1.isVideoUrl)(item.url);
    }
    return false;
}
exports.isVideoFile = isVideoFile;
function formatImage(res) {
    return res.tempFiles.map((item) => { return (__assign(__assign({}, (0, utils_1.pickExclude)(item, [ "path" ])), { type: "image", url: item.tempFilePath || item.path, thumb: item.tempFilePath || item.path })); });
}
function formatVideo(res) {
    return [
        __assign(__assign({}, (0, utils_1.pickExclude)(res, [ "tempFilePath", "thumbTempFilePath", "errMsg" ])), { type: "video", url: res.tempFilePath, thumb: res.thumbTempFilePath }),
    ];
}
function formatMedia(res) {
    return res.tempFiles.map((item) => { return (__assign(__assign({}, (0, utils_1.pickExclude)(item, [ "fileType", "thumbTempFilePath", "tempFilePath" ])), { type: item.fileType, url: item.tempFilePath, thumb: item.fileType === "video" ? item.thumbTempFilePath : item.tempFilePath })); });
}
function formatFile(res) {
    return res.tempFiles.map((item) => { return (__assign(__assign({}, (0, utils_1.pickExclude)(item, [ "path" ])), { url: item.path })); });
}
function chooseFile(_a) {
    const accept = _a.accept; const multiple = _a.multiple; const capture = _a.capture; const compressed = _a.compressed; const maxDuration = _a.maxDuration; const sizeType = _a.sizeType; const camera = _a.camera; const maxCount = _a.maxCount; const mediaType = _a.mediaType; const extension = _a.extension;
    return new Promise((resolve, reject) => {
        switch (accept) {
            case "image": {
                if (utils_1.isPC || utils_1.isWxWork) {
                    wx.chooseImage({
                        count: multiple ? Math.min(maxCount, 9) : 1,
                        sourceType: capture,
                        sizeType,
                        success (res) { return resolve(formatImage(res)); },
                        fail: reject,
                    });
                }
                else {
                    wx.chooseMedia({
                        count: multiple ? Math.min(maxCount, 9) : 1,
                        mediaType: [ "image" ],
                        sourceType: capture,
                        maxDuration,
                        sizeType,
                        camera,
                        success (res) { return resolve(formatImage(res)); },
                        fail: reject,
                    });
                }
                break;
            }
            case "media": {
                wx.chooseMedia({
                    count: multiple ? Math.min(maxCount, 9) : 1,
                    mediaType,
                    sourceType: capture,
                    maxDuration,
                    sizeType,
                    camera,
                    success (res) { return resolve(formatMedia(res)); },
                    fail: reject,
                });
                break;
            }
            case "video": {
                wx.chooseVideo({
                    sourceType: capture,
                    compressed,
                    maxDuration,
                    camera,
                    success (res) { return resolve(formatVideo(res)); },
                    fail: reject,
                });
                break;
            }
            default: {
                wx.chooseMessageFile(__assign(__assign({ count: multiple ? maxCount : 1, type: accept }, (extension ? { extension } : {})), { success (res) { return resolve(formatFile(res)); }, fail: reject }));
                break;
            }
        }
    });
}
exports.chooseFile = chooseFile;
