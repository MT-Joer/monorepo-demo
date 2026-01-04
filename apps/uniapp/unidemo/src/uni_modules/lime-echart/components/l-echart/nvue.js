export class Echarts {
    eventMap = new Map();
    constructor(webview) {
        this.webview = webview;
        this.options = null;
    }
    clear() {
        this.webview.evalJs(`clear()`);
    }
    dispatchAction(type, options){
        const handler = this.eventMap.get(type);
        if (handler){
            handler(options);
        }
    }
    dispose() {
        this.webview.evalJs(`dispose()`);
    }
    getOption() {
        return this.options;
    }
    hideLoading() {
        this.webview.evalJs(`hideLoading()`);
    }
    on(type, ...args) {
        const query = args[0];
        const useQuery = query && typeof query !== "function";
        const param = useQuery ? [ type, query ] : [ type ];
        const key = `${type}${useQuery ? JSON.stringify(query): "" }`;
        const callback = useQuery ? args[1]: args[0];
        if (typeof callback === "function"){
            this.eventMap.set(key, callback);
        }
        this.webview.evalJs(`on(${JSON.stringify(param)})`);
        console.warn("nvue 暂不支持事件");
    }
    resize(size) {
        if (size) {
            this.webview.evalJs(`resize(${JSON.stringify(size)})`);
        } else {
            this.webview.evalJs(`resize()`);
        }
    }
    setOption() {
        this.options = arguments;
        this.webview.evalJs(`setOption(${JSON.stringify(arguments)})`);
    }
    showLoading() {
        this.webview.evalJs(`showLoading(${JSON.stringify(arguments)})`);
    }
}
