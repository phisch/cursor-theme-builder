import { type Static, Type } from '@sinclair/typebox';

type Ease = Static<typeof Ease>;
export const Ease = Type.Object({
	name: Type.Literal('ease'),
	arguments: Type.Object({
		kind: Type.Union(
			[
				Type.Literal('<>', { description: 'Ease in and out' }),
				Type.Literal('-', { description: 'Linear' }),
				Type.Literal('<', { description: 'Ease in' }),
				Type.Literal('>', { description: 'Ease out' })
			],
			{ description: 'The easing function to use' }
		)
	})
});
