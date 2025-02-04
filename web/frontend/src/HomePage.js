import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';
import { useHistory } from 'react-router-dom';

export default function HomePage() {
    return (
        <div>
            <h1 class="text-center">UnIncognito</h1>
            <p class="text-center">Find who you're looking for.</p>
            <SearchForm />
        </div>
    );
}
