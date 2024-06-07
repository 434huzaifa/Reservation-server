import z from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z);

export const SummarySchema = z.object({
  Charge: z.string(),
  Unit: z.number().optional(),
  Rate: z.number().optional(),
  Total: z.number().optional(),
}).array();

export const errorResponse=z.object({
  msg:z.string()
})