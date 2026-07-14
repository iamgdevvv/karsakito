import { Card, RingProgress, Text, Group } from '@mantine/core';
import { useState, useEffect } from 'react';

export function useCountUp(target: number, duration: number = 2000) {
	const [count, setCount] = useState(0);

	useEffect(() => {
		let startTime: number | null = null;
		let frameId: number;

		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = timestamp - startTime;

			const percentage = Math.min(progress / duration, 1);
			const easeOut = 1 - Math.pow(1 - percentage, 4);

			setCount(Math.floor(easeOut * target));

			if (progress < duration) {
				frameId = requestAnimationFrame(animate);
			} else {
				setCount(target);
			}
		};

		frameId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frameId);
	}, [target, duration]);

	return count;
}

interface AnimatedStatProps {
	target: number;
	label: string;
	color: string;
}

export function AnimatedStat({ target, label, color }: AnimatedStatProps) {
	const currentCount = useCountUp(target, 2000);

	return (
		<Card
			shadow="sm"
			padding="xl"
			radius="lg"
			withBorder
			style={{ borderColor: '#e2e8f0' }}
		>
			<Group
				justify="center"
				mb="md"
			>
				<RingProgress
					size={140}
					roundCaps
					thickness={14}
					sections={[{ value: currentCount, color }]}
					label={
						<Text
							c={color}
							fw={800}
							ta="center"
							size="xl"
						>
							{currentCount}%
						</Text>
					}
				/>
			</Group>
			<Text
				ta="center"
				size="lg"
				fw={500}
				c="slate.7"
				style={{ lineHeight: 1.6 }}
			>
				{label}
			</Text>
		</Card>
	);
}
