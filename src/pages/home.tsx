import React, { lazy } from 'react';
import Layout from '../components/Layout';

// lazy load the core components
const NearbyPlaces = lazy(() => import('../components/NearbyPlaces'));
const WebMapView = lazy(() => import('../components/WebMapView'));
const Home = () => (
    <Layout>
        <NearbyPlaces />
        <WebMapView />
    </Layout>
);

export default Home;
