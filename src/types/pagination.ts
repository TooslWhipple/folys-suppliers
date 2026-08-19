/**
 * Shape of every paginated list served by the supplier portal API.
 * Declared once here: the services import it instead of redeclaring it.
 */
export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
