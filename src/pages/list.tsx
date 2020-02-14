import { RouteComponentProps } from '@reach/router';
import React, { lazy } from 'react';

// lazy load the core components
const NearbyPlaces = lazy(() => import('../components/NearbyPlaces'));
const Home = (props: RouteComponentProps) => <NearbyPlaces />;

export default Home;
