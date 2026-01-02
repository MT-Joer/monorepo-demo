"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");

(0, component_1.VantComponent)({
    classes: [ "avatar-class", "title-class", "row-class" ],
    props: {
        row: {
            type: Number,
            value: 0,
            observer (value) {
                this.setData({ rowArray: Array.from({ length: value }) });
            },
        },
        title: Boolean,
        avatar: Boolean,
        loading: {
            type: Boolean,
            value: true,
        },
        animate: {
            type: Boolean,
            value: true,
        },
        avatarSize: {
            type: String,
            value: "32px",
        },
        avatarShape: {
            type: String,
            value: "round",
        },
        titleWidth: {
            type: String,
            value: "40%",
        },
        rowWidth: {
            type: null,
            value: "100%",
            observer (val) {
                this.setData({ isArray: Array.isArray(val) });
            },
        },
    },
    data: {
        isArray: false,
        rowArray: [],
    },
});
