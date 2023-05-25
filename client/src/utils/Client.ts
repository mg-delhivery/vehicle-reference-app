import { AAA } from '@os1-platform/console-ui-js';
import { OS1HttpClient } from '@os1-platform/console-ui-react';

export default class Network {
    instance;
    constructor(client: AAA, url: any) {
        this.instance = OS1HttpClient.createClient({
            baseURL: url,
        }, client
        );
    }

    get = (requestId: string, reqHeaders: object) => {
        return this.instance.get(``, {
            headers: {
                'X-COREOS-REQUEST-ID': requestId,
                ...reqHeaders,
            },
        });
    };

    post = (requestId: string, data: object, reqHeaders: object) => {
        return this.instance.post(``, data, {
            headers: {
                'X-COREOS-REQUEST-ID': requestId,
                ...reqHeaders,
            },
        });
    };

    put = (requestId: string, data: object, reqHeaders: object) => {
        return this.instance.put(``, data, {
            headers: {
                'X-COREOS-REQUEST-ID': requestId,
                ...reqHeaders,
            },
        });
    };
}
