import type { IFooItem } from "./foo.d";

import { http } from "@/utils/http";

export { IFooItem };

/** get 请求 */
export const getMockAPI = (name: string) => {
    return http<IFooItem>({
        url: `/api/get`,
        method: "GET",
        query: { name },
    });
};
