import Link from 'next/link'
import Head from 'next/head'
import ThemeContext from '@/context/theme'

const Layout = ({ publication, children }) => {
	if (publication.theme.colorMode === 'DARK' && typeof document !== 'undefined') document.body.classList.add('dark')

	return (
		<>
			<Head>
				<title>{publication.displayName || 'Dharma Essays'}</title>
				<meta name="og:title" content={`${publication.displayName} — Mirror`} />
				{publication.description && (
					<>
						<meta name="description" content={publication.description} />
						<meta name="og:description" content={publication.description} />
					</>
				)}
				<link rel="icon" href="/logo.ico" />
				<meta name="twitter:card" content="summary" />
				<meta name="og:image" content="/logo.png" />
				<meta name="twitter:image" content="/logo.png" />
				<link rel="alternate" type="application/rss+xml" title={publication.displayName || 'Dharma Essays'} href="/feed.xml" />
			</Head>
			<ThemeContext.Provider value={{ theme: publication.theme.colorMode === 'DARK' ? 'dark' : 'light', accentColor: publication.theme.accent.toLowerCase() }}>
				<div className={publication.theme.colorMode === 'DARK' ? 'dark' : ''}>
					<div className="dark:bg-gray-900 min-h-screen">
						<header className="p-4">
							<Link href="/">
								<a className="flex items-center space-x-4">
									<div>
										<div className="flex items-center space-x-2">
											<p className="black dark:text-gray-600 pb-0.5">Dharma Essays</p>
										</div>
									</div>
								</a>
							</Link>
						</header>
						<main>{children}</main>
					</div>
				</div>
			</ThemeContext.Provider>
		</>
	)
}

export default Layout
