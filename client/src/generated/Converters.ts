// generated file. DO NOT EDIT!!!!
import * as moment from 'moment';
import * as models from './Models';
export const AktivityResponseHttpConvertor = (httpData: any): models.AktivityResponse => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        aktivity: httpData.aktivity == null
                    ? null
                    : httpData.aktivity.map(AktivitaVMHttpConvertor),
    };
};
export const AktivitaVMHttpConvertor = (httpData: any): models.AktivitaVM => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        datum: httpData.datum == null ? null : moment (httpData.datum, 'YYYY-MM-DDTHH:mm:ss').toDate(),
    };
};
export const SaveResultHttpConvertor = (httpData: any): models.SaveResult => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const FirmaResponseHttpConvertor = (httpData: any): models.FirmaResponse => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        data: httpData.data == null ? null : FirmaVMHttpConvertor(httpData.data),
        dataSources: httpData.dataSources == null ? null : FirmaResponseDataSourcesHttpConvertor(httpData.dataSources),
    };
};
export const FirmaVMHttpConvertor = (httpData: any): models.FirmaVM => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        adresy: httpData.adresy == null
                    ? null
                    : httpData.adresy.map(AdresaVMHttpConvertor),
        kontakty: httpData.kontakty == null
                    ? null
                    : httpData.kontakty.map(KontaktVMHttpConvertor),
    };
};
export const FirmaResponseDataSourcesHttpConvertor = (httpData: any): models.FirmaResponseDataSources => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        cinnost: httpData.cinnost == null
                    ? null
                    : httpData.cinnost.map(CinnostHttpConvertor),
        stredisko: httpData.stredisko == null
                    ? null
                    : httpData.stredisko.map(StrediskoHttpConvertor),
        forma: httpData.forma == null
                    ? null
                    : httpData.forma.map(FormaHttpConvertor),
        zakazka: httpData.zakazka == null
                    ? null
                    : httpData.zakazka.map(ZakazkaHttpConvertor),
    };
};
export const AdresaVMHttpConvertor = (httpData: any): models.AdresaVM => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const KontaktVMHttpConvertor = (httpData: any): models.KontaktVM => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const CinnostHttpConvertor = (httpData: any): models.Cinnost => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const StrediskoHttpConvertor = (httpData: any): models.Stredisko => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const FormaHttpConvertor = (httpData: any): models.Forma => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const ZakazkaHttpConvertor = (httpData: any): models.Zakazka => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const ChangePasswordModelHttpConvertor = (httpData: any): models.ChangePasswordModel => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const NotificationForUserHttpConvertor = (httpData: any): models.NotificationForUser => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const SendMessageRequestHttpConvertor = (httpData: any): models.SendMessageRequest => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const NotificationRequestHttpConvertor = (httpData: any): models.NotificationRequest => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const ObchodniZastupceDetailHttpConvertor = (httpData: any): models.ObchodniZastupceDetail => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        obchodniZastupce: httpData.obchodniZastupce == null ? null : ObchodniZastupceVMHttpConvertor(httpData.obchodniZastupce),
        dataSource: httpData.dataSource == null ? null : ObchodniZastupceDataSourceHttpConvertor(httpData.dataSource),
    };
};
export const ObchodniZastupceVMHttpConvertor = (httpData: any): models.ObchodniZastupceVM => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const ObchodniZastupceDataSourceHttpConvertor = (httpData: any): models.ObchodniZastupceDataSource => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        users: httpData.users == null
                    ? null
                    : httpData.users.map(NameAndIdHttpConvertor),
        strediska: httpData.strediska == null
                    ? null
                    : httpData.strediska.map(NameAndIdIntHttpConvertor),
    };
};
export const NameAndIdHttpConvertor = (httpData: any): models.NameAndId => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const NameAndIdIntHttpConvertor = (httpData: any): models.NameAndIdInt => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const RequestChangePasswordInputHttpConvertor = (httpData: any): models.RequestChangePasswordInput => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const ConfirmChangePasswordInputHttpConvertor = (httpData: any): models.ConfirmChangePasswordInput => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const RoleHttpConvertor = (httpData: any): models.Role => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const LoginViewModelHttpConvertor = (httpData: any): models.LoginViewModel => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const UserViewHttpConvertor = (httpData: any): models.UserView => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        lastLoginDate: httpData.lastLoginDate == null ? null : moment (httpData.lastLoginDate, 'YYYY-MM-DDTHH:mm:ss').toDate(),
        dtAktualizace: httpData.dtAktualizace == null ? null : moment (httpData.dtAktualizace, 'YYYY-MM-DDTHH:mm:ss').toDate(),
        datumISImportu: httpData.datumISImportu == null ? null : moment (httpData.datumISImportu, 'YYYY-MM-DDTHH:mm:ss').toDate(),
        dtCreated: httpData.dtCreated == null ? null : moment (httpData.dtCreated, 'YYYY-MM-DDTHH:mm:ss').toDate(),
    };
};
export const UserEditModelHttpConvertor = (httpData: any): models.UserEditModel => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        entity: httpData.entity == null ? null : UserModelHttpConvertor(httpData.entity),
        datasource: httpData.datasource == null ? null : DetailUserDatasourceHttpConvertor(httpData.datasource),
    };
};
export const UserModelHttpConvertor = (httpData: any): models.UserModel => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const DetailUserDatasourceHttpConvertor = (httpData: any): models.DetailUserDatasource => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        roles: httpData.roles == null
                    ? null
                    : httpData.roles.map(RoleHttpConvertor),
    };
};
export const ActualUserInfoHttpConvertor = (httpData: any): models.ActualUserInfo => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const ChangePasswordByAdminHttpConvertor = (httpData: any): models.ChangePasswordByAdmin => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const RegisterRequestHttpConvertor = (httpData: any): models.RegisterRequest => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
    };
};
export const UserHttpConvertor = (httpData: any): models.User => {
    if (httpData == null) { return null as any; }
    return {
        ...httpData,
        lastLoginDate: httpData.lastLoginDate == null ? null : moment (httpData.lastLoginDate, 'YYYY-MM-DDTHH:mm:ss').toDate(),
        dtAktualizace: httpData.dtAktualizace == null ? null : moment (httpData.dtAktualizace, 'YYYY-MM-DDTHH:mm:ss').toDate(),
        datumISImportu: httpData.datumISImportu == null ? null : moment (httpData.datumISImportu, 'YYYY-MM-DDTHH:mm:ss').toDate(),
        dtCreated: httpData.dtCreated == null ? null : moment (httpData.dtCreated, 'YYYY-MM-DDTHH:mm:ss').toDate(),
    };
};
export const AktivityResponseToHttpConvertor = (toHttpData: models.AktivityResponse): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        aktivity: toHttpData.aktivity == null
                     ? null
                     : toHttpData.aktivity.map(AktivitaVMToHttpConvertor),
    };
};
export const AktivitaVMToHttpConvertor = (toHttpData: models.AktivitaVM): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        datum: toHttpData.datum == null ? null : moment (toHttpData.datum).format('YYYY-MM-DDTHH:mm:ss'),
    };
};
export const SaveResultToHttpConvertor = (toHttpData: models.SaveResult): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const FirmaResponseToHttpConvertor = (toHttpData: models.FirmaResponse): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        data: FirmaVMToHttpConvertor(toHttpData.data),
        dataSources: FirmaResponseDataSourcesToHttpConvertor(toHttpData.dataSources),
    };
};
export const FirmaVMToHttpConvertor = (toHttpData: models.FirmaVM): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        adresy: toHttpData.adresy == null
                     ? null
                     : toHttpData.adresy.map(AdresaVMToHttpConvertor),
        kontakty: toHttpData.kontakty == null
                     ? null
                     : toHttpData.kontakty.map(KontaktVMToHttpConvertor),
    };
};
export const FirmaResponseDataSourcesToHttpConvertor = (toHttpData: models.FirmaResponseDataSources): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        cinnost: toHttpData.cinnost == null
                     ? null
                     : toHttpData.cinnost.map(CinnostToHttpConvertor),
        stredisko: toHttpData.stredisko == null
                     ? null
                     : toHttpData.stredisko.map(StrediskoToHttpConvertor),
        forma: toHttpData.forma == null
                     ? null
                     : toHttpData.forma.map(FormaToHttpConvertor),
        zakazka: toHttpData.zakazka == null
                     ? null
                     : toHttpData.zakazka.map(ZakazkaToHttpConvertor),
    };
};
export const AdresaVMToHttpConvertor = (toHttpData: models.AdresaVM): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const KontaktVMToHttpConvertor = (toHttpData: models.KontaktVM): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const CinnostToHttpConvertor = (toHttpData: models.Cinnost): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const StrediskoToHttpConvertor = (toHttpData: models.Stredisko): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const FormaToHttpConvertor = (toHttpData: models.Forma): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const ZakazkaToHttpConvertor = (toHttpData: models.Zakazka): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const ChangePasswordModelToHttpConvertor = (toHttpData: models.ChangePasswordModel): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const NotificationForUserToHttpConvertor = (toHttpData: models.NotificationForUser): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const SendMessageRequestToHttpConvertor = (toHttpData: models.SendMessageRequest): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const NotificationRequestToHttpConvertor = (toHttpData: models.NotificationRequest): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const ObchodniZastupceDetailToHttpConvertor = (toHttpData: models.ObchodniZastupceDetail): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        obchodniZastupce: ObchodniZastupceVMToHttpConvertor(toHttpData.obchodniZastupce),
        dataSource: ObchodniZastupceDataSourceToHttpConvertor(toHttpData.dataSource),
    };
};
export const ObchodniZastupceVMToHttpConvertor = (toHttpData: models.ObchodniZastupceVM): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const ObchodniZastupceDataSourceToHttpConvertor = (toHttpData: models.ObchodniZastupceDataSource): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        users: toHttpData.users == null
                     ? null
                     : toHttpData.users.map(NameAndIdToHttpConvertor),
        strediska: toHttpData.strediska == null
                     ? null
                     : toHttpData.strediska.map(NameAndIdIntToHttpConvertor),
    };
};
export const NameAndIdToHttpConvertor = (toHttpData: models.NameAndId): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const NameAndIdIntToHttpConvertor = (toHttpData: models.NameAndIdInt): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const RequestChangePasswordInputToHttpConvertor = (toHttpData: models.RequestChangePasswordInput): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const ConfirmChangePasswordInputToHttpConvertor = (toHttpData: models.ConfirmChangePasswordInput): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const RoleToHttpConvertor = (toHttpData: models.Role): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const LoginViewModelToHttpConvertor = (toHttpData: models.LoginViewModel): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const UserViewToHttpConvertor = (toHttpData: models.UserView): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        lastLoginDate: toHttpData.lastLoginDate == null ? null : moment (toHttpData.lastLoginDate).format('YYYY-MM-DDTHH:mm:ss'),
        dtAktualizace: toHttpData.dtAktualizace == null ? null : moment (toHttpData.dtAktualizace).format('YYYY-MM-DDTHH:mm:ss'),
        datumISImportu: toHttpData.datumISImportu == null ? null : moment (toHttpData.datumISImportu).format('YYYY-MM-DDTHH:mm:ss'),
        dtCreated: toHttpData.dtCreated == null ? null : moment (toHttpData.dtCreated).format('YYYY-MM-DDTHH:mm:ss'),
    };
};
export const UserEditModelToHttpConvertor = (toHttpData: models.UserEditModel): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        entity: UserModelToHttpConvertor(toHttpData.entity),
        datasource: DetailUserDatasourceToHttpConvertor(toHttpData.datasource),
    };
};
export const UserModelToHttpConvertor = (toHttpData: models.UserModel): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const DetailUserDatasourceToHttpConvertor = (toHttpData: models.DetailUserDatasource): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        roles: toHttpData.roles == null
                     ? null
                     : toHttpData.roles.map(RoleToHttpConvertor),
    };
};
export const ActualUserInfoToHttpConvertor = (toHttpData: models.ActualUserInfo): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const ChangePasswordByAdminToHttpConvertor = (toHttpData: models.ChangePasswordByAdmin): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const RegisterRequestToHttpConvertor = (toHttpData: models.RegisterRequest): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
    };
};
export const UserToHttpConvertor = (toHttpData: models.User): any  => {
    if (toHttpData == null) { return null as any; }
    return {
        ...toHttpData,
        lastLoginDate: toHttpData.lastLoginDate == null ? null : moment (toHttpData.lastLoginDate).format('YYYY-MM-DDTHH:mm:ss'),
        dtAktualizace: toHttpData.dtAktualizace == null ? null : moment (toHttpData.dtAktualizace).format('YYYY-MM-DDTHH:mm:ss'),
        datumISImportu: toHttpData.datumISImportu == null ? null : moment (toHttpData.datumISImportu).format('YYYY-MM-DDTHH:mm:ss'),
        dtCreated: toHttpData.dtCreated == null ? null : moment (toHttpData.dtCreated).format('YYYY-MM-DDTHH:mm:ss'),
    };
};