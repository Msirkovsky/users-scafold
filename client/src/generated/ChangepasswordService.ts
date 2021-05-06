// generated file. DO NOT EDIT!!!!
import { HttpService,  GetParamsType, PostParamsType } from '../services/http.service';
import * as models from './Models';
import * as converters from './Converters';

export class ChangepasswordService {
    constructor(private httpService: HttpService) {
    }
    GetByRequestChangePasswordGet = async (requestChangePassword: string, params: GetParamsType = {}): Promise<models.ChangePasswordModel> => {
        const httpData: any = await this.httpService.get(`/api/changepassword/get/${requestChangePassword}`, params);
        const convertedHttpData = converters.ChangePasswordModelHttpConvertor(httpData);
        return convertedHttpData;
    }
    ChangePasswordPost = async (params: PostParamsType = {}): Promise<models.SaveResult> => {
        const dataToSend = null;
        const httpData = await this.httpService.post(`/api/changepassword/changepassword`, dataToSend, params);
        const convertedHttpData = converters.SaveResultHttpConvertor(httpData);
        return httpData;
    }
}