import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// import SearchForm from './SearchForm';
import { fetchDataFromServer } from './apiService';
import profileimg from './profile-default-male-nyg4vc4i3m1d5pote7rfsv4o4c7p5ka5an0pselxcc-nyhjt6b1oifa23xq2ehfxoh9vink6vuxyns1y35vkc.png'

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ResultsPage() {
    const [profileData, setProfileData] = useState([]);
    const query = useQuery();
    const firstName = query.get('firstName');
    const lastName = query.get('lastName');

    useEffect(() => {
        if (firstName && lastName) {
            fetchDataFromServer(lastName, firstName)
                .then(data => {
                    setProfileData(data.matches);
                    console.log("data fetched: ", data);
                })
                .catch(error => {
                    console.error('Failed to fetch data:', error);
                    setProfileData([]); // Manage error state
                });
        }
    }, [firstName, lastName]);

    // const renderImageBase64 = (base64String) => {
    //     return `data:image/jpeg;base64,${base64String}`
    // };

    return (
        <div>
            <h1 className="text-center">Profile Data</h1>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-8 offset-md-2">
                        {profileData.length > 0 ? profileData.map((profile, index) => (
                            <div key={index} className="card mb-3"> {/* Add mb-3 for spacing between cards */}
                                <div className="card-header text-white bg-primary">
                                    <h2 className="card-title">{profile.FIRST} {profile.LAST}</h2>
                                </div>
                                <div className="row no-gutters">
                                    <div className="col-md-4">
                                        <img src={profileimg} alt="Profile" className="img-fluid"/>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <p className="card-text"><strong>Birth Date:</strong> {profile["BIRTH DATE"]}</p>
                                            <p className="card-text"><strong>Gender:</strong> {profile.GENDER}</p>
                                            {/* <p className="card-text"><strong>Race:</strong> {profile.RACE}</p> */}
                                            <p className="card-text"><strong>Height:</strong> {profile.HEIGHT}</p>
                                            <p className="card-text"><strong>Weight:</strong> {profile.WEIGHT}</p>
                                            {/* <p className="card-text"><strong>Block:</strong> {profile.BLOCK}</p> */}
                                        </div>
                                    </div>
                                </div>
                                {/* DUMMY Profile Summary Section */}
                                <div className="card-footer bg-light">
                                    <p className="text-muted">
                                        Summary: Glynn Williams is an enthusiastic software developer known for his expertise in AI and his advocacy for transparency in technology. His interests in digital ethics and technology innovations make him a prominent figure in tech community discussions.
                                        <br/><br/>
                                        <strong>Note:</strong> Mr. Williams has a criminal record for an offense involving a minor. This information is provided for transparency and safety concerns.
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="alert alert-warning" role="alert">
                                No profiles found. Please check the names and try again.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}