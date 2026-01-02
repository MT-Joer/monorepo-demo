"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");

(0, component_1.VantComponent)({
    props: {
        size: String,
        mark: Boolean,
        color: String,
        plain: Boolean,
        round: Boolean,
        textColor: String,
        type: {
            type: String,
            value: "default",
        },
        closeable: Boolean,
    },
    methods: {
        onClose () {
            this.$emit("close");
        },
    },
});
