import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../config/constants';

const ITEMS_PER_PAGE = 10;

const usePaginatedAsyncStorage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () =>  {
    setLoading(true);
    try {
      const storedData = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.LOCATIONS);
      if (storedData !== null) {
        // Parse the full array
        const fullArray = JSON.parse(storedData); 
        
        // Calculate pagination parameters
        const totalItems = fullArray.length;
        const pages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        setTotalPages(pages);

        // Slice the array for the current page
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentPageData = fullArray.slice(startIndex, endIndex);

        setPaginatedData(currentPageData);
      }
    } catch (e) {
      console.error('Error fetching paginated data:', e);
    } finally {
        setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    
        const fetchMoreData = async () => {
            await fetchData()
        }

        fetchMoreData()

  }, [currentPage, fetchData]); 

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return { paginatedData, currentPage, totalPages, loading, nextPage, prevPage };
};

export default usePaginatedAsyncStorage;
