import { z } from "zod";

export const constructFilterFormSchema = z.object({
  plotArea: z.string().min(1, "Plot area is required"),
  constructionArea: z.coerce.number().positive("Construction area must be a positive number"),
  budget: z.coerce.number().positive("Budget must be a positive number"),
  location: z.string().min(2, "Location is required"),
  name: z.string().min(2, "Name is required"),
  number: z.string().min(10, "Number must be at least 10 digits"),
});
