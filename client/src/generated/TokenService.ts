// generated file. DO NOT EDIT!!!!
import { HttpService,  GetParamsType, PostParamsType } from '../services/http.service';
import * as models from './Models';
import * as converters from './Converters';

export class TokenService {
    constructor(private httpService: HttpService) {
    }
    GeneratePost = async (model: models.LoginViewModel, params: PostParamsType = {}): Promise<any> => {
        const dataToSend = converters.LoginViewModelToHttpConvertor(model);
        const httpData = await this.httpService.post(`/api/token/generate`, dataToSend, params);
        const convertedHttpData = httpData;
        return httpData;
    }
    RefreshGet = async (params: GetParamsType = {}): Promise<any> => {
        const httpData: any = await this.httpService.get(`/api/token/refresh`, params);
        const convertedHttpData = httpData;
        return convertedHttpData;
    }
}