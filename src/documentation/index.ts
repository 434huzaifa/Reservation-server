import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { SummarySchema, errorResponse } from "../validator";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";
const registry = new OpenAPIRegistry();
const InvoiceDoc: RouteConfig[] = [
  {
    method: "post",
    description: "Generate invoice from given data.",
    path: "/pdfgen",
    request: {
      body: {
        content: {
          "application/json": {
            schema: SummarySchema.openapi("PDFSChema"),
            example: {
              personalInfo: {
                FirstName: "Md",
                LastName: "huzaifa",
                email: "ssd24@gmail.com",
                phoneNumber: 234234234234,
              },
              carInfo: {
                id: "car_004",
                type: "SUV",
                make: "Chevrolet",
                model: "Tahoe",
                year: 2022,
              },
              reservationId: "asasd",
              pickupdate: "06/29/2024 01:00 AM",
              returndate: "06/30/2024 01:09 AM",
              summary: [
                {
                  Charge: "Daily",
                  Rate: 100,
                  Unit: 1,
                  Total: 100,
                },
                {
                  Charge: "Collision Damage Waiver",
                  Total: 9,
                },
                {
                  Charge: "Liability Insurance",
                  Total: 15,
                },
                {
                  Charge: "Discount",
                  Rate: 1,
                  Total: 1.24,
                },
                {
                  Charge: "Rental Tax",
                  Rate: 11.5,
                  Total: 14.26,
                },
                {
                  Charge: "Total",
                  Total: 137.01999999999998,
                },
              ],
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "You will get a PDF invoice(not image. not HTML to PDF). Try it with example data.",
        content: {
          "application/json": {
            schema: {
              type: "string",
              format: "binary",
            },
          },
        },
      },
    },
  },
];
InvoiceDoc.forEach((x) => {
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
});

InvoiceDoc.map((x) => {
  registry.registerPath(x);
});
const config: OpenAPIObjectConfig = {
  openapi: "3.0.0",
  info: {
    title: "Reservation",
    version: "1.0.0",
    description: "A simple API for Invoice generator for reservation.",
  },
  servers: [
    {
      url:"https://reservation-server-tvfn.onrender.com",
      description: "Hosted good old render. so wait like a old man",
    },
    {
      url: "http://localhost:3030",
      description: "If you run your local server at localhost:3030",
    },
  ],
};

export const generator = new OpenApiGeneratorV3(
  registry.definitions
).generateDocument(config);
