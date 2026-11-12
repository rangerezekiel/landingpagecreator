'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/use-debounce"; 
import { ApiResponseIndex, FetchApiResponse, PaginationMeta } from "@/app/_types/fetch";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import clsx from "clsx";

type DataTableHeader<T> = {
  value: string | keyof T;
  label?: string; 
  isSort: boolean;
  thClass?: string | null;
};

type DataTableCellRenderer<T> = {
  tdClass?: string | null;
  html: (item: T) => React.ReactNode;
};

interface DataTableProps<T extends { id?: number | string }> {
  headers: DataTableHeader<T>[];
  dataCells: DataTableCellRenderer<T>[];
  fetchDataService: (queryParams: string) => Promise<FetchApiResponse<ApiResponseIndex<T>>>;
  elementRight?: React.ReactNode;
  showTrashOption?: boolean;
  showUnreadOption?: boolean;
  initialPerPage?: number;
  showPerPageOptions?: number[];
  searchPlaceholder?: string;
  defaultSortBy?: string;
  defaultSortDirection?: 'asc' | 'desc';
  refreshTriger?: number;
  showNumber?: boolean;
}

export default function DataTable<T extends { id?: number | string }>({
  headers,
  dataCells,
  fetchDataService,
  elementRight,
  showTrashOption = false,
  showUnreadOption = false,
  initialPerPage = 10,
  showPerPageOptions = [5, 10, 50, 100],
  searchPlaceholder = "Search...",
  defaultSortBy = "id",
  defaultSortDirection = "asc",
  refreshTriger = 0,
  showNumber = false
}: DataTableProps<T>) {
  
  const [perPage, setPerPage] = useState(initialPerPage);
  const [page, setPage] = useState(1);
  const [orderBy, setOrderBy] = useState(defaultSortBy);
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [withTrashed, setWithTrashed] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearchTerm = useDebounce(search, 800);
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  // Handle URL hash for auto-checklist unread
  useEffect(() => {
    if (showUnreadOption) {
      const hash = window.location.hash;
      if (hash === '#unread') {
        setShowUnreadOnly(true);
      }
    }
  }, [showUnreadOption]);

  const handleSort = (columnValue: string, isSortable: boolean) => {
    if (!isSortable) return;

    if (orderBy === columnValue) {
      setOrderDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(columnValue);
      setOrderDirection('asc');
    }
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('perPage', perPage.toString());

    if (debouncedSearchTerm) {
      params.append('search', debouncedSearchTerm);
      params.append('page', "1");
    }

    if (orderBy) {
      params.append('sortBy', orderBy);
    }

    if (orderDirection) {
      params.append('sortOrder', orderDirection);
    }

    if (withTrashed && showTrashOption) {
      params.append('withTrashed', 'true');
    }

    if (showUnreadOnly && showUnreadOption) {
      params.append('unreadOnly', 'true');
    }

    return params.toString();
  };

  const query = `?${buildQueryParams()}`;

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const res = await fetchDataService(query);
        if (res.status === 200 && res.data) {
          setData(res.data.data || []);
          setMeta(res.data.meta || null);
        } else {
          setData([]);
          setMeta(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData([]);
        setMeta(null);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [query, fetchDataService, refreshTriger]);

  const calculatePaginationRange = () => {
    if (!meta) {
      return { from: 0, to: 0, total: 0 };
    }
    const currentPage = meta?.currentPage ?? 1
    const perPage = meta?.perPage ?? 10
    const total = meta?.total ?? 0

    const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1
    const to = from + data.length - 1

    return { from, to, total };
  };

  const { from, to, total } = calculatePaginationRange();

  const handlePageChange = (newPage: number) => {
    if (meta && newPage >= 1 && newPage <= meta.lastPage) {
      setPage(newPage);
    }
  };

  const renderPaginationItems = () => {
    if (!meta) return null;
    const pages = [];
    const { currentPage, lastPage } = meta;
    
    if(lastPage === 1 && total <= perPage) return null;

    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow && lastPage > maxPagesToShow) {
      startPage = Math.max(1, lastPage - maxPagesToShow + 1);
    }

    pages.push(
      <PaginationItem key="previous" className={(currentPage === 1 || isLoading) ? 'hidden' : ''}>
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
        />
      </PaginationItem>
    );

    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        pages.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      }
      pages.push(
        <PaginationItem key={lastPage}>
          <PaginationLink onClick={() => handlePageChange(lastPage)} isActive={currentPage === lastPage}>{lastPage}</PaginationLink>
        </PaginationItem>
      );
    }

    pages.push(
        <PaginationItem key="next" className={(currentPage === lastPage || isLoading) ? 'hidden' : ''}>
        <PaginationNext
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </PaginationItem>
    );

    return pages;
  };

  return (
    <>
      <section className="mt-5">
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 my-4">
          <div className="flex gap-3 items-center">
            <div className="flex gap-2 items-center">
              <b className="shrink whitespace-nowrap">Show</b>
              <Select defaultValue={perPage.toString()} onValueChange={(value) => {
                setPerPage(Number(value));
                setPage(1);
              }}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="Show" />
                </SelectTrigger>
                <SelectContent>
                  {showPerPageOptions.map((item, index) => (
                    <SelectItem key={index} value={item.toString()}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-zinc-400">|</span>
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            {elementRight}
          </div>
        </div>
        <div className="p-3 border rounded-lg border-zinc-100 dark:border-zinc-800">
          <div className="text-sm flex flex-col sm:flex-row sm:items-center text-center lg:text-start sm:gap-4 gap-2">
              {showTrashOption && (
                <div className="flex items-center space-x-2">
                  <Switch id="show-trash" checked={withTrashed} onCheckedChange={setWithTrashed} />
                  <Label htmlFor="show-trash" className="cursor-pointer">
                    Show trash <span className="text-zinc-400">|</span>
                  </Label>
                </div>
              )}
              {showUnreadOption && (
                <div className="flex items-center space-x-2">
                  <Switch id="show-unread" checked={showUnreadOnly} onCheckedChange={setShowUnreadOnly} />
                  <Label htmlFor="show-unread" className="cursor-pointer">
                    Unread only <span className="text-zinc-400">|</span>
                  </Label>
                </div>
              )}
              <span>
                Showing <b>{meta ? from : 0}</b> to <b>{meta ? to : 0}</b> of <b>{meta ? total : 0}</b> results
              </span>
            </div>

            <Pagination className="flex justify-center sm:justify-end">
              <PaginationContent>
                {renderPaginationItems()}
              </PaginationContent>
            </Pagination>
          </div>
          <Table>
            <TableHeader className="bg-zinc-100 dark:bg-zinc-900">
              <TableRow>
                {showNumber && (
                  <TableHead
                    key="number-row"
                  >
                    No.
                  </TableHead>
                )}
                {headers.map((header, index) => (
                  <TableHead
                    key={index}
                    className={`${header.thClass} ${header.isSort ? 'cursor-pointer' : ''}`}
                    onClick={() => handleSort(header.value as string, header.isSort)}
                  >
                    <span className="flex justify-between items-center">
                      {header.label as string}
                      {header.isSort && (
                        orderBy === header.value ? (
                          orderDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                        )
                      )}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={headers.length + (showNumber ? 1 : 0)} className="text-center py-4">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading data...</span>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center" colSpan={headers.length}>
                    No data found{" "}
                    {debouncedSearchTerm ? (
                      <>
                        for <b>&quot;{debouncedSearchTerm}&quot;</b>
                      </>
                    ) : (
                      ""
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item: T, index: number) => (
                  <TableRow
                    key={`data-cell-${item.id || index}`}
                    className={clsx(
                      // Zebra striping + dark mode
                      "odd:bg-white even:bg-gray-50 dark:odd:bg-neutral-900 dark:even:bg-neutral-800",
                      // Hover highlight
                      "hover:bg-muted/40 dark:hover:bg-muted/30 transition-colors",
                      // Kondisi jika deletedAt ada
                      {
                        "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400":
                          "deletedAt" in item &&
                          Boolean((item as { deletedAt?: string | null }).deletedAt),
                      }
                    )}
                  >
                    {showNumber && (
                      <TableCell key={`number-${item.id || index}`}>
                        {from + index}
                      </TableCell>
                    )}
                    {dataCells.map((field, fieldIndex) => (
                      <TableCell key={fieldIndex} className={field.tdClass || ""}>
                        {field.html && field.html(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
          <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4">
        </div>

      </section>
    </>
  );
}