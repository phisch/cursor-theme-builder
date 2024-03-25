import { type Static, Type } from "@sinclair/typebox";

type Flip = Static<typeof Flip>;
export const Flip = Type.Object({
	name: Type.Literal("flip"),
	arguments: Type.Object({
		axis: Type.Union([
			Type.Literal("x"),
			Type.Literal("y"),
			Type.Literal("both"),
		]),
	}),
});
