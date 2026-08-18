import { BACKEND_BASE_URL } from "@/constants";
import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { HttpError } from "@refinedev/core";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

if (!BACKEND_BASE_URL) {
  throw new Error("BACKEND_BASE_URL is not defined");
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = "Request failed.";

  try {
    const payload = (await response.json()) as { message?: string };

    if (payload?.message) message = payload?.message;
  } catch (error) {
    // Ignore errors
  }

  return {
    message,
    statusCode: response.status,
  };
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters, sorters }) => {
      const isPaginationOff = pagination?.mode === "off";
      const params: Record<string, string | number> = {};

      if (!isPaginationOff) {
        const page = pagination?.currentPage ?? 1;
        const pageSize = pagination?.pageSize ?? 10;
        params.page = page;
        params.limit = pageSize;
      }

      if (sorters?.length) {
        params.sort = sorters.map((s) => s.field).join(",");
        params.order = sorters.map((s) => s.order).join(",");
      }

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";

        const value = String(filter.value);

        if (resource === "subjects") {
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "classes") {
          if (field === "name") params.search = value;
          if (field === "subject") params.subject = value;
          if (field === "teacher") params.teacher = value;
        }

        if (resource === "users") {
          if (field === "role") params.role = value;
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();

      return json.data ?? [];
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();

      return json.data ?? {};
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };
