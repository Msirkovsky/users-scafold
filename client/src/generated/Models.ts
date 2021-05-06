// generated file. DO NOT EDIT!!!!
export interface AktivityResponse {
    aktivity: AktivitaVM[];
}
export interface AktivitaVM {
    id: string;
    typId: number;
    datum: Date;
    firmaId: string;
    poznamka: string;
    statusId: number;
    typNazev: string;
    firmaNazev: string;
    userName: string;
    statusNazev: string;
}
export interface SaveResult {
    isOk: boolean;
    createdEntityId: string;
    errors: string[];
}
export interface FirmaResponse {
    data: FirmaVM;
    dataSources: FirmaResponseDataSources;
}
export interface FirmaVM {
    id: string;
    ic: string;
    dic: string;
    nazev: string;
    formaId: number;
    splatnost: number;
    zakazkaId: number;
    strediskoId: number;
    cinnostId: number;
    zprava: string;
    p1: boolean;
    p2: boolean;
    p3: boolean;
    p4: boolean;
    p5: boolean;
    p6: boolean;
    buCislo: string;
    buKod: string;
    adresy: AdresaVM[];
    kontakty: KontaktVM[];
    zakazkaNazev: string;
}
export interface FirmaResponseDataSources {
    cinnost: Cinnost[];
    stredisko: Stredisko[];
    forma: Forma[];
    zakazka: Zakazka[];
}
export interface AdresaVM {
    id: string;
    ulice: string;
    obec: string;
    kraj: string;
    statId: number;
    psc: string;
    typ: number;
}
export interface KontaktVM {
    telefon: string;
    mobile: string;
    web: string;
    email: string;
    fax: string;
    jmeno: string;
}
export interface Cinnost {
    id: number;
    nazev: string;
    popis: string;
}
export interface Stredisko {
    id: number;
    nazev: string;
    popis: string;
}
export interface Forma {
    id: number;
    nazev: string;
    popis: string;
    typFormyUhradyId: number;
}
export interface Zakazka {
    id: number;
    nazev: string;
    popis: string;
}
export interface ChangePasswordModel {
    email: string;
}
export interface NotificationForUser {
    information: string;
    task: string;
    taskModal: string;
}
export interface SendMessageRequest {
    message: string;
}
export interface NotificationRequest {
    data: string;
    message: string;
}
export interface ObchodniZastupceDetail {
    obchodniZastupce: ObchodniZastupceVM;
    dataSource: ObchodniZastupceDataSource;
}
export interface ObchodniZastupceVM {
    id: string;
    strediskoId: number;
    userId: string;
}
export interface ObchodniZastupceDataSource {
    users: NameAndId[];
    strediska: NameAndIdInt[];
}
export interface NameAndId {
    name: string;
    id: string;
}
export interface NameAndIdInt {
    name: string;
    id: number;
}
export interface RequestChangePasswordInput {
    email: string;
}
export interface ConfirmChangePasswordInput {
    userRequestChangePasswordId: string;
    newPassword: string;
}
export interface Role {
    id: number;
    name: string;
    caption: string;
    homePageRoute: string;
    priority: number;
}
export interface LoginViewModel {
    userName: string;
    password: string;
}
export interface UserView {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    login: string;
    passHash: string;
    email: string;
    telephone: string;
    isActive: boolean;
    lastLoginDate: Date;
    dtAktualizace: Date;
    datumISImportu: Date;
    role: string;
    rowVersion: string;
    isDeleted: boolean;
    dtCreated: Date;
    authorId: string;
}
export interface UserEditModel {
    entity: UserModel;
    datasource: DetailUserDatasource;
    canEdit: boolean;
}
export interface UserModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    isActive: boolean;
    lastLoginDateStr: string;
    position: string;
    company: string;
    roles: number[];
    concPlantIds: string[];
    prodLocalities: string[];
}
export interface DetailUserDatasource {
    canEdit: boolean;
    roles: Role[];
}
export interface ActualUserInfo {
    fullName: string;
    email: string;
}
export interface ChangePasswordByAdmin {
    userId: string;
}
export interface RegisterRequest {
    email: string;
    typ: number;
}
export interface User {
    id: string;
    fullName: string;
    firstName: string;
    lastName: string;
    passHash: string;
    email: string;
    telephone: string;
    isActive: boolean;
    lastLoginDate: Date;
    dtAktualizace: Date;
    datumISImportu: Date;
    language: string;
    position: string;
    company: string;
    rowVersion: string;
    isDeleted: boolean;
    dtCreated: Date;
    authorId: string;
}