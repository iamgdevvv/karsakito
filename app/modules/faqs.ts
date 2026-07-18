export const faqCategories = [
	{
		id: 'tentang',
		label: 'Tentang KarsaKito',
		description: 'Kenali cara kerja dan fokus utama KarsaKito.',
	},
	{
		id: 'layanan',
		label: 'Layanan',
		description: 'Temukan tool dan cara menggunakannya sesuai kebutuhan Anda.',
	},
	{
		id: 'kreator',
		label: 'Kreator',
		description: 'Pahami Workspace dan fitur eksperimental Kreator.',
	},
	{
		id: 'token',
		label: 'Token',
		description: 'Pelajari Token Harian, estimasi Token, dan penggunaannya.',
	},
	{
		id: 'hasil',
		label: 'Hasil dan penggunaan',
		description: 'Gunakan hasil tool dengan tepat untuk pekerjaan Anda.',
	},
	{
		id: 'akun',
		label: 'Akun dan bantuan',
		description: 'Mulai menggunakan KarsaKito dan dapatkan bantuan saat diperlukan.',
	},
] as const;

export type FaqCategoryId = (typeof faqCategories)[number]['id'];

export type PublicFaq = {
	category: FaqCategoryId;
	content: string;
	featured?: boolean;
	title: string;
};

export const publicFaqs: readonly PublicFaq[] = [
	{
		category: 'tentang',
		featured: true,
		title: 'Apa itu KarsaKito?',
		content:
			'KarsaKito adalah ekosistem produktivitas AI untuk Bahasa Nusantara. Pilih tool, isi parameter yang dibutuhkan, lalu gunakan hasilnya sebagai draf untuk pekerjaan Anda.',
	},
	{
		category: 'tentang',
		featured: true,
		title: 'Apakah KarsaKito adalah chatbot?',
		content:
			'Bukan. KarsaKito menggunakan alur kerja terstruktur agar Anda cukup memilih kebutuhan dan mengisi parameter seperti bahasa, tujuan, audiens, atau topik.',
	},
	{
		category: 'tentang',
		title: 'Mengapa KarsaKito menggunakan alur kerja terstruktur?',
		content:
			'Alur kerja membantu Anda menyiapkan konteks penting sejak awal. Isi parameter seperti tujuan, audiens, dan topik agar hasil lebih relevan untuk pekerjaan Anda.',
	},
	{
		category: 'tentang',
		title: 'Siapa yang dapat menggunakan KarsaKito?',
		content:
			'KarsaKito dapat digunakan oleh kreator konten, pelajar, mahasiswa, pendidik, humas, organisasi, UMKM, pelaku ekonomi kreatif, dan masyarakat umum.',
	},
	{
		category: 'tentang',
		title: 'Apakah fokus KarsaKito hanya pelestarian bahasa?',
		content:
			'Tidak. Fokus utama KarsaKito adalah membantu pekerjaan berbasis bahasa menjadi lebih cepat dan terarah. Dukungan untuk Bahasa Nusantara memperluas manfaat tersebut dalam jangka panjang.',
	},
	{
		category: 'layanan',
		featured: true,
		title: 'Apa yang dapat saya lakukan di KarsaKito?',
		content:
			'Anda dapat membuat draf tulisan, menyempurnakan teks, menerjemahkan, merangkum, memparafrasekan, dan menganalisis penggunaan bahasa melalui tool yang tersedia.',
	},
	{
		category: 'layanan',
		featured: true,
		title: 'Bagaimana cara menggunakan tool?',
		content:
			'Pilih tool yang sesuai, isi parameter yang diminta, lalu buat hasil. Setiap tool dirancang untuk membantu Anda memulai dengan konteks yang lebih jelas.',
	},
	{
		category: 'layanan',
		title: 'Tool mana yang sebaiknya saya pilih?',
		content:
			'Pilih berdasarkan hasil yang ingin Anda capai. Gunakan tool penulisan untuk membuat draf, penerjemahan untuk mengalihbahasakan teks, analisis untuk meninjau penggunaan bahasa, serta parafrasa atau rangkuman untuk mengolah teks yang sudah ada.',
	},
	{
		category: 'layanan',
		title: 'Mengapa saya perlu mengisi parameter?',
		content:
			'Parameter membantu tool memahami kebutuhan Anda. Semakin jelas tujuan, audiens, topik, atau gaya yang diisi, semakin mudah Anda memperoleh draf yang sesuai konteks.',
	},
	{
		category: 'layanan',
		title: 'Apakah setiap tool memiliki pilihan bahasa yang sama?',
		content:
			'Tidak selalu. Setiap tool menampilkan pilihan bahasa dan parameter yang sesuai dengan kebutuhannya. Periksa pilihan yang tersedia sebelum membuat hasil.',
	},
	{
		category: 'layanan',
		title: 'Apakah KarsaPedia dan KarsaLingo sudah dapat digunakan?',
		content:
			'Belum. KarsaPedia dan KarsaLingo masih dalam pengembangan dan belum menjadi tool aktif di KarsaKito.',
	},
	{
		category: 'kreator',
		featured: true,
		title: 'Apa itu Kreator?',
		content:
			'Kreator adalah fitur Workspace eksperimental untuk mencoba beberapa tool dalam satu ruang kerja. Fitur ini terus disempurnakan berdasarkan kebutuhan penggunaan.',
	},
	{
		category: 'kreator',
		title: 'Apa perbedaan mode Sederhana dan Kreator?',
		content:
			'Mode Sederhana membantu Anda fokus pada satu tool. Kreator memungkinkan Anda mengatur beberapa Window dalam satu Workspace untuk mencoba alur kerja yang lebih luas.',
	},
	{
		category: 'kreator',
		title: 'Apa itu Window?',
		content:
			'Window adalah tool yang dibuka di dalam Workspace. Di mode Kreator, Anda dapat menambahkan beberapa Window untuk menjalankan kebutuhan yang berbeda.',
	},
	{
		category: 'kreator',
		title: 'Apakah pengaturan Kreator dapat disimpan?',
		content:
			'Belum. Penyimpanan Workspace dan Window masih disiapkan, sehingga pengaturan Kreator belum dapat disimpan untuk digunakan kembali.',
	},
	{
		category: 'kreator',
		title: 'Kapan sebaiknya saya menggunakan Kreator?',
		content:
			'Gunakan Kreator saat Anda ingin mencoba lebih dari satu tool atau menata beberapa kebutuhan dalam satu Workspace. Untuk satu kebutuhan sederhana, mode Sederhana dapat membantu Anda mulai lebih cepat.',
	},
	{
		category: 'token',
		featured: true,
		title: 'Bagaimana Token Harian bekerja?',
		content:
			'Bonus Harian mengisi saldo Token Harian hingga 100 Token setiap pukul 00.00 sesuai timezone akun Anda. Token Harian digunakan lebih dahulu saat memakai tool.',
	},
	{
		category: 'token',
		title: 'Apa yang terjadi jika Token Harian belum habis?',
		content:
			'Setiap pukul 00.00, Bonus Harian mengisi kembali saldo Token Harian hingga 100 Token. Saldo Token Harian tidak bertambah melampaui batas tersebut.',
	},
	{
		category: 'token',
		title: 'Apa bedanya Token KarsaKito dan token AI?',
		content:
			'Token KarsaKito adalah mata uang internal aplikasi untuk memakai fitur. Token ini bukan token API AI dan tidak menunjukkan biaya layanan AI di belakang layar.',
	},
	{
		category: 'token',
		featured: true,
		title: 'Apakah Token sudah dapat dibeli?',
		content:
			'Pembelian Token masih disiapkan. Halaman estimasi Token saat ini hanya menampilkan perkiraan agar Anda dapat menghitung kebutuhan Token.',
	},
	{
		category: 'token',
		title: 'Berapa estimasi harga Token?',
		content:
			'Estimasi saat ini adalah Rp50 per Token. Nilai pada halaman estimasi belum merupakan harga final karena pembelian Token belum tersedia.',
	},
	{
		category: 'token',
		title: 'Apakah Token memiliki masa berlaku?',
		content:
			'Token tidak memiliki masa berlaku. Token Harian mengikuti aturan harian dan diisi kembali hingga 100 Token sesuai timezone akun Anda.',
	},
	{
		category: 'token',
		title: 'Apakah KarsaKito menggunakan langganan?',
		content:
			'Tidak ada langganan untuk menggunakan Token. Anda dapat memakai Token Harian, sementara pembelian Token masih disiapkan untuk kebutuhan tambahan.',
	},
	{
		category: 'hasil',
		featured: true,
		title: 'Apakah hasil AI dapat langsung digunakan?',
		content:
			'Hasil AI dapat membantu Anda memulai lebih cepat. Tinjau dan sesuaikan kembali hasilnya sebelum digunakan, terutama untuk kebutuhan resmi atau publikasi.',
	},
	{
		category: 'hasil',
		title: 'Bagaimana jika hasil belum sesuai kebutuhan?',
		content:
			'Perjelas atau ubah parameter yang Anda isi, seperti tujuan, audiens, topik, atau gaya. Buat hasil baru, lalu pilih dan sesuaikan draf yang paling membantu.',
	},
	{
		category: 'hasil',
		title: 'Bolehkah hasil digunakan untuk dokumen resmi?',
		content:
			'Gunakan hasil sebagai bahan awal. Periksa kembali fakta, nada bahasa, istilah, dan kesesuaiannya dengan kebijakan atau kebutuhan institusi sebelum dipublikasikan.',
	},
	{
		category: 'hasil',
		title: 'Apakah KarsaKito menjamin hasil selalu tepat?',
		content:
			'Tidak. Kualitas hasil bergantung pada konteks yang Anda masukkan dan tetap perlu ditinjau oleh pengguna. KarsaKito membantu menyiapkan draf, bukan menggantikan pertimbangan Anda.',
	},
	{
		category: 'akun',
		title: 'Apakah saya perlu akun untuk menggunakan tool?',
		content:
			'Anda dapat membaca informasi publik tanpa akun. Buat atau masuk ke akun untuk menggunakan Workspace dan menjalankan tool.',
	},
	{
		category: 'akun',
		featured: true,
		title: 'Bagaimana cara menghubungi Kito?',
		content:
			'Kirim pertanyaan, masukan, atau kebutuhan Anda ke info@karsakito.web.id. Sertakan konteks singkat agar Kito dapat memahami kebutuhan Anda.',
	},
	{
		category: 'akun',
		title: 'Apa yang dapat saya lakukan jika mengalami kendala akun?',
		content:
			'Periksa kembali email dan kata sandi yang digunakan. Jika kendala berlanjut, hubungi Kito melalui info@karsakito.web.id dengan menjelaskan masalah yang Anda temui.',
	},
	{
		category: 'akun',
		title: 'Apakah saya dapat mengubah profil dan kata sandi?',
		content:
			'Ya. Setelah masuk, buka Dashboard untuk memperbarui profil atau mengubah kata sandi akun Anda.',
	},
];

export function getPublicFaqs(
	categories?: readonly FaqCategoryId[],
	options?: { featuredOnly?: boolean },
): readonly PublicFaq[] {
	const faqs = categories?.length
		? publicFaqs.filter((faq) => categories.includes(faq.category))
		: publicFaqs;

	return options?.featuredOnly ? faqs.filter((faq) => faq.featured) : faqs;
}
