import { Box, Tabs, Text, type TabsProps } from '@mantine/core';
import { useState } from 'react';
import { HiOutlineCommandLine } from 'react-icons/hi2';
import { IoMdOptions } from 'react-icons/io';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import FormKarsaPidato from '~app-ui/form/karsa/pidato';

export function WindowAppKarsaWriter({
	data,
	onSubmit,
	...props
}: Omit<TabsProps, 'onSubmit'> & {
	data: PayloadWindowWorkspace;
	onSubmit: (values: NonNullable<PayloadWindowWorkspace['karsa']>) => void;
}) {
	const [resultAI, setResultAI] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<'options' | 'result' | null>('options');

	return (
		<Tabs
			variant="outline"
			{...props}
			value={activeTab}
			onChange={(value) => setActiveTab(value as typeof activeTab)}
		>
			<Tabs.List
				mb="md"
				pos="sticky"
				top={0}
				bg="white"
				className="z-2"
			>
				<Tabs.Tab
					value="options"
					leftSection={<IoMdOptions size={12} />}
				>
					<Text
						span
						display="inline-block"
						size="xs"
						ml={-4}
					>
						Options
					</Text>
				</Tabs.Tab>
				<Tabs.Tab
					value="result"
					leftSection={<HiOutlineCommandLine size={16} />}
				>
					<Text
						span
						display="inline-block"
						size="xs"
						ml={-4}
					>
						Result
					</Text>
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value="options">
				<Box
					flex={1}
					p="md"
					bdrs="md"
					bd="1px solid gray.2"
					style={{
						overflow: 'auto',
						backgroundImage:
							'radial-gradient(var(--mantine-color-gray-3) 1px, transparent 0)',
						backgroundSize: '16px 16px',
					}}
				>
					{data.app === 'pidato' ? (
						<FormKarsaPidato
							data={data}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
								setActiveTab('result');
							}}
						/>
					) : null}
				</Box>
			</Tabs.Panel>

			<Tabs.Panel value="result">
				<Markdown remarkPlugins={[remarkGfm]}>{resultAI}</Markdown>
			</Tabs.Panel>
		</Tabs>
	);
}
