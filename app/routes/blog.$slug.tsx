import { useParams } from 'react-router';

export default function BlogDetail() {
	const { slug } = useParams();

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold">Membaca Artikel: {slug}</h1>
		</div>
	);
}
