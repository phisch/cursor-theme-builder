import { Type, Static } from '@sinclair/typebox'

type DMove = Static<typeof DMove>;
export const DMove = Type.Object({
    name: Type.Literal("dmove"),
    arguments: Type.Tuple([
        Type.Number({description:"some cool value here"}),
        Type.Number()
    ])
});
