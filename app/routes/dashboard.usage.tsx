import {
	Badge,
	Center,
	DataList,
	Flex,
	Group,
	Loader,
	ScrollArea,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Timeline,
	Title,
	type StackProps,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useCallback, useMemo } from 'react';
import { LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { LuCoins, LuGift, LuHandHeart, LuWallet } from 'react-icons/lu';
import { PiCoinsFill, PiLightningFill } from 'react-icons/pi';
import { TbApiApp } from 'react-icons/tb';
import { replace, useNavigation, useSearchParams } from 'react-router';
import { labelActivityType, labelAppName } from '~app-modules/enum-options';
import { metaDashboardRoute } from '~app-modules/meta';
import {
	PayloadQueryBalanceUserSchema,
	type PayloadQueryBalanceUser,
} from '~app-modules/schema/balance';
import { dayjs, toPayloadSearchParams } from '~app-modules/utils';
import { actionGetBalanceUser } from '~app-server/balance';
import { authUserCtx } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { HeaderDashboard } from '~app-ui/layouts/header';
import { DashboardPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/dashboard.usage';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authGetSession(request);
	const user = authSession.get('user');

	if (!user) {
		const redirectParams = new URLSearchParams();
		const queryParams = request.url.split('?')[1];
		let redirectLink = '/dashboard/usage';

		if (queryParams) {
			redirectLink += `?${queryParams}`;
		}

		redirectParams.set('redirect', redirectLink);

		throw replace(`/login?${redirectParams.toString()}`);
	}

	context.set(authUserCtx, user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;

	const userBalance = await actionGetBalanceUser({
		request,
		context,
		withActivities: true,
	});

	return {
		user,
		result: userBalance,
	};
}

export function meta(_: Route.MetaArgs) {
	return metaDashboardRoute({
		title: 'Penggunaan Token',
	});
}

export default function UsageDashboardRoute({ loaderData }: Route.ComponentProps) {
	const navigation = useNavigation();
	const [searchParams, setSearchParams] = useSearchParams();

	const queryParams = useMemo(() => {
		return {
			...PayloadQueryBalanceUserSchema.safeParse(Object.fromEntries(searchParams)).data,
			...loaderData.result.params,
		};
	}, [loaderData.result.params, searchParams]);

	const handlerSearchParams = useCallback(
		(payload: PayloadQueryBalanceUser) => {
			setSearchParams(
				toPayloadSearchParams({
					...queryParams,
					...payload,
				}),
			);
		},
		[queryParams],
	);

	const balance = useMemo(() => loaderData.result.data, [loaderData.result]);
	const activities = useMemo(() => balance?.activities || [], [balance]);
	const hasActivityFilter = Boolean(queryParams.activityStartAt && queryParams.activityEndAt);

	const totalDipakai = useMemo(() => {
		return activities.filter((a) => a.type === 'KARSA').reduce((sum, a) => sum + a.token, 0);
	}, [activities]);
	const totalTransaksi = activities.length;

	return (
		<div className="site">
			<HeaderDashboard authUser={loaderData.user} />
			<DashboardPanel className="site-main">
				<Title mb="sm">Penggunaan Token</Title>
				<Text
					c="dimmed"
					size="sm"
					mb="lg"
				>
					Pantau saldo dan riwayat penggunaan token Anda.
				</Text>

				<SimpleGrid
					spacing={{
						base: 'xs',
						sm: 'md',
					}}
					cols={{ base: 1, sm: 2, md: 4 }}
					mb="lg"
				>
					<StatCard
						label="Token Utama"
						value={balance?.token ?? 0}
						sublabel="Sisa Token Utama"
						icon={<PiCoinsFill size={16} />}
						color="yellow"
					/>
					<StatCard
						label="Token Harian"
						value={balance?.tokenDaily ?? 0}
						sublabel="Sisa Token Bonus Harian"
						icon={<LuCoins size={16} />}
						color="blue"
					/>
					<StatCard
						label="Penggunaan Token"
						value={totalDipakai}
						sublabel={
							dayjs(queryParams.activityStartAt).format('DD MMMM YYYY') +
							' - ' +
							dayjs(queryParams.activityEndAt).format('DD MMMM YYYY')
						}
						icon={<PiLightningFill size={16} />}
						color="orange"
					/>
					<StatCard
						label="Total Karsa"
						value={totalTransaksi}
						sublabel={
							dayjs(queryParams.activityStartAt).format('DD MMMM YYYY') +
							' - ' +
							dayjs(queryParams.activityEndAt).format('DD MMMM YYYY')
						}
						icon={<TbApiApp size={16} />}
						color="primary"
					/>
				</SimpleGrid>

				<Group
					justify="space-between"
					mb="md"
				>
					<Title
						order={3}
						size="h4"
					>
						Riwayat Token
					</Title>
					<DatePickerInput
						type="range"
						size="sm"
						clearable
						maxLevel="month"
						leftSection={<LuWallet size={16} />}
						placeholder="Filter tanggal"
						valueFormat="DD MMM YYYY"
						readOnly={navigation.state === 'loading'}
						defaultValue={[
							queryParams.activityStartAt
								? dayjs(
										queryParams.activityStartAt,
										loaderData.user.timezone,
									).toDate()
								: null,
							queryParams.activityEndAt
								? dayjs(
										queryParams.activityEndAt,
										loaderData.user.timezone,
									).toDate()
								: null,
						]}
						onChange={(value) => {
							const [activityStartAt, activityEndAt] = value || [];

							if (activityStartAt && activityEndAt) {
								const payload = PayloadQueryBalanceUserSchema.safeParse({
									activityStartAt,
									activityEndAt,
								});

								if (payload.data) {
									handlerSearchParams(payload.data);
								} else {
									notifications.show({
										title: 'Error',
										color: 'orange',
										message: 'Rentang tanggal tidak valid',
									});
								}
							} else if (!activityStartAt && !activityEndAt) {
								handlerSearchParams({ activityStartAt: null, activityEndAt: null });
							}
						}}
					/>
				</Group>

				{navigation.state === 'loading' ? (
					<Center>
						<Loader />
					</Center>
				) : activities.length ? (
					<ScrollArea.Autosize mah={600}>
						<Timeline
							active={activities.length}
							lineWidth={2}
							bulletSize={24}
						>
							{activities.map((activity, index) => (
								<Timeline.Item
									key={`${activity.id}-${index}`}
									bullet={
										activity.type === 'DAILY_BONUS' ? (
											<LuGift />
										) : activity.type === 'GIVEAWAY' ? (
											<LuHandHeart />
										) : activity.type === 'KARSA' ? (
											<TbApiApp />
										) : activity.type === 'PURCHASE' ? (
											<LiaMoneyBillWaveSolid />
										) : undefined
									}
									title={
										<Group
											gap="xs"
											wrap="wrap"
										>
											<Text
												span
												size="sm"
												fw={700}
											>
												{activity.type === 'KARSA' &&
												'karsa' in activity &&
												activity.karsa?.app
													? labelAppName[activity.karsa.app]
													: labelActivityType[activity.type]}
											</Text>
											<Badge
												size="xs"
												variant="light"
												color={
													activity.type === 'KARSA' ? 'orange' : 'green'
												}
												tt="none"
											>
												{activity.type === 'KARSA' ? '-' : '+'}
												{activity.token}
											</Badge>
											{'sender' in activity && activity.sender ? (
												<Badge
													size="xs"
													variant="light"
													color="gray"
													tt="none"
												>
													dari {activity.sender.name}
												</Badge>
											) : null}
										</Group>
									}
								>
									<Stack
										gap={2}
										title={dayjs(
											activity.createdAt,
											loaderData.user.timezone,
										).toString()}
									>
										<DataList
											size="xs"
											gap={2}
											orientation="vertical"
										>
											<DataList.Item>
												<DataList.ItemLabel>
													Perubahan Token
												</DataList.ItemLabel>
												<DataList.ItemValue fw={600}>
													{activity.tokenDailyBefore} →{' '}
													{activity.tokenDailyAfter}
												</DataList.ItemValue>
											</DataList.Item>
										</DataList>

										{activity.description ? (
											<Text
												c="dimmed"
												fw={400}
												size="xs"
											>
												{activity.description}
											</Text>
										) : null}

										<Text
											span
											size="xs"
											c="dimmed"
										>
											{dayjs(
												activity.createdAt,
												loaderData.user.timezone,
											).fromNow()}
										</Text>
									</Stack>
								</Timeline.Item>
							))}
						</Timeline>
					</ScrollArea.Autosize>
				) : (
					<Text
						c="dimmed"
						ta="center"
					>
						{hasActivityFilter
							? 'Tidak ada transaksi pada rentang tanggal ini.'
							: 'Belum ada transaksi.'}
					</Text>
				)}
			</DashboardPanel>
			<Footer />
		</div>
	);
}

function StatCard({
	label,
	value,
	sublabel,
	icon,
	color,
	...props
}: {
	label: string;
	value: number;
	sublabel: string;
	icon: React.ReactNode;
	color: string;
} & StackProps) {
	return (
		<Stack
			gap={0}
			p="md"
			bd="1px solid gray.2"
			bdrs="lg"
			bg="white"
			{...props}
		>
			<Flex
				align="center"
				justify="space-between"
				mb="xs"
			>
				<Text
					span
					pr="xs"
					fz={10}
					fw={700}
					c="dimmed"
					tt="uppercase"
				>
					{label}
				</Text>
				<ThemeIcon
					variant="light"
					color={color}
					w={28}
					miw={28}
					size="md"
					radius="md"
				>
					{icon}
				</ThemeIcon>
			</Flex>
			<Text
				span
				size="xl"
				fw={800}
			>
				{value}
			</Text>
			<Text
				size="xs"
				c="dimmed"
			>
				{sublabel}
			</Text>
		</Stack>
	);
}
