import { z } from "zod";

export const classNameQuerySchema = z.object({
  className: z.string().min(1).optional(),
});

export const insertClassSchema = z.object({
  className: z.string().min(1),
  description: z.string().optional(),

  raceOptions: z.unknown().optional(),
  nameOptions: z.unknown().optional(),
  lookOptions: z.unknown().optional(),
  stats: z.unknown().optional(),
  alignmentOptions: z.unknown().optional(),
  gearOptions: z.unknown().optional(),
  bonds: z.unknown().optional(),
  startingMoves: z.unknown().optional(),
  advancedMoved: z.unknown().optional(),
  expertMoves: z.unknown().optional(),
});
