import { type Static, Type } from '@sinclair/typebox';

export function isSingleFactorScale(scale: Scale): scale is SingleFactorScale {
	return scale.name === 'scale';
}

export function isDualAxisScale(scale: Scale): scale is DualAxisScale {
	return scale.name === 'scale';
}

type SingleFactorScale = Static<typeof SingleFactorScale>;
export const SingleFactorScale = Type.Object({
	name: Type.Literal('scale', {
		description: 'Scale the element by a single factor.'
	}),
	args: Type.Object({
		factor: Type.Number({ description: 'The scaling factor on both axes.' })
	})
});

type DualAxisScale = Static<typeof DualAxisScale>;
export const DualAxisScale = Type.Object({
	name: Type.Literal('scale', {
		description: 'Scale the element by different factors on each axis.'
	}),
	args: Type.Object({
		x: Type.Number({ description: 'The scaling factor on the x-axis.' }),
		y: Type.Number({ description: 'The scaling factor on the y-axis.' })
	})
});

type Scale = Static<typeof Scale>;
export const Scale = Type.Union([SingleFactorScale, DualAxisScale]);
