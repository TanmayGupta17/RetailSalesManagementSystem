'use client';

import styles from './Pagination.module.css';

export default function Pagination({ pagination, onPrevious, onNext, onGoToPage }) {
    const { currentPage, totalPages, totalItems, itemsPerPage, hasNext, hasPrev } = pagination;

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages === 0) {
        return null;
    }

    return (
        <div className={styles.pagination}>
            <div className={styles.info}>
                Showing <span className={styles.highlight}>{startItem}</span> to{' '}
                <span className={styles.highlight}>{endItem}</span> of{' '}
                <span className={styles.highlight}>{totalItems}</span> transactions
            </div>

            <div className={styles.controls}>
                <button
                    onClick={onPrevious}
                    disabled={!hasPrev}
                    className={`${styles.button} ${styles.navButton}`}
                    aria-label="Previous page"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                <div className={styles.pageNumbers}>
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' && onGoToPage(page)}
                            disabled={page === '...' || page === currentPage}
                            className={`${styles.pageButton} ${page === currentPage ? styles.active : ''} ${page === '...' ? styles.ellipsis : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={`${styles.button} ${styles.navButton}`}
                    aria-label="Next page"
                >
                    Next
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
