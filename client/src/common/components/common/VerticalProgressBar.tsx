import * as React from 'react';

interface IVerticalProgressBarProps {
    percents: number;
    text?: string;
    backgroundColor?: any;
}

export const VerticalProgressBar = ({ percents, text, backgroundColor }: IVerticalProgressBarProps) => {
    return (
        <div className="progress progress-bar-vertical">
            <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={percents}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ height: `${percents}%`, backgroundColor: backgroundColor }}
            >
                <span>{text !== undefined ? text : percents.toFixed(1)}</span>
            </div>
        </div>
    );
};
