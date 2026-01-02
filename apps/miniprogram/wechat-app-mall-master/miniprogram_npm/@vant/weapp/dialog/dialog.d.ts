// / <reference types="miniprogram-api-typings" />
// / <reference types="miniprogram-api-typings" />
export type Action = "cancel" | "confirm" | "overlay";
type DialogContext = WechatMiniprogram.Component.TrivialInstance | WechatMiniprogram.Page.TrivialInstance;
interface DialogOptions {
    lang?: string;
    show?: boolean;
    title?: string;
    width?: null | number | string;
    zIndex?: number;
    theme?: string;
    context?: (() => DialogContext) | DialogContext;
    message?: string;
    overlay?: boolean;
    selector?: string;
    ariaLabel?: string;
    /**
     * @deprecated use custom-class instead
     */
    className?: string;
    customStyle?: string;
    transition?: string;
    /**
     * @deprecated use beforeClose instead
     */
    asyncClose?: boolean;
    beforeClose?: ((action: Action) => Promise<boolean | void> | void) | null;
    businessId?: number;
    sessionFrom?: string;
    overlayStyle?: string;
    appParameter?: string;
    messageAlign?: string;
    sendMessageImg?: string;
    showMessageCard?: boolean;
    sendMessagePath?: string;
    sendMessageTitle?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
    closeOnClickOverlay?: boolean;
    confirmButtonOpenType?: string;
}
declare const Dialog: {
    (options: DialogOptions): Promise<WechatMiniprogram.Component.TrivialInstance>;
    alert(options: DialogOptions): Promise<WechatMiniprogram.Component.TrivialInstance>;
    close(): void;
    confirm(options: DialogOptions): Promise<WechatMiniprogram.Component.TrivialInstance>;
    currentOptions: DialogOptions;
    defaultOptions: DialogOptions;
    resetDefaultOptions(): void;
    setDefaultOptions(options: DialogOptions): void;
    stopLoading(): void;
};
export default Dialog;
