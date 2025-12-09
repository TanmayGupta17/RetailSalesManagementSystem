'use client';

import styles from './TransactionTable.module.css';

export default function TransactionTable({ transactions, loading }) {
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading transactions...</p>
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className={styles.emptyState}>
                <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3>No transactions found</h3>
                <p>Try adjusting your filters or search criteria</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>Phone Number</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Product Category</th>
                            <th>Quantity</th>
                            <th>Total Amount</th>
                            <th>Customer Region</th>
                            <th>Product ID</th>
                            <th>Employee Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id}>
                                <td className={styles.transactionId}>{transaction.transactionID}</td>
                                <td>{formatDate(transaction.date)}</td>
                                <td>{transaction.customerID}</td>
                                <td className={styles.customerName}>{transaction.customerName}</td>
                                <td>{transaction.phoneNumber}</td>
                                <td>
                                    {transaction.gender ? (
                                        <span className={`${styles.badge} ${styles[transaction.gender.toLowerCase()]}`}>
                                            {transaction.gender}
                                        </span>
                                    ) : (
                                        <span className={styles.badge}>N/A</span>
                                    )}
                                </td>
                                <td>{transaction.age}</td>
                                <td>
                                    <span className={styles.categoryBadge}>
                                        {transaction.productCategory}
                                    </span>
                                </td>
                                <td className={styles.quantity}>{transaction.quantity}</td>
                                <td className={styles.amount}>{formatCurrency(transaction.finalAmount)}</td>
                                <td>{transaction.customerRegion}</td>
                                <td>{transaction.productID}</td>
                                <td>{transaction.employeeName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
