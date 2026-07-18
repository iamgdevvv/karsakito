import { AspectRatio, Box, type AspectRatioProps } from '@mantine/core';
import { useMemo, useState, type ComponentProps } from 'react';
import { cn, getYoutubeId } from '~app-modules/utils';
import { Image, type ImageProps } from '~app-ui/components/image';

export default function VideoIframe({
	src,
	preview,
	previewProps,
	title = 'Video panduan KarsaKito',
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
						title={title}
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
						title={title}
						loading="lazy"
						src={src}
					/>
				)
			) : (
				<Box
					component="button"
					type="button"
					aria-label={`Putar ${title.toLocaleLowerCase('id-ID')}`}
					w="100%"
					h="100%"
					p={0}
					bd={0}
					bg="transparent"
					onClick={() => setShowIframe(true)}
				>
					<Image
						{...previewProps}
						src={videoPlaceholder}
						w="100%"
						h="100%"
					/>
				</Box>
			)}
		</AspectRatio>
	);
}
