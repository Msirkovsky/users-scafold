import * as React from 'react';
import { Link } from '../../../routing/components/Link';
import { Button, Glyphicon, InputGroup, FormControl } from 'react-bootstrap';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import { RouteId } from '../../../app/routes';
import { TextFilterCell } from 'saboteur-data-table';

interface ILinkCellProps {
    row: any;
    idColumnName: string;
    routeId: RouteId;
    columnName: string;
    routeParamName: string;
}

export const LinkCell = ({ row, idColumnName, routeId, columnName, routeParamName }: ILinkCellProps) => {
    const cellIdValue = row[idColumnName];
    const cellStringValue = row[columnName];
    const params = {};
    params[routeParamName] = cellIdValue;
    if (cellIdValue == null) {
        return <span>{cellStringValue}</span>;
    } else {
        return <Link routeId={routeId} params={params}>{cellStringValue}</Link>;
    }
};

export const getLinkColumn = (routeId: RouteId, idColumnName: string, routeParamName: string = 'id') => {
    const link = ({ row, columnName }: { row: any, columnName: string }) => {
        return <LinkCell row={row} idColumnName={idColumnName} routeId={routeId} columnName={columnName} routeParamName={routeParamName} />;
    };
    return { cellComponent: link, filterComponent: TextFilterCell };
};
