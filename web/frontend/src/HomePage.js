import React from 'react';
import SearchForm from './SearchForm';

export default function HomePage() {
    return (
        <div>
            <h1 class="text-center">UnIncognito</h1>
            <p class="text-center">Find who you're looking for.</p>
            <SearchForm />
        </div>
    );
}
