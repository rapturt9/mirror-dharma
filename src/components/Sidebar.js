import Link from 'next/link'

const Sidebar = ({ entries }) => (
	<aside className="w-30 pl-4 mr-2">
		<h2 className="text-2xl font-bold mb-4">Articles</h2>
		<ul className="space-y-4">
			{entries.map(entry => (
				<li key={entry.digest}>
					<Link href={`/${entry.transaction}`}>
						<a className="text-gray-900 dark:text-gray-200 text-xl font-medium">{entry.title}</a>
					</Link>
				</li>
			))}
		</ul>
	</aside>
)

export default Sidebar
