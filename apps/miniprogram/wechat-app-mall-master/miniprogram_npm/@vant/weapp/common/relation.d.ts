// / <reference types="miniprogram-api-typings" />
type TrivialInstance = WechatMiniprogram.Component.TrivialInstance;
export declare function useParent(name: string, onEffect?: (this: TrivialInstance) => void): {
    mixin: string;
    relations: {
        [x: string]: WechatMiniprogram.Component.RelationOption;
    };
};
export declare function useChildren(name: string, onEffect?: (this: TrivialInstance, target: TrivialInstance) => void): {
    mixin: string;
    relations: {
        [x: string]: WechatMiniprogram.Component.RelationOption;
    };
};

