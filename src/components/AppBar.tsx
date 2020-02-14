import { TopAppBarActionItem, TopAppBarRow, TopAppBarSection, TopAppBarTitle } from '@rmwc/top-app-bar';
import React, { useContext } from 'react';

import { AppContext } from '../contexts/App';
import { Authentication } from './Authentication';
import DirectionsSummary from './DirectionsSummary';
import { NavToList, NavToMap } from './Nav';
import TopAppBarContainer from './styled/TopAppBarContainer';

const navs = (mode: string) => {
    const nav: JSX.Element | [] = mode === 'map' ? <NavToList icon={'navigate_before'} /> : [];
    const mapOrList = mode === 'list' ? <NavToMap /> : <NavToList icon={'format_list_bulleted'} />;

    return [nav, mapOrList];
};

const AppBar = () => {
    const { state, setState } = useContext(AppContext);
    const { mode } = state;
    const [nav, mapOrList] = mode === 'normal' ? [null, null] : navs(mode);

    const toggleFilter = () => {
        setState({
            showFilter: !state.showFilter,
        });
    };

    const content = state.showDirections ? (
        <DirectionsSummary />
    ) : (
        <TopAppBarRow>
            <TopAppBarSection alignStart>
                {nav}
                <TopAppBarTitle>Nearby Places</TopAppBarTitle>
            </TopAppBarSection>
            <TopAppBarSection alignEnd>
                <Authentication />
                <TopAppBarActionItem aria-label="Filter" alt="Filter" icon="filter_list" onClick={toggleFilter} />
                {mapOrList}
            </TopAppBarSection>
        </TopAppBarRow>
    );

    return <TopAppBarContainer mode={mode}>{content}</TopAppBarContainer>;
};

export default AppBar;
