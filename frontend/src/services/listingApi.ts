import { baseApi } from "./baseApi";
import type { CreateListingPayload } from "../types/listing";

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
  }),
});

export const { useCreateListingMutation } = listingApi;
