import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { SummarySchema ,errorResponse} from "../validator";

const authDocument: RouteConfig[] = [
    {
        method: "post",
        description:"Generate invoice from given data.",
        path: "/pdfgen",
        request: {
          body: {
            content: {
              "application/json": {
                schema: SummarySchema.openapi("UserAuth"),
              },
            },
          },
        },
        responses: {
          200: {
            description: "",
            content: {
              "application/json": {
                schema: SummarySchema.openapi("AuthResponse"),
              },
            },
          },
        },
      },
]
authDocument.forEach((x) => {
    x.tags = ["User"];
    x.responses = {
      ...x.responses,
      404: {
        description: "",
        content: {
          "application/json": {
            schema: errorResponse.openapi("ErrorResponse"),
          },
        },
      },
      400: {
        description: "",
        content: {
          "application/json": {
            schema: errorResponse.openapi("ErrorResponse"),
          },
        },
      },
      500: {
        description: "",
        content: {
          "application/json": {
            schema: errorResponse.openapi("ErrorResponse"),
          },
        },
      },
    };
  })