'use client';

import { useState, useEffect, useCallback } from 'react';
import transactionAPI from '../services/api';

export default function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNext: false,
        hasPrev: false
    });

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        customerRegion: [],
        gender: [],
        ageMin: '',
        ageMax: '',
        productCategory: [],
        tags: [],
        paymentMethod: [],
        dateFrom: '',
        dateTo: ''
    });

    // Sort state
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    // Current page
    const [page, setPage] = useState(1);

    /**
     * Fetch transactions with current filters, sort, and pagination
     */
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = {
                ...filters,
                sortBy,
                sortOrder,
                page,
                limit: 10
            };

            const response = await transactionAPI.getTransactions(params);

            if (response.success) {
                setTransactions(response.data);
                setPagination(response.pagination);
            } else {
                throw new Error(response.message || 'Failed to fetch transactions');
            }
        } catch (err) {
            setError(err.message);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    }, [filters, sortBy, sortOrder, page]);

    /**
     * Update filters
     */
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPage(1); // Reset to first page when filters change
    }, []);

    /**
     * Update sort
     */
    const updateSort = useCallback((field, order = 'desc') => {
        setSortBy(field);
        setSortOrder(order);
        setPage(1); // Reset to first page when sort changes
    }, []);

    /**
     * Reset all filters
     */
    const resetFilters = useCallback(() => {
        setFilters({
            search: '',
            customerRegion: [],
            gender: [],
            ageMin: '',
            ageMax: '',
            productCategory: [],
            tags: [],
            paymentMethod: [],
            dateFrom: '',
            dateTo: ''
        });
        setPage(1);
    }, []);

    /**
     * Go to next page
     */
    const nextPage = useCallback(() => {
        if (pagination.hasNext) {
            setPage(prev => prev + 1);
        }
    }, [pagination.hasNext]);

    /**
     * Go to previous page
     */
    const prevPage = useCallback(() => {
        if (pagination.hasPrev) {
            setPage(prev => prev - 1);
        }
    }, [pagination.hasPrev]);

    /**
     * Go to specific page
     */
    const goToPage = useCallback((pageNum) => {
        if (pageNum >= 1 && pageNum <= pagination.totalPages) {
            setPage(pageNum);
        }
    }, [pagination.totalPages]);

    // Fetch transactions when dependencies change
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        pagination,
        filters,
        sortBy,
        sortOrder,
        updateFilters,
        updateSort,
        resetFilters,
        nextPage,
        prevPage,
        goToPage,
        refetch: fetchTransactions
    };
}
