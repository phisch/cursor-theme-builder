import { type Static, Type } from '@sinclair/typebox';

export function isSingleFactorScaleArguments(value: any): value is SingleFactorScaleArguments {
	return value.factor !== undefined;
}

export function isDualAxisScaleArguments(value: any): value is DualAxisScaleArguments {
	return value.x !== undefined && value.y !== undefined;
}

type SingleFactorScaleArguments = Static<typeof SingleFactorScaleArguments>;
const SingleFactorScaleArguments = Type.Object({
	factor: Type.Number({
		description: 'The scaling factor on both axes.'
	})
});

type DualAxisScaleArguments = Static<typeof DualAxisScaleArguments>;
const DualAxisScaleArguments = Type.Object({
	x: Type.Number({ description: 'The scaling factor on the x-axis.' }),
	y: Type.Number({ description: 'The scaling factor on the y-axis.' })
});

type Scale = Static<typeof Scale>;
export const Scale = Type.Object({
	name: Type.Literal('scale'),
	arguments: Type.Union([SingleFactorScaleArguments, DualAxisScaleArguments])
});
