import { Image as MantineImage, type ImageProps as MantineImageProps } from '@mantine/core';
import type { ComponentProps, CSSProperties } from 'react';

export type ImageProps = ComponentProps<'img'> &
	MantineImageProps &
	Pick<CSSProperties, 'objectFit' | 'objectPosition'>;

export function Image({ objectFit, objectPosition, style, ...props }: ImageProps) {
	return (
		<MantineImage
			alt=""
			loading="lazy"
			{...props}
			data-slot="Image"
			style={{
				...style,
				objectFit,
				objectPosition,
			}}
		/>
	);
}
