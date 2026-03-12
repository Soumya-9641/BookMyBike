import { baseApi } from "./baseApi";
import type { Bike, CreateListingPayload, GetAllBikesResponse } from "../types/listing";
export interface SearchPayload {
  lat: number;
  lng: number;
  startDate: string;
  endDate: string;
}

export interface SearchResponse {
  count: number;
  bikes: any[];
}
export const listingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createListing: builder.mutation<any, CreateListingPayload>({
      query: (data) => {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("brand", data.brand);
        formData.append("modelbike", data.modelbike);
        formData.append("size", data.size);
        formData.append("category", data.category);
        formData.append("depositAmount", String(data.depositAmount));

        formData.append("accessories", JSON.stringify(data.accessories));
        formData.append("rates", JSON.stringify(data.rates));
        formData.append("location", JSON.stringify(data.location));

        data.photos.forEach((file) => {
          formData.append("photos", file);
        });

        return {
          url: "/bike/listing/listnewbike",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Listing"],
    }),
    getAllBikes: builder.query<GetAllBikesResponse, void>({
      query: () => ({
        url: "/bike/listing/getall",
        method: "POST",
      }),
      providesTags: ["Listing"],
    }),

    filterBikes: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/bike/listing/filter",
        method: "POST",
        body: payload,
      }),
    }),
    getHomeBikes: builder.query<
      { count: number; bikes: any[] },
      void
    >({
      query: () => "/bike/listing/bikes/home",
      providesTags: ["Listing"],
    }),
    getBikeById: builder.query<Bike, string>({
      query: (id) => `/bike/listing/${id}`,
    }),
    searchBikes: builder.mutation<SearchResponse, SearchPayload>({
      query: (body) => ({
        url: "/bike/listing/search",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCreateListingMutation, useGetAllBikesQuery,
  useFilterBikesMutation, useGetHomeBikesQuery, useGetBikeByIdQuery,useSearchBikesMutation  } = listingApi;
