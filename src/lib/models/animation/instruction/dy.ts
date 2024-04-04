import { type Static, Type } from '@sinclair/typebox';

type Dy = Static<typeof Dy>;
export const Dy = Type.Object({
	name: Type.Literal('dy', {
		description: 'Shift the element in the y direction relative to its current position.'
	}),
	args: Type.Object({
		y: Type.Number({ description: 'Distance to move the element along the y-axis.' })
	})
});
