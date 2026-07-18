import type { AnswerLeaf, FAQPageLeaf, QuestionLeaf } from 'schema-dts';
import { pageSchema, type PageSchemaInput } from '~app-modules/seo/page';

export const faqSchema = (
	faqs: readonly {
		title: string;
		content: string;
	}[],
	page: Omit<PageSchemaInput, 'type'>,
): FAQPageLeaf => {
	const mainEntity: QuestionLeaf[] = faqs.map((faq) => {
		const acceptedAnswer: AnswerLeaf = {
			'@type': 'Answer',
			text: faq.content,
		};

		return {
			'@type': 'Question',
			name: faq.title,
			acceptedAnswer,
		};
	});

	return {
		...pageSchema({ ...page, type: 'FAQPage' }),
		'@type': 'FAQPage',
		mainEntity,
	};
};
