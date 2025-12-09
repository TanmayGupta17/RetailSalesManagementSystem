'use client';

import styles from './SortDropdown.module.css';

export default function SortDropdown({ sortBy, sortOrder, onSortChange }) {
    const handleSortChange = (e) => {
        const [field, order] = e.target.value.split('-');
        onSortChange(field, order);
    };

    const currentValue = `${sortBy}-${sortOrder}`;

    return (
        <div className={styles.sortContainer}>
            <label htmlFor="sort-select" className={styles.label}>
                <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort by:
            </label>
            <select
                id="sort-select"
                value={currentValue}
                onChange={handleSortChange}
                className={styles.select}
            >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="quantity-desc">Quantity (High to Low)</option>
                <option value="quantity-asc">Quantity (Low to High)</option>
                <option value="customerName-asc">Customer Name (A-Z)</option>
                <option value="customerName-desc">Customer Name (Z-A)</option>
            </select>
        </div>
    );
}
