"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChildren = exports.useParent = void 0;
function useParent(name, onEffect) {
    let _a;
    const path = "../".concat(name, "/index");
    return {
        relations: (_a = {},
        _a[path] = {
            type: "ancestor",
            linked () {
                onEffect && onEffect.call(this);
            },
            linkChanged () {
                onEffect && onEffect.call(this);
            },
            unlinked () {
                onEffect && onEffect.call(this);
            },
        },
        _a),
        mixin: Behavior({
            created () {
                const _this = this;
                Object.defineProperty(this, "parent", {
                    get () { return _this.getRelationNodes(path)[0]; },
                });
                Object.defineProperty(this, "index", {
                    // @ts-ignore
                    get () { let _a, _b; return (_b = (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.indexOf(_this); },
                });
            },
        }),
    };
}
exports.useParent = useParent;
function useChildren(name, onEffect) {
    let _a;
    const path = "../".concat(name, "/index");
    return {
        relations: (_a = {},
        _a[path] = {
            type: "descendant",
            linked (target) {
                onEffect && onEffect.call(this, target);
            },
            linkChanged (target) {
                onEffect && onEffect.call(this, target);
            },
            unlinked (target) {
                onEffect && onEffect.call(this, target);
            },
        },
        _a),
        mixin: Behavior({
            created () {
                const _this = this;
                Object.defineProperty(this, "children", {
                    get () { return _this.getRelationNodes(path) || []; },
                });
            },
        }),
    };
}
exports.useChildren = useChildren;
