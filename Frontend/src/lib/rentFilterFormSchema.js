import { z } from "zod";

export const rentFilterFormSchema = z.object({
  type: z.enum(["home"], { required_error: "Type is required" }),
  propertyType: z.enum(["commercial", "residential"], { required_error: "Property type is required" }),
  location: z.string().min(2, "Location is required"),
  budget: z.coerce.number().positive("Budget must be a positive number"),
  name: z.string().min(2, "Name is required"),
  number: z.string().min(10, "Number must be at least 10 digits"),
});
