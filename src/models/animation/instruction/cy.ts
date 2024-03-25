import { type Static, Type } from "@sinclair/typebox";

type CY = Static<typeof CY>;
export const CY = Type.Object({
	name: Type.Literal("cy"),
	arguments: Type.Object({
		y: Type.Number(),
	}),
});
