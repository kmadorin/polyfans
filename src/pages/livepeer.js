import { useAsset } from '@livepeer/react';
import { Player } from '@livepeer/react';

export default function LivepeerPage() {
	const asset = useAsset({ assetId: 'd8e8b87d-6774-4083-a2d7-4e85872d18cd' });
	console.log('asset: ', asset);

	return (
		<div>
			<Player
	      title="Agent 327: Operation Barbershop"
	      playbackId="6d7el73r1y12chxr"
	      showPipButton
	      objectFit="cover"
	      priority
	    />
		</div>
	)
}