import React, {Component} from 'react';
import Render from "../components/render";

class Index extends Component {
    render() {
        return (
            <div className="container">
                {/*<p className="ds-font">*/}
                {/*    Designer*/}
                {/*</p>*/}
                <Render className="full" editable={true} />
            </div>
        );
    }
}

export default Index;
