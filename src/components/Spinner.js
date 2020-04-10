import React from "react";

export class Spinner extends React.Component{
    render() {
        return(
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );
    }
}
//