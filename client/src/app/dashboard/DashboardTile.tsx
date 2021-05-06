import * as React from 'react';

interface IDashboardTileProps {
    title: string;
    onClick: () => void;
    cssClass: string;
}

export const DashboardTile = ({ title, onClick, cssClass}: IDashboardTileProps) => (
    <div className="dashboard-tile-wrapper" onClick={onClick}>
    <div
        className={cssClass}        
    />       
    
    <div className="dashboard-tile-title">{title}</div>
    </div>    
);
