import { useMemo } from "react";

/**
 * Custom hook to filter apartments based on user selections
 * @param apartments - Array of apartment objects
 * @param selectedType - Selected type filter (lägenhet, lokal, or '')
 * @param selectedCity - Selected city filter (Kalmar, Nybro, or '')
 * @param filters - Object with price, rooms, floor, size filters
 * @returns Filtered array of apartments
 */
export const useFilteredApartments = (
  apartments,
  selectedType,
  selectedCity,
  filters
) => {
  return useMemo(() => {
    return apartments.filter((apt) => {
      // Type filter
      if (selectedType && apt.type !== selectedType) return false;

      // City filter
      if (selectedCity && apt.city !== selectedCity) return false;

      // Price filter (max price)
      if (filters.price && apt.price > parseInt(filters.price)) return false;

      // Rooms filter (exact match)
      if (filters.rooms && apt.rooms !== parseInt(filters.rooms)) return false;

      // Floor filter (exact match)
      if (filters.floor && apt.floor !== parseInt(filters.floor)) return false;

      // Size filter (minimum size)
      if (filters.size && apt.size < parseInt(filters.size)) return false;

      return true;
    });
  }, [apartments, selectedType, selectedCity, filters]);
};
