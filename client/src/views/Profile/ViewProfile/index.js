import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { ProfileSideNavigation, Status } from '../../../components';

const ViewProfile = (props) =>{

    return(
        <React.Fragment>
            
                <ProfileSideNavigation activeIndex={0}/>
                
        </React.Fragment>
    )

}

export default ViewProfile;