import { type Static, Type } from '@sinclair/typebox';

type Flip = Static<typeof Flip>;
export const Flip = Type.Object({
	name: Type.Literal('flip', {
		description: 'Flip the element along an axis.'
	}),
	args: Type.Object({
		axis: Type.Union([Type.Literal('x'), Type.Literal('y'), Type.Literal('both')], {
			description: 'Axis to flip the element along.'
		}),
		offset: Type.Optional(
			Type.Number({
				description: 'Offset to flip the element along. Defaults to the center of the bounding box.'
			})
		)
	})
});
