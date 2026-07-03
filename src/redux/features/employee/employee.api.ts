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
    getSingalEmployees: builder.query({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "GET",
      }),
      providesTags: ["EMPLOYEES"],
      transformResponse: (response) => response.data,
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employees/update/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "EMPLOYEES", id }],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EMPLOYEES"],
    }),
  }),
});

export const {
  useAddEmployeesMutation,
  useGetEmployeesQuery,
  useGetSingalEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
