export * from '../routing/RoutingTypes';
export * from './translations';
export * from './routes';

export interface TokenUserInfo {
    sub: string;
    email: string;
    name: string;
    rolename: string;
    claim_permission: number[];
    l: string;
}