"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const button_1 = require("../mixins/button");

(0, component_1.VantComponent)({
    mixins: [ button_1.button ],
    classes: [ "custom-class", "loading-class", "error-class", "image-class" ],
    props: {
        src: {
            type: String,
            observer () {
                this.setData({
                    error: false,
                    loading: true,
                });
            },
        },
        round: Boolean,
        width: null,
        height: null,
        radius: null,
        lazyLoad: Boolean,
        useErrorSlot: Boolean,
        useLoadingSlot: Boolean,
        showMenuByLongpress: Boolean,
        fit: {
            type: String,
            value: "fill",
        },
        webp: {
            type: Boolean,
            value: false,
        },
        showError: {
            type: Boolean,
            value: true,
        },
        showLoading: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        error: false,
        loading: true,
        viewStyle: "",
    },
    methods: {
        onLoad (event) {
            this.setData({
                loading: false,
            });
            this.$emit("load", event.detail);
        },
        onError (event) {
            this.setData({
                loading: false,
                error: true,
            });
            this.$emit("error", event.detail);
        },
        onClick (event) {
            this.$emit("click", event.detail);
        },
    },
});
