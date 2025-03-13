import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import GetStartedForm from './RegistrationForm.js';
import RegistrationForm from './RegistrationForm.js';
import ConversationalInterface from './ConversationForm.js';

export default function HomePage() {
    return (
        <div>
            <h1 className="text-center">Cupidity</h1>
            <p className="text-center">Where every swipe is right.</p>
            <ConversationalInterface/>
        </div>
    );
}
