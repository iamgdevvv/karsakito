import {
	Alert,
	Badge,
	Center,
	DataList,
	Group,
	Loader,
	Stack,
	Text,
	Timeline,
	Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useCallback, useMemo } from 'react';
import { LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { LuGift, LuHandHeart } from 'react-icons/lu';
import { TbApiApp } from 'react-icons/tb';
import { replace, useNavigation, useSearchParams } from 'react-router';
import { labelAppName, labelUserRole } from '~app-modules/enum-options';
import { metaAdminRoute } from '~app-modules/meta';
import {
	PayloadQueryBalanceUserSchema,
	type PayloadQueryBalanceUser,
} from '~app-modules/schema/balance';
import { dayjs, toPayloadSearchParams } from '~app-modules/utils';
import { authUserCtx } from '~app-server/context';
import { authMiddlewareSession } from '~app-server/session';
import { actionGetUser } from '~app-server/user';
import { messageActionError } from '~app-server/utils';
import { ButtonLink } from '~app-ui/components/link';
import Footer from '~app-ui/layouts/footer';
import { HeaderAdmin } from '~app-ui/layouts/header';
import { AdminPanel } from '~app-ui/layouts/panel';

import type { Route } from './+types/admin.users.$id.balance._index';

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
	const authSession = await authMiddlewareSession({
		guard: {
			role: ['ADMIN'],
		},
		request,
	});

	if ('error' in authSession) {
		const redirectParams = new URLSearchParams();
		redirectParams.set('errorMessage', messageActionError(authSession));

		throw replace(`/?${redirectParams.toString()}`);
	}

	context.set(authUserCtx, authSession.user);
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export async function loader({ request, context, params }: Route.LoaderArgs) {
	const user = context.get(authUserCtx)!;

	const recordUser = await actionGetUser({
		userId: params.id,
		withBalance: true,
		request,
		context,
	});

	if (!recordUser.data) {
		throw replace('/');
	}

	return {
		user,
		result: recordUser,
	};
}

export function meta({ loaderData }: Route.MetaArgs) {
	return metaAdminRoute({
		title: `Balance User ${loaderData.result.data.name}`,
	});
}

export default function BalanceUserAdminRoute({ loaderData }: Route.ComponentProps) {
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

	return (
		<div className="site">
			<HeaderAdmin authUser={loaderData.user} />
			<AdminPanel
				authUser={loaderData.user}
				className="site-main"
			>
				<Title mb="lg">Balance User</Title>
				<DataList>
					<DataList.Item>
						<DataList.ItemLabel>Name</DataList.ItemLabel>
						<DataList.ItemValue>{loaderData.result.data.name}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Email</DataList.ItemLabel>
						<DataList.ItemValue>{loaderData.result.data.email}</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Role</DataList.ItemLabel>
						<DataList.ItemValue>
							{labelUserRole[loaderData.result.data.role]}
						</DataList.ItemValue>
					</DataList.Item>
					<DataList.Item>
						<DataList.ItemLabel>Status</DataList.ItemLabel>
						<DataList.ItemValue>
							{loaderData.result.data.isActive ? (
								<Badge
									size="md"
									variant="light"
									color="green"
									tt="none"
									fw={500}
								>
									Active
								</Badge>
							) : (
								<Badge
									size="md"
									variant="light"
									color="red"
									tt="none"
									fw={500}
								>
									Inactive
								</Badge>
							)}
						</DataList.ItemValue>
					</DataList.Item>
					{loaderData.result.data.balances ? (
						<>
							<DataList.Item>
								<DataList.ItemLabel>Token</DataList.ItemLabel>
								<DataList.ItemValue>
									{loaderData.result.data.balances.token}
								</DataList.ItemValue>
							</DataList.Item>
							<DataList.Item>
								<DataList.ItemLabel>Token Daily</DataList.ItemLabel>
								<DataList.ItemValue>
									{loaderData.result.data.balances.tokenDaily}
								</DataList.ItemValue>
							</DataList.Item>
						</>
					) : null}
				</DataList>

				<Group
					mt="xl"
					mb="lg"
				>
					<Title
						order={2}
						fz="xl"
					>
						Balance Activity
					</Title>
					<Group
						gap="xs"
						ml="auto"
					>
						<ButtonLink
							to={`/admin/users/${loaderData.result.data.id}/balance/update`}
							variant="light"
							size="sm"
							fz="xs"
							radius="md"
						>
							Adjust Balance
						</ButtonLink>
						<DatePickerInput
							type="range"
							size="sm"
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
											message: 'Invalid date range',
										});
									}
								}
							}}
						/>
					</Group>
				</Group>
				{navigation.state === 'loading' ? (
					<Center>
						<Loader />
					</Center>
				) : loaderData.result.data.balances &&
				  'activities' in loaderData.result.data.balances ? (
					loaderData.result.data.balances.activities.length ? (
						<Timeline
							active={loaderData.result.data.balances.activities.length}
							lineWidth={2}
							bulletSize={24}
						>
							{loaderData.result.data.balances.activities.map((activity, index) => (
								<Timeline.Item
									key={`${activity.type}-${index}`}
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
										<Text
											span
											size="sm"
											fw={700}
										>
											{activity.type}
											{activity.type === 'KARSA' && activity.karsa?.app
												? ` (${labelAppName[activity.karsa.app]})`
												: ''}
										</Text>
									}
								>
									<Stack
										gap={4}
										title={dayjs(
											activity.createdAt,
											loaderData.user.timezone,
										).toString()}
									>
										<DataList
											size="xs"
											gap={2}
										>
											<DataList.Item>
												<DataList.ItemLabel>Token</DataList.ItemLabel>
												<DataList.ItemValue
													fw={700}
													c={activity.type === 'KARSA' ? 'red' : 'green'}
												>
													{activity.type === 'KARSA' ? '-' : '+'}
													{activity.token}
												</DataList.ItemValue>
											</DataList.Item>
											<DataList.Item>
												<DataList.ItemLabel>
													Token Before
												</DataList.ItemLabel>
												<DataList.ItemValue>
													{activity.tokenBefore}
												</DataList.ItemValue>
											</DataList.Item>
											<DataList.Item>
												<DataList.ItemLabel>Token After</DataList.ItemLabel>
												<DataList.ItemValue>
													{activity.tokenAfter}
												</DataList.ItemValue>
											</DataList.Item>
											<DataList.Item>
												<DataList.ItemLabel>
													Token Daily Before
												</DataList.ItemLabel>
												<DataList.ItemValue>
													{activity.tokenDailyBefore}
												</DataList.ItemValue>
											</DataList.Item>
											<DataList.Item>
												<DataList.ItemLabel>
													Token Daily After
												</DataList.ItemLabel>
												<DataList.ItemValue>
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
					) : (
						<Text
							c="dimmed"
							ta="center"
						>
							Balance Activity not found
						</Text>
					)
				) : (
					<Alert
						color="red"
						title="Error"
					>
						Balance Activity failed to load
					</Alert>
				)}
			</AdminPanel>
			<Footer />
		</div>
	);
}
