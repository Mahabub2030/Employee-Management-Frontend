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
    getAllEmployees: builder.query({
      query: (params) => ({
        url: "/employees/all-Employee",
        method: "GET",
        params: params,
      }),
      providesTags: ["EMPLOYEES"],
      transformResponse: (response) => response.data,
    }),
    // getSingalEmployees: builder.query({
    //   query: ({ id }) => ({
    //     url: `/employees/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["EMPLOYEES"],
    //   transformResponse: (response) => response.data,
    // }),
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employees/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "EMPLOYEES", id }],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["EMPLOYEES"],
    }),
  }),
});

export const {
  useAddEmployeesMutation,
  useGetAllEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi;
