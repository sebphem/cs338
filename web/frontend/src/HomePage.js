import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import { useHistory } from 'react-router-dom';
import GetStartedForm from './RegistrationForm.js';
import RegistrationForm from './RegistrationForm.js';

export default function HomePage() {
    return (
        <div>
            <h1 className="text-center">Cupidity</h1>
            <p className="text-center">Where every swipe is right.</p>
            <SearchForm />
        </div>
    );
}
