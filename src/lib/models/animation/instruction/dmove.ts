import { type Static, Type } from "@sinclair/typebox";

type DMove = Static<typeof DMove>;
export const DMove = Type.Object({
	name: Type.Literal("dmove"),
	arguments: Type.Object({
		x: Type.Number(),
		y: Type.Number(),
	}),
});
