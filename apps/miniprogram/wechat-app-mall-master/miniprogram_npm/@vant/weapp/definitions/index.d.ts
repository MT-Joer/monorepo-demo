// / <reference types="miniprogram-api-typings" />
interface VantComponentInstance {
    parent: WechatMiniprogram.Component.TrivialInstance;
    children: WechatMiniprogram.Component.TrivialInstance[];
    index: number;
    $emit: (name: string, detail?: unknown, options?: WechatMiniprogram.Component.TriggerEventOption) => void;
    setView: (value: Record<string, any>, callback?: () => void) => void;
}
export type VantComponentOptions<Data extends WechatMiniprogram.Component.DataOption, Props extends WechatMiniprogram.Component.PropertyOption, Methods extends WechatMiniprogram.Component.MethodOption> = ThisType<Record<string, any> & VantComponentInstance & WechatMiniprogram.Component.Instance<Data & Record<string, any> & {
    name: string;
    value: any;
}, Props, Methods>> & {
    beforeCreate?: () => void;
    classes?: string[];
    created?: () => void;
    data?: Data;
    destroyed?: () => void;
    field?: boolean;
    methods?: Methods;
    mixins?: string[];
    mounted?: () => void;
    props?: Props;
    relation?: {
        mixin: string;
        relations: Record<string, WechatMiniprogram.Component.RelationOption>;
    };
    watch?: Record<string, (...args: any[]) => any>;
};

