import { type Static, Type } from "@sinclair/typebox";

type CX = Static<typeof CX>;
export const CX = Type.Object({
	name: Type.Literal("cx"),
	arguments: Type.Object({
		x: Type.Number(),
	}),
});
