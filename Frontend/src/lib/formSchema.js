import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number should be at least 10 digits"),
  email: z.string().email("Invalid email"),
  location: z.string().min(3, "Location is required"),
 avatar: z
      .any()
      .optional()
      .refine((file) => {
        return (
          file === undefined ||
          file === null ||
          file instanceof File
        );
      }, {
        message: "Avatar must be a valid file",
      }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string().min(6, "Confirm password must be at least 6 characters"),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});
