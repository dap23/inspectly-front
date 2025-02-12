export type ImageType = {
  ID: number;
  title: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Pagination = {
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export type ApiResponse = {
  data: ImageType[];
  pagination: Pagination;
}