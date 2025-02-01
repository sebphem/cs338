import React, { useState, useEffect } from 'react';
// import SearchForm from './SearchForm';
import { fetchDataFromServer } from './apiService';

export default function HomePage() {
    // return (
    //     <div>
    //         <h1 class="text-center">UnIncognito</h1>
    //         <p class="text-center">Find who you're looking for.</p>
    //         <SearchForm />
    //     </div>
    // );
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        fetchDataFromServer()
            .then(data => {
                setProfileData(data);
                console.log("data fetched: ", data);
            })
            .catch(error => {
                console.error('Failed to fetch data:', error);
                setProfileData(null); // Optionally manage an error state
            });
    }, []);

    const renderImageBase64 = (base64String) => {
        return `data:image/jpeg;base64,${base64String}`
    }

    return (
        <div>
            <h1>Profile Data</h1>
            <div>
                {profileData ? profileData.sections.map((section, index) => (
                    <div key={index}>
                        <p>{section.text}</p>
                        <img src={renderImageBase64(section.image)} alt="Profile" style={{ width: '100px', height: 'auto' }} />
                    </div>
                )) : 'Loading...'}
            </div>
        </div>
    );
}
