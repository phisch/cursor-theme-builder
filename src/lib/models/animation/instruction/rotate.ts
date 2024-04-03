import { type Static, Type } from '@sinclair/typebox';

type Rotate = Static<typeof Rotate>;
export const Rotate = Type.Object({
	name: Type.Literal('rotate', {
		description:
			'Rotate the element. Omitting cx and cy will rotate around the center of the elements bounding box.'
	}),
	arguments: Type.Object({
		degrees: Type.Number({ description: 'The number of degrees to rotate the element.' }),
		cx: Type.Optional(Type.Number({ description: 'Center of rotation on the x-axis.' })),
		cy: Type.Optional(Type.Number({ description: 'Center of rotation on the y-axis.' }))
	})
});
