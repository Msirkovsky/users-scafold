import * as React from 'react';
import { Clearfix, Col, Row } from 'react-bootstrap';
import { UsersListStore } from './UsersListStore';
import { RouteId } from '../../routes';
import { Translations } from '../../basicTypes';
import { ColumnConfigurationType, DataTable, TextColumn } from 'saboteur-data-table';
import { getLinkColumn } from '../../../common/components/data-table';

const columns: ColumnConfigurationType[] = [
    {
        components: getLinkColumn(RouteId.UserDetail , 'id'),
        name: 'fullName',
        title: Translations.celeJmeno,
        width: 200
    } ,
    
    {
        components: TextColumn,
        name: 'email',
        title: Translations.email,
        width: 150,
    },
   
    {
        components: TextColumn,
        name: 'role',
        title: Translations.roles,
        width: 150,
    }

];

interface IUsersListProps {
    store: UsersListStore;
}

export const UsersList = ({ store: { getUserList, toNewUser} }: IUsersListProps ) => (
    <div>
        <h1>{Translations.usersList}</h1>
        <DataTable
            id="usersList"
            columns={columns}
            configuration={{ responsive: true, keyColumnName: 'id', maxRowHeight: 1000, pageSize: 15, newRecordFn: toNewUser }}
            fetchDataFunc={getUserList}
            initialSort={[{ column: 'fullName', sort: 'asc' }]}
            
        />
    </div>
);
