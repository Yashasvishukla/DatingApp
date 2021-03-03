export interface Pagination {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    result: T;
    pagination: Pagination;
}
