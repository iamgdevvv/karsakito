import { Box, Skeleton, Tabs, Text, Typography, type TabsProps } from '@mantine/core';
import { useState } from 'react';
import { HiOutlineCommandLine } from 'react-icons/hi2';
import { IoMdOptions } from 'react-icons/io';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import FormKarsaAdaptasiDialek from '~app-ui/form/karsa/adaptasi-dialek';
import FormKarsaAnalisaDokumen from '~app-ui/form/karsa/analisa-dokumen';
import FormKarsaAnalisaKalimat from '~app-ui/form/karsa/analisa-kalimat';
import FormKarsaCeritaPanjang from '~app-ui/form/karsa/cerita-panjang';
import FormKarsaCeritaPendek from '~app-ui/form/karsa/cerita-pendek';
import FormKarsaDoaBersama from '~app-ui/form/karsa/doa-bersama';
import FormKarsaMotto from '~app-ui/form/karsa/motto';
import FormKarsaParafrase from '~app-ui/form/karsa/parafrase';
import FormKarsaPetuah from '~app-ui/form/karsa/petuah';
import FormKarsaPidato from '~app-ui/form/karsa/pidato';
import FormKarsaRangkuman from '~app-ui/form/karsa/rangkuman';
import FormKarsaSlogan from '~app-ui/form/karsa/slogan';
import FormKarsaTagline from '~app-ui/form/karsa/tagline';
import FormKarsaTekaTeki from '~app-ui/form/karsa/teka-teki';
import FormKarsaTerjemahanDokumen from '~app-ui/form/karsa/terjemahan-dokumen';
import FormKarsaTerjemahanKalimat from '~app-ui/form/karsa/terjemahan-kalimat';

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
			keepMounted
			keepMountedMode="display-none"
			value={activeTab}
			classNames={{
				root: 'h-full',
				panel: 'h-full',
			}}
			onChange={(value) => {
				const valueTab = value as typeof activeTab;
				setActiveTab(valueTab);
			}}
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
					disabled={!resultAI}
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
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'petuah' ? (
						<FormKarsaPetuah
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'tagline' ? (
						<FormKarsaTagline
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'slogan' ? (
						<FormKarsaSlogan
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'motto' ? (
						<FormKarsaMotto
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'ceritapendek' ? (
						<FormKarsaCeritaPendek
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'ceritapanjang' ? (
						<FormKarsaCeritaPanjang
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'doabersama' ? (
						<FormKarsaDoaBersama
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'tekateki' ? (
						<FormKarsaTekaTeki
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'parafrase' ? (
						<FormKarsaParafrase
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'rangkuman' ? (
						<FormKarsaRangkuman
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'adaptasidialek' ? (
						<FormKarsaAdaptasiDialek
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'terjemahankalimat' ? (
						<FormKarsaTerjemahanKalimat
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'terjemahandokumen' ? (
						<FormKarsaTerjemahanDokumen
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'analisakalimat' ? (
						<FormKarsaAnalisaKalimat
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : data.app === 'analisadokumen' ? (
						<FormKarsaAnalisaDokumen
							data={data}
							onError={() => {
								setActiveTab('options');
							}}
							onSubmitProgress={() => {
								setResultAI(null);
								setActiveTab('result');
							}}
							onSubmit={(values) => {
								onSubmit(values);
								setResultAI(values.result);
							}}
						/>
					) : null}
				</Box>
			</Tabs.Panel>

			<Tabs.Panel value="result">
				{resultAI === null ? (
					<Skeleton
						w="100%"
						h="100%"
						mih={200}
					/>
				) : (
					<Box
						p="md"
						bdrs="md"
						bg="gray.0"
					>
						{resultAI ? (
							<Typography>
								<Markdown remarkPlugins={[remarkGfm, remarkBreaks]}>
									{resultAI}
								</Markdown>
							</Typography>
						) : null}
					</Box>
				)}
			</Tabs.Panel>
		</Tabs>
	);
}
