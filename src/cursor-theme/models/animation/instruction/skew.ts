import { type Static, Type } from "@sinclair/typebox";

type Skew = Static<typeof Skew>;
export const Skew = Type.Object({
	name: Type.Literal("skew"),
	arguments: Type.Object({
		x: Type.Number(),
		y: Type.Number(),
	}),
});
