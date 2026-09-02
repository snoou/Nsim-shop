import { apiSlice } from './apiSlice';
import { POSTERS_URL } from '../constants';

export const postersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosters: builder.query({
      query: () => ({
        url: POSTERS_URL,
      }),
      providesTags: ['Poster'],
      keepUnusedDataFor: 5,
    }),
    
    createPoster: builder.mutation({
      query: () => ({
        url: POSTERS_URL,
        method: 'POST',
      }),
      invalidatesTags: ['Poster'],
    }),

    updatePoster: builder.mutation({
      query: (data) => ({
        url: `${POSTERS_URL}/${data.posterId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Poster'],
    }),

    deletePoster: builder.mutation({
      query: (posterId) => ({
        url: `${POSTERS_URL}/${posterId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Poster'],
    }),
  }),
});

export const {
  useGetPostersQuery,
  useCreatePosterMutation,
  useUpdatePosterMutation,
  useDeletePosterMutation,
} = postersApiSlice;