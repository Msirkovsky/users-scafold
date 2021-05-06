import * as React from 'react';

interface IDividerProps {
  className?: string;
}
export class Divider extends React.Component<IDividerProps, {}> {
  render() {
    let { 
      className = 'mad-margin-y-2x'
    } = this.props;
    
    className += ' mad-divider';

    return(
      <div className={className} />
    );
  }
}