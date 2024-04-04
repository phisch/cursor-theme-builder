import { type Static, Type } from '@sinclair/typebox';
import { Animate } from './instruction/animate';
import { Center } from './instruction/center';
import { CX } from './instruction/cx';
import { CY } from './instruction/cy';
import { DMove } from './instruction/dmove';
import { DX } from './instruction/dx';
import { Dy } from './instruction/dy';
import { Flip } from './instruction/flip';
import { Height } from './instruction/height';
import { Move } from './instruction/move';
import { Radius } from './instruction/radius';
import { Rotate } from './instruction/rotate';
import { Scale } from './instruction/scale';
import { Size } from './instruction/size';
import { Skew } from './instruction/skew';
import { Translate } from './instruction/translate';
import { Width } from './instruction/width';
import { X } from './instruction/x';
import { Y } from './instruction/y';
import { Hide } from './instruction/hide';
import { Show } from './instruction/show';

export type AnimationInstruction = Static<typeof AnimationInstruction>;
export const AnimationInstruction = Type.Union([
	Animate,
	Center,
	CX,
	CY,
	DMove,
	DX,
	Dy,
	Flip,
	Height,
	Hide,
	Move,
	Radius,
	Rotate,
	Scale,
	Show,
	Size,
	Skew,
	Translate,
	Width,
	X,
	Y
]);

export type Animation = Static<typeof Animation>;
export const Animation = Type.Object({
	selector: Type.String(),
	instructions: Type.Array(AnimationInstruction)
});

export type AnimationList = Static<typeof AnimationList>;
export const AnimationList = Type.Array(Animation);
