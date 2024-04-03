import { type Static, Type } from '@sinclair/typebox';

export function isRadiusArguments(value: any): value is RadiusArguments {
	return value && value.radius !== undefined;
}

export function isRadiiArguments(value: any): value is RadiiArguments {
	return value && value.rx !== undefined && value.ry !== undefined;
}

type RadiusArguments = Static<typeof RadiusArguments>;
const RadiusArguments = Type.Object({
	radius: Type.Number({
		description: 'The radius for a circle or border radius for a rectangle.'
	})
});

type RadiiArguments = Static<typeof RadiiArguments>;
const RadiiArguments = Type.Object({
	rx: Type.Number({
		description: 'Radius of the x-axis of an ellipse.'
	}),
	ry: Type.Number({
		description: 'Radius of the y-axis of an ellipse.'
	})
});

type Radius = Static<typeof Radius>;
export const Radius = Type.Object({
	name: Type.Literal('radius', {
		description: 'Set the radius of circles and ellipses, or the border radius of rectangles.'
	}),
	arguments: Type.Union([RadiusArguments, RadiiArguments])
});
