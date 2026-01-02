"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageScrollMixin = void 0;
const utils_1 = require("../common/utils");
const validator_1 = require("../common/validator");

function onPageScroll(event) {
    const _a = (0, utils_1.getCurrentPage)().vanPageScroller; const vanPageScroller = _a === void 0 ? [] : _a;
    vanPageScroller.forEach((scroller) => {
        if (typeof scroller === "function") {
            // @ts-ignore
            scroller(event);
        }
    });
}
function pageScrollMixin(scroller) {
    return Behavior({
        attached () {
            const page = (0, utils_1.getCurrentPage)();
            if (!(0, utils_1.isDef)(page)) {
                return;
            }
            const _scroller = scroller.bind(this);
            const _a = page.vanPageScroller; const vanPageScroller = _a === void 0 ? [] : _a;
            if ((0, validator_1.isFunction)(page.onPageScroll) && page.onPageScroll !== onPageScroll) {
                vanPageScroller.push(page.onPageScroll.bind(page));
            }
            vanPageScroller.push(_scroller);
            page.vanPageScroller = vanPageScroller;
            page.onPageScroll = onPageScroll;
            this._scroller = _scroller;
        },
        detached () {
            const _this = this;
            const page = (0, utils_1.getCurrentPage)();
            if (!(0, utils_1.isDef)(page) || !(0, utils_1.isDef)(page.vanPageScroller)) {
                return;
            }
            const vanPageScroller = page.vanPageScroller;
            const index = vanPageScroller.indexOf(_this._scroller);
            if (index !== -1) {
                page.vanPageScroller.splice(index, 1);
            }
            this._scroller = undefined;
        },
    });
}
exports.pageScrollMixin = pageScrollMixin;
