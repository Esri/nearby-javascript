import { TopAppBarActionItem, TopAppBarRow, TopAppBarSection, TopAppBarTitle } from '@rmwc/top-app-bar';
import { Typography } from '@rmwc/typography';
import React, { useContext } from 'react';

import { AppContext } from '../contexts/App';

import { DirectionsResult } from '../interfaces/common';

const asTime = (time = 0) => time.toFixed(0);

const DirectionsSummary = () => {
    const { state, setState } = useContext(AppContext);
    const { currentRoute } = state;

    const clearRoute = async () => {
        const routing = await import('../data/routing');
        routing.clearDirections();
    };

    const onClose = () => {
        setState({ showDirections: false });
        clearRoute();
    };

    return (
        <TopAppBarRow>
            <TopAppBarSection alignStart>
                <TopAppBarActionItem
                    aria-label="Close Directions"
                    alt="Close Directions"
                    icon="close"
                    onClick={onClose}
                />
                <TopAppBarTitle>{(currentRoute as DirectionsResult).name}</TopAppBarTitle>
            </TopAppBarSection>
            <TopAppBarSection alignEnd>
                <TopAppBarActionItem aria-label="Walking Directions" alt="Walking Directions" icon="directions_walk" />
                <Typography use="caption">
                    {asTime((currentRoute as DirectionsResult).directions.totalTime)} min
                </Typography>
            </TopAppBarSection>
        </TopAppBarRow>
    );
};

export default DirectionsSummary;
