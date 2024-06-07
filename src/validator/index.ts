import z from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

export const SummarySchema = z.object({
  personalInfo: z.object({
    FirstName: z.string().min(2),
    LastName: z.string().min(2),
    email: z.string().email(),
    phoneNumber: z.number(),
  }),
  carInfo: z.object({
    id:z.string(),
    type: z.string(),
    make: z.string(),
    model: z.string(),
    year: z.string(),
  }),
  reservationId: z.string().min(3).optional(),
  pickupdate: z.string().refine(
    (v) => {
      const regex =
        /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d (0[0-9]|1[012]):[0-5][0-9] (AM|PM)$/;
      return regex.test(v);
    },
    {
      message: "Date-time format must be 'MM/DD/YYYY hh:mm AM/PM'",
      path: ["pickupdate"],
    }
  ),
  returndate: z.string().refine(
    (v) => {
      const regex =
        /^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d (0[0-9]|1[012]):[0-5][0-9] (AM|PM)$/;
      return regex.test(v);
    },
    {
      message: "Date-time format must be 'MM/DD/YYYY hh:mm AM/PM'",
      path: ["returndate"],
    }
  ),
  summary: z
    .object({
      Charge: z.string(),
      Unit: z.number().optional(),
      Rate: z.number().optional(),
      Total: z.number().optional(),
    })
    .array(),
});

export const errorResponse = z.object({
  msg: z.string(),
});

