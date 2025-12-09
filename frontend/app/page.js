'use client';

import useTransactions from '../src/hooks/useTransactions';
import SearchBar from '../src/components/SearchBar';
import FilterPanel from '../src/components/FilterPanel';
import SortDropdown from '../src/components/SortDropdown';
import TransactionTable from '../src/components/TransactionTable';
import Pagination from '../src/components/Pagination';
import styles from './page.module.css';

export default function Dashboard() {
  const {
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
    goToPage
  } = useTransactions();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              <span className={styles.titleIcon}>📊</span>
              Sales Management System
            </h1>
            <p className={styles.subtitle}>
              Track and analyze retail transactions with advanced filtering
            </p>
          </div>

          <div className={styles.statsSection}>
            <div className={styles.stat}>
              <div className={styles.statValue}>{pagination.totalItems}</div>
              <div className={styles.statLabel}>Total Transactions</div>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.searchSection}>
          <SearchBar
            onSearch={(search) => updateFilters({ search })}
            initialValue={filters.search}
          />
        </div>

        <FilterPanel
          filters={filters}
          onFilterChange={updateFilters}
          onReset={resetFilters}
        />

        <div className={styles.toolbar}>
          <SortDropdown
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={updateSort}
          />

          <div className={styles.resultsInfo}>
            {!loading && (
              <span className={styles.resultsText}>
                {pagination.totalItems} {pagination.totalItems === 1 ? 'result' : 'results'} found
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <TransactionTable
          transactions={transactions}
          loading={loading}
        />

        <Pagination
          pagination={pagination}
          onPrevious={prevPage}
          onNext={nextPage}
          onGoToPage={goToPage}
        />
      </main>

      <footer className={styles.footer}>
        <p>© 2025 Retail Sales Management System</p>
      </footer>
    </div>
  );
}
//             Deploy Now
//           </a >
//   <a
//     className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//     href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//     target="_blank"
//     rel="noopener noreferrer"
//   >
//     Documentation
//   </a>
//         </div >
//       </main >
//     </div >
//   );
// }
