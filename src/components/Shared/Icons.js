import Icon from '@ant-design/icons';

const FollowSvg = () => (
	<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M20 0H0V20H20V0Z" fill="white" fillOpacity="0.01"/>
		<path
			d="M5.83333 14.1667C6.98393 14.1667 7.91667 13.2339 7.91667 12.0833C7.91667 10.9327 6.98393 10 5.83333 10C4.68274 10 3.75 10.9327 3.75 12.0833C3.75 13.2339 4.68274 14.1667 5.83333 14.1667Z"
			stroke="#ABADBA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
		/>
		<path
			d="M14.1667 14.1667C15.3173 14.1667 16.25 13.2339 16.25 12.0833C16.25 10.9327 15.3173 10 14.1667 10C13.0161 10 12.0834 10.9327 12.0834 12.0833C12.0834 13.2339 13.0161 14.1667 14.1667 14.1667Z"
			stroke="#ABADBA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
		/>
		<path
			d="M9.99996 5.83329C11.1506 5.83329 12.0833 4.90055 12.0833 3.74996C12.0833 2.59937 11.1506 1.66663 9.99996 1.66663C8.84937 1.66663 7.91663 2.59937 7.91663 3.74996C7.91663 4.90055 8.84937 5.83329 9.99996 5.83329Z"
			stroke="#ABADBA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
		/>
		<path
			d="M9.99996 18.3333C9.99996 16.0321 8.13446 14.1666 5.83329 14.1666C3.53211 14.1666 1.66663 16.0321 1.66663 18.3333"
			stroke="#ABADBA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
		/>
		<path
			d="M18.3333 18.3333C18.3333 16.0321 16.4678 14.1666 14.1667 14.1666C11.8655 14.1666 10 16.0321 10 18.3333"
			stroke="#ABADBA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
		/>
		<path
			d="M14.1667 10C14.1667 7.69887 12.3012 5.83337 10 5.83337C7.69887 5.83337 5.83337 7.69887 5.83337 10"
			stroke="#ABADBA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
		/>
	</svg>
);

export const FollowIcon = (props) => (
	<Icon component={FollowSvg} {...props} />
);

const ImageFileSvg = () => {
	return (<svg
		width={22}
		height={22}
		viewBox="0 0 22 22"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M19.333 1H2.667C1.747 1 1 1.746 1 2.667v16.666C1 20.253 1.746 21 2.667 21h16.666c.92 0 1.667-.746 1.667-1.667V2.667C21 1.747 20.254 1 19.333 1Z"
			stroke="#935CF6"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M7.667 10.444a2.778 2.778 0 1 0 0-5.555 2.778 2.778 0 0 0 0 5.555ZM13.106 12.233a1.111 1.111 0 0 1 1.801.03l4.875 6.99A1.111 1.111 0 0 1 18.871 21H6.556l6.55-8.767Z"
			stroke="#935CF6"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>)
}

export const ImageFileIcon = (props) => (
	<Icon component={ImageFileSvg} {...props} />
);

const VideoFileSvg = () => {
	return (<svg
		width={22}
		height={22}
		viewBox="0 0 22 22"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M19.333 1H2.667C1.747 1 1 1.746 1 2.667v16.666C1 20.253 1.746 21 2.667 21h16.666c.92 0 1.667-.746 1.667-1.667V2.667C21 1.747 20.254 1 19.333 1Z"
			stroke="#935CF6"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M9.056 13.202V9.854l2.916 1.684 2.917 1.684-2.917 1.684-2.916 1.684v-3.368ZM1 6h20M16 1l-3.334 5M9.333 1 6 6"
			stroke="#935CF6"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>)
}

export const VideoFileIcon = (props) => (
	<Icon component={VideoFileSvg} {...props} />
);


const AudioFileSvg = () => {
	return (<svg
			width={22}
			height={22}
			viewBox="0 0 22 22"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1 5.444v-1.11A3.333 3.333 0 0 1 4.333 1h13.334A3.333 3.333 0 0 1 21 4.333v1.111M15.444 7.667v6.666M19.89 8.778v4.444M11 6v10M6.556 7.667v6.666M2.11 8.778v4.444M1 16.555v1.112A3.333 3.333 0 0 0 4.333 21h13.334A3.333 3.333 0 0 0 21 17.667v-1.112"
				stroke="#935CF6"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

export const AudioFileIcon = (props) => (
	<Icon component={AudioFileSvg} {...props} />
);

const CommentsSvg = () => {
	return (<svg
			width={20}
			height={18}
			viewBox="0 0 20 18"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M14.05 15.4H9.1v-3.6h6.3V8.2H19v7.2h-2.25l-1.35 1.35-1.35-1.35Z"
				stroke="#935CF6"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M1 1h14.4v10.8H6.85l-1.8 1.8-1.8-1.8H1V1Z"
				stroke="#935CF6"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M4.6 8.2h2.7M4.6 4.6H10"
				stroke="#935CF6"
				strokeWidth={2}
				strokeLinecap="round"
			/>
		</svg>
	)
}

export const CommentsIcon = (props) => (
	<Icon component={CommentsSvg} {...props} />
);

const LockSvg = () => {
	return (<svg
			width={26}
			height={36}
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 26 36"
		>
			<path
				d="M13 34.842c6.511 0 11.79-5.278 11.79-11.79 0-6.51-5.279-11.789-11.79-11.789-6.511 0-11.79 5.278-11.79 11.79 0 6.51 5.279 11.79 11.79 11.79Z"
				stroke="#fff"
				strokeWidth={2}
			/>
			<path
				d="M18.895 12.947V7.053a5.895 5.895 0 0 0-11.79 0v5.894"
				stroke="#fff"
				strokeWidth={2}
				strokeLinejoin="round"
			/>
			<path
				d="M13 19.684v6.737"
				stroke="#fff"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

export const LockIcon = (props) => (
	<Icon component={LockSvg} {...props} />
);
