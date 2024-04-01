export enum CommentSubtype {
	Copyright = 1,
	License = 2,
	Other = 3
}

export type Comment = {
	type: CommentSubtype;
	string: string;
};

export type Image = {
	pixels: Buffer; // expected to be in RGBA format
	width: number;
	height: number;
	xhot: number;
	yhot: number;
	delay: number;
};

export type Chunk = Comment | Image;

function isComment(chunk: Chunk): chunk is Comment {
	return (chunk as Comment).string !== undefined;
}

function isImage(chunk: Chunk): chunk is Image {
	return (chunk as Image).pixels !== undefined;
}

function calculateSize(chunk: Chunk): number {
	if (isImage(chunk)) {
		return 36 + 4 * chunk.width * chunk.height;
	}
	return 20 + Buffer.byteLength(chunk.string, 'utf-8');
}

function flipRedBlueAndPreMultiplyAlpha(buffer: Buffer): Buffer {
	for (let i = 0; i < buffer.length; i += 4) {
		const alpha = buffer[i + 3];
		const red = Math.round(buffer[i] * (alpha / 255));
		const blue = Math.round(buffer[i + 2] * (alpha / 255));
		buffer[i] = blue;
		buffer[i + 1] = Math.round(buffer[i + 1] * (alpha / 255));
		buffer[i + 2] = red;
	}
	return buffer;
}

export function encode(chunks: Chunk[]): Buffer {
	const chunkPositionMap: Map<Chunk, number> = new Map();
	let position = 16 + 12 * chunks.length;
	for (const chunk of chunks) {
		chunkPositionMap.set(chunk, position);
		const size = calculateSize(chunk);
		position += size;
	}

	const buffer = Buffer.alloc(position);

	buffer.write('Xcur', 0, 4, 'utf-8');
	buffer.writeUInt32LE(16, 4);
	buffer.writeUInt32LE(1, 8);
	buffer.writeUInt32LE(chunks.length, 12);

	let offset = 16;
	for (const chunk of chunks) {
		if (isComment(chunk)) {
			buffer.writeUInt32LE(0xfffe0001, offset);
			buffer.writeUInt32LE(chunk.type, offset + 4);
		} else if (isImage(chunk)) {
			buffer.writeUInt32LE(0xfffd0002, offset);
			buffer.writeUInt32LE(chunk.width, offset + 4);
		}
		// todo: check if ?? 0 is correct here
		buffer.writeUInt32LE(chunkPositionMap.get(chunk) ?? 0, offset + 8);
		offset += 12;
	}

	for (const chunk of chunks) {
		if (isComment(chunk)) {
			buffer.writeUInt32LE(20, offset);
			buffer.writeUInt32LE(0xfffe0001, offset + 4);
			buffer.writeUInt32LE(chunk.type, offset + 8);
			buffer.writeUInt32LE(1, offset + 12);
			const stringByteLength = Buffer.byteLength(chunk.string, 'utf-8');
			buffer.writeUInt32LE(stringByteLength, offset + 16);
			buffer.write(chunk.string, offset + 20, 'utf-8');
			offset += 20 + stringByteLength;
		} else if (isImage(chunk)) {
			buffer.writeUInt32LE(36, offset);
			buffer.writeUInt32LE(0xfffd0002, offset + 4);
			buffer.writeUInt32LE(chunk.width, offset + 8);
			buffer.writeUInt32LE(1, offset + 12);
			buffer.writeUInt32LE(chunk.width, offset + 16);
			buffer.writeUInt32LE(chunk.height, offset + 20);
			buffer.writeUInt32LE(chunk.xhot, offset + 24);
			buffer.writeUInt32LE(chunk.yhot, offset + 28);
			buffer.writeUInt32LE(chunk.delay, offset + 32);
			flipRedBlueAndPreMultiplyAlpha(chunk.pixels).copy(buffer, offset + 36);
			offset += 36 + chunk.pixels.length;
		}
	}

	return buffer;
}
