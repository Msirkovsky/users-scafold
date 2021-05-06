import axios, { AxiosRequestConfig } from 'axios';
import { MessageService } from './message.service';

export type GetParamsType =  {queryParams?: object, headers?: object};
export type PostParamsType = {queryParams?: object, headers?: object, customSuccesMessage?: string, hideMessage?: boolean};
export class HttpService {
    constructor(
        private serverUrl: string,
        private messageService: MessageService,
    ) {
    }

    post = (
        url: string,
        data: any,
        params: PostParamsType = {}
    ): Promise<any> => {
        const {headers = {}, queryParams = {}, customSuccesMessage, hideMessage} = params;
        const config: AxiosRequestConfig = {
            headers: this.createHeaders(headers),
            params: queryParams
        };

        const request = axios.post(`${this.serverUrl}${url}`, data, config)
            .catch(error => {              
                console.warn(error);
                throw new Error('Neznámá chyba. Zkuste prosím akci opakovat později');
            })
            .then((response) => {
                if (response.data == null || response.data.isOk) {
                    if (hideMessage !== true) {
                        if (customSuccesMessage != null) {
                            this.messageService.showSuccess(customSuccesMessage);
                        } else {
                            this.messageService.showSuccess('Data uložena');
                        }
                    }
                    return response.data;
                } else {
                    if (response.data.errors != null) {
                        throw new Error((response.data.errors as string[]).join('; '));
                    } else {
                        throw new Error('Neznámá chyba. Zkuste prosím akci opakovat později');
                    }
                }                
            });

        request.catch((error: Error) => {
            this.messageService.showErrorWithTitle( error.message, 'Chyba při ukládání dat');
        });

        return request;
    }

    put = (
        url: string,
        data: any,
        params: PostParamsType = {}
    ): Promise<any> => {
        const {headers = {}, queryParams = {}, customSuccesMessage} = params;
        const config: AxiosRequestConfig = {
            headers: this.createHeaders(headers),
            params: queryParams
        };

        const request = axios.post(`${this.serverUrl}${url}`, data, config)
            .catch(error => {              
                console.warn(error);
                throw new Error('Neznámá chyba. Zkuste prosím akci opakovat později');
            })
            .then((response) => {
                if (response.data == null || response.data.isOk) {
                    if (customSuccesMessage != null) {
                        this.messageService.showSuccess(customSuccesMessage);
                    } else {
                        this.messageService.showSuccess('Data uložena');
                    }
                    return response.data;
                } else {
                    if (response.data.errors != null) {
                        throw new Error((response.data.errors as string[]).join('; '));
                    } else {
                        throw new Error('Neznámá chyba. Zkuste prosím akci opakovat později');
                    }
                }                
            });

        request.catch((error: Error) => {
            this.messageService.showErrorWithTitle( error.message, 'Chyba při ukládání dat');
        });

        return request;
    }

    get = (url: string, params: GetParamsType = {}): Promise<any> => {
        const {headers = {}, queryParams = {}} = params;
        const config: AxiosRequestConfig = {
            headers: this.createHeaders(headers),
            params: queryParams
        };
        return axios.get(`${this.serverUrl}${url}`, config)
            .then((response) => {
                return response.data;
            }).catch(error => {
                this.messageService.showError('Chyba při načítání dat');
                throw error;
            });
    }

    createHeaders(headers: any = {}) {
        return {...headers, 'Authorization': 'Bearer ' +  localStorage.getItem('accessToken')};
    }   
    login = (body: any) => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    
        return axios.post(this.serverUrl + '/api/token/generate', body, {headers: headers })
            .then(response => {
                const token = response.data.token;
                localStorage.setItem('accessToken', token);
                return token;
            });
    }
    logout = () => localStorage.removeItem('accessToken');

    public getToken = () => {
        const token = localStorage.getItem('accessToken');
        return token;
    }
}