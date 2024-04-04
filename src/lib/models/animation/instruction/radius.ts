import { Type, type Static } from '@sinclair/typebox';

export function isCircleRadius(radius: Radius): radius is CircleRadius {
	return radius.name === 'radius';
}

export function isEllipseRadius(radius: Radius): radius is EllipseRadius {
	return radius.name === 'radius';
}

type CircleRadius = Static<typeof CircleRadius>;
const CircleRadius = Type.Object({
	name: Type.Literal('radius', {
		description: 'Set a circles radius, or a rectangles corner radius.'
	}),
	args: Type.Object({
		radius: Type.Number({
			description: 'Radius of the circle, or the corner radius of a rectangle.'
		})
	})
});

type EllipseRadius = Static<typeof EllipseRadius>;
const EllipseRadius = Type.Object({
	name: Type.Literal('radius', {
		description: 'Set the radius for the x and y axis of an ellipse.'
	}),
	args: Type.Object({
		rx: Type.Number({
			description: 'Radius of the x-axis of an ellipse.'
		}),
		ry: Type.Number({
			description: 'Radius of the y-axis of an ellipse.'
		})
	})
});

type Radius = Static<typeof Radius>;
export const Radius = Type.Union([CircleRadius, EllipseRadius]);
