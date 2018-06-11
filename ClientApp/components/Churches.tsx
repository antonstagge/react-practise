import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import * as ChurchStore from '../store/ChurchList';
import { ApplicationState } from '../store';

type ChurchesProps = ChurchStore.ChurchState
    & typeof ChurchStore.actionCreators
    & RouteComponentProps<{}>;

class Churches extends React.Component<ChurchesProps, {}> {
    componentDidMount() {
        console.log("did mount");
        if (this.props.churches.length == 0) {
            this.props.fetchChurchesBegin();
            // do the fetch and then
            this.delay(1000).then(() => {
                this.props.fetchChurchesSuccess([]);
            });
        }
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    renderChurch(current: ChurchStore.Church) {
        return <li key={current.telephoneNr}>
            <ul>
                <li> name: {current.name} </li>
                <li> location: {current.location} </li>
                <li> phone#: {current.telephoneNr} </li>
            </ul>
        </li>
    }

    load() {
        if (this.props.loading) {
            return <div> loading... </div>
        } else {
            return <div></div>
        }
    }
    public render() {
        let load = this.load();
        let currentChurches = this.props.churches.map(this.renderChurch);
        return <div>
            <h1> testing </h1>
            {load}
            <ul>
                {currentChurches}
            </ul>
        </div>;
    }
}

// Wire up the React component to Redux
export default connect(
    (state: ApplicationState) => state.churches, // This is what part of the store is mapped to props
    ChurchStore.actionCreators
)(Churches) as typeof Churches;