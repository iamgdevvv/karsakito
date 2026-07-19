import {
	ActionIcon,
	Box,
	Group,
	Loader,
	Modal,
	Stack,
	Tabs,
	Text,
	Tooltip,
	Typography,
	type TabsProps,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { HiOutlineCommandLine } from 'react-icons/hi2';
import { IoMdOptions } from 'react-icons/io';
import { LuThumbsDown, LuThumbsUp } from 'react-icons/lu';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import type { PayloadSubmissionReactionKarsa } from '~app-modules/schema/karsa';
import type { PayloadWindowWorkspace } from '~app-modules/schema/workspace';
import FormKarsaReaction from '~app-ui/form/karsa-reaction';
import FormKarsaAdaptasiDialek from '~app-ui/form/karsa/adaptasi-dialek';
import FormKarsaAnalisaDokumen from '~app-ui/form/karsa/analisa-dokumen';
import FormKarsaAnalisaKalimat from '~app-ui/form/karsa/analisa-kalimat';
import FormKarsaCeritaPanjang from '~app-ui/form/karsa/cerita-panjang';
import FormKarsaCeritaPendek from '~app-ui/form/karsa/cerita-pendek';
import FormKarsaDoaBersama from '~app-ui/form/karsa/doa-bersama';
import FormKarsaHymne from '~app-ui/form/karsa/hymne';
import FormKarsaMotto from '~app-ui/form/karsa/motto';
import FormKarsaPantun from '~app-ui/form/karsa/pantun';
import FormKarsaParafrase from '~app-ui/form/karsa/parafrase';
import FormKarsaPetuah from '~app-ui/form/karsa/petuah';
import FormKarsaPidato from '~app-ui/form/karsa/pidato';
import FormKarsaPuisi from '~app-ui/form/karsa/puisi';
import FormKarsaRangkuman from '~app-ui/form/karsa/rangkuman';
import FormKarsaSlogan from '~app-ui/form/karsa/slogan';
import FormKarsaSyair from '~app-ui/form/karsa/syair';
import FormKarsaTagline from '~app-ui/form/karsa/tagline';
import FormKarsaTekaTeki from '~app-ui/form/karsa/teka-teki';
import FormKarsaTerjemahanDokumen from '~app-ui/form/karsa/terjemahan-dokumen';
import FormKarsaTerjemahanKalimat from '~app-ui/form/karsa/terjemahan-kalimat';

const loadingMessages = [
	'✨ Memahami kebutuhan Anda',
	'🧠 Menganalisis konteks',
	'📝 Menyusun jawaban terbaik',
	'🔍 Meninjau kualitas hasil',
	'🚀 Menyiapkan hasil akhir',
] as const;

export function WindowAppKarsaWriter({
	data,
	mode,
	onSubmit,
	...props
}: Omit<TabsProps, 'onSubmit'> & {
	data: PayloadWindowWorkspace;
	mode: 'window' | 'simple';
	onSubmit: (values: NonNullable<PayloadWindowWorkspace['karsa']>) => void;
}) {
	const [openSubmissionReaction, setOpenSubmissionReaction] =
		useState<PayloadSubmissionReactionKarsa | null>(null);
	const [resultAI, setResultAI] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<'options' | 'result' | null>('options');
	const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
	const isLoadingResult = activeTab === 'result' && resultAI === null;

	useEffect(() => {
		if (!isLoadingResult) {
			return;
		}

		setLoadingMessageIndex(0);
		const intervalId = setInterval(() => {
			setLoadingMessageIndex((currentIndex) => (currentIndex + 1) % loadingMessages.length);
		}, 4000);

		return () => clearInterval(intervalId);
	}, [isLoadingResult]);

	return (
		<>
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
					pt="xs"
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
							Pengaturan
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
							Hasil
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
						{data.app === 'pantun' ? (
							<FormKarsaPantun
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
						) : data.app === 'pidato' ? (
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
						) : data.app === 'puisi' ? (
							<FormKarsaPuisi
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
						) : data.app === 'syair' ? (
							<FormKarsaSyair
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
						) : data.app === 'hymne' ? (
							<FormKarsaHymne
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
					<Stack gap="xs">
						<Text
							size="xs"
							c="dimmed"
						>
							Tinjau hasil sebelum digunakan atau dibagikan.
						</Text>
						{isLoadingResult ? (
							<Stack
								w="100%"
								mih={400}
								pt={60}
								align="center"
								gap="xs"
								bg="gray.0"
								bdrs="md"
								role="status"
								aria-live="polite"
								aria-busy="true"
							>
								<Loader
									type="dots"
									size="sm"
								/>
								<Text
									size="sm"
									fw={500}
									ta="center"
								>
									{loadingMessages[loadingMessageIndex]}
								</Text>
							</Stack>
						) : (
							<Box
								w="100%"
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
						{data.karsa ? (
							<Group
								role="group"
								aria-label="Penilaian hasil"
								pos="sticky"
								bottom={{
									base: mode === 'simple' ? 90 : 4,
									lg: mode === 'simple' ? 100 : 4,
								}}
								display="inline-flex"
								justify="center"
								gap={4}
								p={6}
								ml="auto"
								bdrs="lg"
								bg="white"
								className="cx-shadow-sm"
							>
								<Text
									span
									fz={10}
									fw={600}
								>
									Evaluasi Hasil AI
								</Text>
								<Tooltip
									label="Sesuai kebutuhan"
									fz="xs"
								>
									<ActionIcon
										aria-label="Tandai hasil sesuai kebutuhan"
										aria-pressed={data.karsa?.reaction === true}
										variant={data.karsa?.reaction ? 'filled' : 'light'}
										color="green"
										onClick={() =>
											setOpenSubmissionReaction({
												karsaId: data.karsa!.id,
												feedback: data.karsa?.feedback || '',
												reaction: true,
											})
										}
									>
										<LuThumbsUp />
									</ActionIcon>
								</Tooltip>
								<Tooltip
									label="Perlu diperbaiki"
									fz="xs"
								>
									<ActionIcon
										aria-label="Tandai hasil perlu diperbaiki"
										aria-pressed={data.karsa?.reaction === false}
										variant={
											data.karsa?.reaction === false ? 'filled' : 'light'
										}
										color="orange"
										onClick={() =>
											setOpenSubmissionReaction({
												karsaId: data.karsa!.id,
												feedback: data.karsa?.feedback || '',
												reaction: false,
											})
										}
									>
										<LuThumbsDown />
									</ActionIcon>
								</Tooltip>
							</Group>
						) : null}
					</Stack>
				</Tabs.Panel>
			</Tabs>

			<Modal
				opened={!!openSubmissionReaction}
				keepMounted
				withinPortal={false}
				title="Beri penilaian hasil"
				onClose={() => setOpenSubmissionReaction(null)}
			>
				{data.karsa && openSubmissionReaction ? (
					<FormKarsaReaction
						data={openSubmissionReaction}
						onSubmit={(values) => {
							onSubmit({
								...data.karsa!,
								reaction: values.reaction,
								feedback: values.feedback,
							});
							setOpenSubmissionReaction(null);
						}}
					/>
				) : null}
			</Modal>
		</>
	);
}
