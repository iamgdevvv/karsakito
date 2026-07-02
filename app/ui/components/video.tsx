import { AspectRatio, Box, type AspectRatioProps } from '@mantine/core';
import { useMemo, useState, type ComponentProps } from 'react';
import { cn, getYoutubeId } from '~app-modules/utils';
import { Image, type ImageProps } from '~app-ui/components/image';

export default function VideoIframe({
	src,
	preview,
	previewProps,
	className,
	...props
}: {
	src: string;
	preview?: ImageProps['src'];
	previewProps?: Omit<ImageProps, 'src'>;
} & AspectRatioProps &
	Omit<ComponentProps<'iframe'>, 'src'>) {
	const youtubeId = useMemo(() => getYoutubeId(src), [src]);

	const videoPlaceholder = useMemo(() => {
		if (preview) {
			return preview;
		}

		if (youtubeId) {
			return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
		}

		return undefined;
	}, [preview, youtubeId]);

	const [showIframe, setShowIframe] = useState(!videoPlaceholder);

	return (
		<AspectRatio
			ratio={16 / 9}
			bdrs="lg"
			bg="gray"
			{...props}
			className={cn('overflow-hidden', className)}
		>
			{showIframe ? (
				youtubeId ? (
					<Box
						component="iframe"
						loading="lazy"
						src={`https://www.youtube-nocookie.com/embed/${youtubeId}?si=2YNxticfuTKKZshl`}
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					/>
				) : (
					<Box
						component="iframe"
						loading="lazy"
						src={src}
					/>
				)
			) : (
				<Image
					{...previewProps}
					src={videoPlaceholder}
					onMouseOver={() => {
						if (!showIframe) {
							setShowIframe(true);
						}
					}}
				/>
			)}
		</AspectRatio>
	);
}
