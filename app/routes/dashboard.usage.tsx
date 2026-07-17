import {
	Badge,
	Box,
	Center,
	DataList,
	Group,
	Loader,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Timeline,
	Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useCallback, useMemo } from 'react';
import { LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { LuGift, LuHandHeart, LuWallet } from 'react-icons/lu';
import { PiCoinsFill, PiListChecksFill, PiLightningFill } from 'react-icons/pi';
import { TbApiApp } from 'react-icons/tb';
import { replace, useNavigation, useSearchParams } from 'react-router';
import { labelAppName } from '~app-modules/enum-options';
import type { KarsaAppsName } from '~generated/prisma/enums';
import { metaDashboardRoute } from '~app-modules/meta';
import {
	PayloadQueryBalanceUserSchema,
	type PayloadQueryBalanceUser,
} from '~app-modules/schema/balance';
import { dayjs, toPayloadSearchParams } from '~app-modules/utils';
import { actionGetBalanceUser, type ActionGetBalanceUser } from '~app-server/balance';
import { authUserCtx } from '~app-server/context';
import { authGetSession } from '~app-server/session';
import Footer from '~app-ui/layouts/footer';
import { HeaderDashboard } from '~app-ui/layouts/header';
import { DashboardPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/dashboard.usage';

type BalanceActivityWithRelations = {
	id: string;
	type: string;
	token: number;
	tokenBefore: number;
	tokenAfter: number;
	tokenDailyBefore: number;
	tokenDailyAfter: number;
	description: string | null;
	createdAt: Date;
	sender: { id: string; name: string } | null;
	karsa: { app: string } | null;
};

const labelActivityType: Record<string, string> = {
	DAILY_BONUS: 'Bonus Harian',
	GIVEAWAY: 'Hadiah',
	KARSA: 'Penggunaan AI',
	PURCHASE: 'Pembelian Token',
};

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

	const url = new URL(request.url);
	const parsedParams =
		PayloadQueryBalanceUserSchema.safeParse(Object.fromEntries(url.searchParams)).data;

	// Default: filter ke hari ini (sesuai timezone user) kalau tidak ada filter di URL.
	const hasFilterInUrl = Boolean(parsedParams?.activityStartAt && parsedParams?.activityEndAt);
	const today = dayjs(undefined, user.timezone);
	const queryParams: PayloadQueryBalanceUser = hasFilterInUrl
		? (parsedParams as PayloadQueryBalanceUser)
		: {
				activityStartAt: today.startOf('day').toDate(),
				activityEndAt: today.endOf('day').toDate(),
			};

	const userBalance = await actionGetBalanceUser({
		userId: user.id,
		context,
		withActivities: true,
		activityStartAt: queryParams.activityStartAt,
		activityEndAt: queryParams.activityEndAt,
	});

	return {
		user,
		userBalance,
		params: queryParams,
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
		const parsed = PayloadQueryBalanceUserSchema.safeParse(
			Object.fromEntries(searchParams),
		).data;
		const hasFilter = Boolean(parsed?.activityStartAt && parsed?.activityEndAt);

		if (hasFilter) {
			return parsed as PayloadQueryBalanceUser;
		}

		// Default: filter ke hari ini (sesuai timezone user) kalau tidak ada filter di URL.
		const today = dayjs(undefined, loaderData.user.timezone);
		return {
			activityStartAt: today.startOf('day').toDate(),
			activityEndAt: today.endOf('day').toDate(),
		};
	}, [searchParams, loaderData.user.timezone]);

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

	const balance = 'data' in loaderData.userBalance ? loaderData.userBalance.data : null;
	const activities: BalanceActivityWithRelations[] =
		balance && 'activities' in balance && balance.activities
			? (balance.activities as unknown as BalanceActivityWithRelations[])
			: [];
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
					cols={{ base: 2, md: 4 }}
					mb="lg"
				>
					<StatCard
						label="Saldo Token"
						value={balance?.token ?? 0}
						sublabel="Token reguler"
						icon={<PiCoinsFill size={20} />}
						color="teal"
					/>
					<StatCard
						label="Token Harian"
						value={balance?.tokenDaily ?? 0}
						sublabel="Direset tiap hari"
						icon={<LuGift size={20} />}
						color="grape"
					/>
					<StatCard
						label="Total Dipakai"
						value={totalDipakai}
						sublabel={hasActivityFilter ? 'Dalam rentang' : 'Sepanjang waktu'}
						icon={<PiLightningFill size={20} />}
						color="orange"
					/>
					<StatCard
						label="Total Transaksi"
						value={totalTransaksi}
						sublabel={hasActivityFilter ? 'Dalam rentang' : 'Sepanjang waktu'}
						icon={<PiListChecksFill size={20} />}
						color="blue"
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
						Riwayat Transaksi
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
							loaderData.params.activityStartAt
								? dayjs(loaderData.params.activityStartAt, loaderData.user.timezone).toDate()
								: null,
							loaderData.params.activityEndAt
								? dayjs(loaderData.params.activityEndAt, loaderData.user.timezone).toDate()
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
											{activity.type === 'KARSA' && activity.karsa?.app
												? labelAppName[activity.karsa.app as KarsaAppsName]
												: labelActivityType[activity.type]}
										</Text>
										<Badge
											size="xs"
											variant="light"
											color={activity.type === 'KARSA' ? 'orange' : 'green'}
											tt="none"
										>
											{activity.type === 'KARSA' ? '-' : '+'}
											{activity.token}
										</Badge>
										{activity.sender ? (
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
									title={dayjs(activity.createdAt, loaderData.user.timezone).toString()}
								>
									<DataList
										size="xs"
										gap={2}
									>
										<DataList.Item>
											<DataList.ItemLabel>Saldo Harian</DataList.ItemLabel>
											<DataList.ItemValue fw={600}>
												{activity.tokenDailyBefore} → {activity.tokenDailyAfter}
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
										{dayjs(activity.createdAt, loaderData.user.timezone).fromNow()}
									</Text>
								</Stack>
							</Timeline.Item>
						))}
					</Timeline>
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
}: {
	label: string;
	value: number;
	sublabel: string;
	icon: React.ReactNode;
	color: string;
}) {
	return (
		<Box
			p="md"
			bd="1px solid gray.2"
			bdrs="lg"
			bg="white"
		>
			<Group
				justify="space-between"
				mb="xs"
			>
				<Text
					size="xs"
					fw={600}
					c="dimmed"
					tt="uppercase"
				>
					{label}
				</Text>
				<ThemeIcon
					variant="light"
					color={color}
					size="md"
					radius="md"
				>
					{icon}
				</ThemeIcon>
			</Group>
			<Text
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
		</Box>
	);
}
