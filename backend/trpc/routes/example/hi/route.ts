import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

// Define a procedure that takes a name input and returns a greeting
const hiProcedure = publicProcedure
  .input(z.object({ name: z.string() }))
  .query(({ input }) => {
    return {
      hello: input.name,
      date: new Date(),
    };
  });

export default hiProcedure;