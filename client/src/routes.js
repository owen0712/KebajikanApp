import React from 'react';
import Loadable from 'react-loadable'

function Loading() {
  return <div>Loading...</div>;
}

const Announcement = Loadable({
    loader: () => import('./views/Announcement'),
    loading: Loading,
});

const landingRoutes = [
    // { path: '/home', exact:true, name: 'Home', component: Dashboard },//entry components
    // { path: '/home/dashboard', exact:true, name: 'Dashboard', component: Dashboard },
    // { path: '/home/dashboard/details', exact:true, name:'Dashboard Details', component:DashboardDetails},
    // { path: '/home/dashboard/fdDetails', exact:true, name:'Dashboard FD Details', component:FDDashboardDetails}
]

const routes = 
    [...landingRoutes];

export default routes;