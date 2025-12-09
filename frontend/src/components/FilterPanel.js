'use client';

import { useState, useEffect } from 'react';
import transactionAPI from '../services/api';
import styles from './FilterPanel.module.css';

export default function FilterPanel({ filters, onFilterChange, onReset }) {
    const [filterOptions, setFilterOptions] = useState({
        customerRegions: [],
        genders: [],
        productCategories: [],
        tags: [],
        paymentMethods: []
    });
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        fetchFilterOptions();
    }, []);

    const fetchFilterOptions = async () => {
        try {
            const response = await transactionAPI.getFilterOptions();
            if (response.success) {
                setFilterOptions(response.data);
            }
        } catch (error) {
            console.error('Error fetching filter options:', error);
        }
    };

    const handleMultiSelect = (filterName, value) => {
        const currentValues = filters[filterName] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        onFilterChange({ [filterName]: newValues });
    };

    const handleInputChange = (filterName, value) => {
        onFilterChange({ [filterName]: value });
    };

    const activeFiltersCount = Object.values(filters).filter(v =>
        (Array.isArray(v) && v.length > 0) || (v && !Array.isArray(v))
    ).length;

    return (
        <div className={styles.filterPanel}>
            <div className={styles.filterHeader}>
                <div className={styles.filterTitle}>
                    <svg className={styles.filterIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <h3>Filters {activeFiltersCount > 0 && <span className={styles.badge}>{activeFiltersCount}</span>}</h3>
                </div>
                <div className={styles.filterActions}>
                    <button onClick={onReset} className={styles.resetButton}>
                        Clear All
                    </button>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={styles.toggleButton}
                        aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
                    >
                        <svg className={`${styles.chevron} ${isExpanded ? styles.rotated : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className={styles.filterContent}>
                    {/* Customer Region */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Customer Region</label>
                        <div className={styles.checkboxGroup}>
                            {filterOptions.customerRegions.map(region => (
                                <label key={region} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={filters.customerRegion?.includes(region)}
                                        onChange={() => handleMultiSelect('customerRegion', region)}
                                        className={styles.checkbox}
                                    />
                                    <span>{region}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Gender</label>
                        <div className={styles.checkboxGroup}>
                            {filterOptions.genders.map(gender => (
                                <label key={gender} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={filters.gender?.includes(gender)}
                                        onChange={() => handleMultiSelect('gender', gender)}
                                        className={styles.checkbox}
                                    />
                                    <span>{gender}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Age Range */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Age Range</label>
                        <div className={styles.rangeInputs}>
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.ageMin || ''}
                                onChange={(e) => handleInputChange('ageMin', e.target.value)}
                                className={styles.rangeInput}
                                min="0"
                            />
                            <span className={styles.rangeSeparator}>to</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.ageMax || ''}
                                onChange={(e) => handleInputChange('ageMax', e.target.value)}
                                className={styles.rangeInput}
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Product Category */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Product Category</label>
                        <div className={styles.checkboxGroup}>
                            {filterOptions.productCategories.map(category => (
                                <label key={category} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={filters.productCategory?.includes(category)}
                                        onChange={() => handleMultiSelect('productCategory', category)}
                                        className={styles.checkbox}
                                    />
                                    <span>{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Payment Method</label>
                        <div className={styles.checkboxGroup}>
                            {filterOptions.paymentMethods.map(method => (
                                <label key={method} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={filters.paymentMethod?.includes(method)}
                                        onChange={() => handleMultiSelect('paymentMethod', method)}
                                        className={styles.checkbox}
                                    />
                                    <span>{method}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Date Range</label>
                        <div className={styles.dateInputs}>
                            <input
                                type="date"
                                value={filters.dateFrom || ''}
                                onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                                className={styles.dateInput}
                            />
                            <span className={styles.rangeSeparator}>to</span>
                            <input
                                type="date"
                                value={filters.dateTo || ''}
                                onChange={(e) => handleInputChange('dateTo', e.target.value)}
                                className={styles.dateInput}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
