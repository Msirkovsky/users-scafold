// generated file. DO NOT EDIT!!!!
import { HttpService,  GetParamsType, PostParamsType } from '../services/http.service';
import * as models from './Models';
import * as converters from './Converters';

export class UsersService {
    constructor(private httpService: HttpService) {
    }
    GetHomePageByUserGet = async (params: GetParamsType = {}): Promise<string> => {
        const httpData: any = await this.httpService.get(`/api/users/gethomepagebyuser`, params);
        const convertedHttpData = httpData as string;
        return convertedHttpData;
    }
    FilterGet = async (params: GetParamsType = {}): Promise<any> => {
        const httpData: any = await this.httpService.get(`/api/users/filter`, params);
        const convertedHttpData = httpData;
        return convertedHttpData;
    }
    ListGet = async (params: GetParamsType = {}): Promise<models.UserView[]> => {
        const httpData: any = await this.httpService.get(`/api/users/list`, params);
        const convertedHttpData = httpData.map(converters.UserViewHttpConvertor);
        return convertedHttpData;
    }
    NewGet = async (params: GetParamsType = {}): Promise<models.UserEditModel> => {
        const httpData: any = await this.httpService.get(`/api/users/new`, params);
        const convertedHttpData = converters.UserEditModelHttpConvertor(httpData);
        return convertedHttpData;
    }
    GetForEditByIdGet = async (id: string, params: GetParamsType = {}): Promise<models.UserEditModel> => {
        const httpData: any = await this.httpService.get(`/api/users/getforedit/${id}`, params);
        const convertedHttpData = converters.UserEditModelHttpConvertor(httpData);
        return convertedHttpData;
    }
    SavePost = async (model: models.UserModel, params: PostParamsType = {}): Promise<models.SaveResult> => {
        const dataToSend = converters.UserModelToHttpConvertor(model);
        const httpData = await this.httpService.post(`/api/users/save`, dataToSend, params);
        const convertedHttpData = converters.SaveResultHttpConvertor(httpData);
        return httpData;
    }
    GetActualUserInfoGet = async (params: GetParamsType = {}): Promise<models.ActualUserInfo> => {
        const httpData: any = await this.httpService.get(`/api/users/getactualuserinfo`, params);
        const convertedHttpData = converters.ActualUserInfoHttpConvertor(httpData);
        return convertedHttpData;
    }
    RequestChangePasswordPost = async (model: models.ChangePasswordByAdmin, params: PostParamsType = {}): Promise<models.SaveResult> => {
        const dataToSend = converters.ChangePasswordByAdminToHttpConvertor(model);
        const httpData = await this.httpService.post(`/api/users/requestchangepassword`, dataToSend, params);
        const convertedHttpData = converters.SaveResultHttpConvertor(httpData);
        return httpData;
    }
    RegisterPost = async (request: models.RegisterRequest, params: PostParamsType = {}): Promise<models.SaveResult> => {
        const dataToSend = converters.RegisterRequestToHttpConvertor(request);
        const httpData = await this.httpService.post(`/api/users/register`, dataToSend, params);
        const convertedHttpData = converters.SaveResultHttpConvertor(httpData);
        return httpData;
    }
    ByIdGet = async (id: string, params: GetParamsType = {}): Promise<models.User> => {
        const httpData: any = await this.httpService.get(`/api/users/${id}`, params);
        const convertedHttpData = converters.UserHttpConvertor(httpData);
        return convertedHttpData;
    }
}