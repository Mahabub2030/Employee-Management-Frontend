import { baseApi } from "@/redux/baseApi";

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addEmployees: builder.mutation({
      query: (employeesData) => ({
        url: "/employees/create",
        method: "POST",
        data: employeesData,
      }),
      invalidatesTags: ["EMPLOYEES"],
    }),
    getEmployees: builder.query({
      query: (params) => ({
        url: "/employees/all-Employee",
        method: "GET",
        params,
      }),
      providesTags: ["EMPLOYEES"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useAddEmployeesMutation, useGetEmployeesQuery } = employeeApi;
