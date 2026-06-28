import { Image as MantineImage, type ImageProps } from '@mantine/core';
import type { ComponentProps, CSSProperties } from 'react';

export function Image({
	objectFit,
	objectPosition,
	...props
}: ComponentProps<'img'> & ImageProps & Pick<CSSProperties, 'objectFit' | 'objectPosition'>) {
	return (
		<MantineImage
			alt=""
			{...props}
			style={{
				objectFit,
				objectPosition,
			}}
		/>
	);
}
