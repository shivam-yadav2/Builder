import { z } from "zod";

export const sellFilterFormSchema = z.object({
  type: z.enum(["home", "land"], { required_error: "Type is required" }),
  location: z.string().min(2, "Location is required"),
  area: z.coerce.number().positive("Area must be a positive number"),
  budget: z.coerce.number().positive("Budget must be a positive number"),
  name: z.string().min(2, "Name is required"),
  number: z.string().min(10, "Number must be at least 10 digits"),
});
