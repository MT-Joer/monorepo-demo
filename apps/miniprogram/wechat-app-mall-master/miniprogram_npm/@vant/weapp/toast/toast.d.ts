// / <reference types="miniprogram-api-typings" />
// / <reference types="miniprogram-api-typings" />
type ToastMessage = number | string;
type ToastContext = WechatMiniprogram.Component.TrivialInstance | WechatMiniprogram.Page.TrivialInstance;
interface ToastOptions {
    show?: boolean;
    type?: string;
    mask?: boolean;
    zIndex?: number;
    context?: (() => ToastContext) | ToastContext;
    position?: string;
    duration?: number;
    selector?: string;
    forbidClick?: boolean;
    loadingType?: string;
    message?: ToastMessage;
    onClose?: () => void;
}
declare function Toast(toastOptions: ToastMessage | ToastOptions): undefined | WechatMiniprogram.Component.TrivialInstance;
declare namespace Toast {
    var loading: (options: ToastMessage | ToastOptions) => undefined | WechatMiniprogram.Component.TrivialInstance;
    var success: (options: ToastMessage | ToastOptions) => undefined | WechatMiniprogram.Component.TrivialInstance;
    var fail: (options: ToastMessage | ToastOptions) => undefined | WechatMiniprogram.Component.TrivialInstance;
    var clear: () => void;
    var setDefaultOptions: (options: ToastOptions) => void;
    var resetDefaultOptions: () => void;
}
export default Toast;
