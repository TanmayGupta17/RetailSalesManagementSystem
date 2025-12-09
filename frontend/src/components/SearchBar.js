'use client';

import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch, initialValue = '' }) {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className={styles.searchBar}>
            <div className={styles.searchContainer}>
                <svg
                    className={styles.searchIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>

                <input
                    type="text"
                    placeholder="Search by Customer Name or Phone Number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />

                {searchTerm && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className={styles.clearButton}
                        aria-label="Clear search"
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}

                <button type="submit" className={styles.searchButton}>
                    Search
                </button>
            </div>
        </form>
    );
}
