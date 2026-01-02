"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const button_1 = require("../mixins/button");
const link_1 = require("../mixins/link");

(0, component_1.VantComponent)({
    classes: [ "icon-class", "text-class", "info-class" ],
    mixins: [ link_1.link, button_1.button ],
    props: {
        text: String,
        dot: Boolean,
        info: String,
        icon: String,
        size: String,
        color: String,
        classPrefix: {
            type: String,
            value: "van-icon",
        },
        disabled: Boolean,
        loading: Boolean,
    },
    methods: {
        onClick (event) {
            this.$emit("click", event.detail);
            this.jumpLink();
        },
    },
});
