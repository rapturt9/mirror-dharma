'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getExcerpt } from '@/utils/excerpt'
import { components } from '@/utils/markdown'
import { format as timeago } from 'timeago.js'
import LinkButton from '@/components/LinkButton'
import { getPublication } from '@/data/publication'
import ImageSizesContext from '@/context/image_sizes'
import { getEntries } from '@/data/entries'
import { useState, useEffect } from 'react'

function formatBody(body) {
	let bodyLines = body.split('\n')

	try {
		if (bodyLines[bodyLines.length - 1].startsWith('https://embed.0xecho.com')) {
			bodyLines.pop()
		}
		if (bodyLines[bodyLines.length - 2].startsWith('https://embed.0xecho.com')) {
			bodyLines.pop()
			bodyLines.pop()
		}
	} catch (error) {
		console.error(error)
	}

	return bodyLines.join('\n')
}
const Index = ({ entries, publication }) => {
	const [screenSize, setScreenSize] = useState(null)

	function getCurrentDimension() {
		if (typeof window === 'undefined') return null
		return {
			width: window.innerWidth,
			height: window.innerHeight,
		}
	}

	useEffect(() => {
		const handleResize = () => {
			setScreenSize(getCurrentDimension())
		}
		// Trigger the initial resize
		handleResize()
		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	// Don't render until screenSize is determined
	if (!screenSize) {
		return null
	}

	return (
		<div className="flex">
			{screenSize && screenSize.width > 1100 && (
				<div className="absolute left-0 top-0">
					<aside className="pl-4 mr-2" style={{ width: `${Math.min(screenSize.width / 2 - 390, 500)}px`, marginTop: '72px' }}>
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
				</div>
			)}
			<div className="flex-1 space-y-32 max-w-3xl mx-auto px-4 sm:px-3">
				{' '}
				{/* Updated to flex layout */}
				{entries.map(entry => (
					<article key={entry.digest}>
						<div className="flex items-center">
							<Link href={`/${entry.transaction}`}>
								<a className="text-gray-900 dark:text-gray-200 text-3xl sm:text-5xl font-bold">{entry.title}</a>
							</Link>
							<div className="flex items-center ml-4">
								<time dateTime={new Date(entry.timestamp * 1000)} className="block bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5 font-medium text-sm text-gray-400 dark:text-gray-500 truncate">
									{timeago(entry.timestamp * 1000)}
								</time>
							</div>
						</div>

						<div className="prose lg:prose-lg dark:prose-dark mb-8 mt-4">
							<ImageSizesContext.Provider value={entry.image_sizes}>
								<ReactMarkdown renderers={components} allowDangerousHtml={true}>
									{getExcerpt(formatBody(entry.body))}
								</ReactMarkdown>
							</ImageSizesContext.Provider>
						</div>
						{formatBody(entry.body).split('\n\n').length > 4 && <LinkButton href={`/${entry.transaction}`}>Continue Reading</LinkButton>}
					</article>
				))}
				{entries.length === 0 && (
					<div className="absolute inset-0 flex items-center justify-center h-full">
						<p className="text-gray-400 dark:text-gray-600 font-medium">Patience</p>
					</div>
				)}
			</div>
		</div>
	)
}

// Remaining code stays the same

// Remaining code stays the same

export async function getStaticProps() {
	const [publication, entries] = await Promise.all([getPublication(), getEntries()])

	return {
		props: {
			publication,
			entries,
		},
		revalidate: 5 * 60, // refresh page index every 5 minutes
	}
}

export default Index
