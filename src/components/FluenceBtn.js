import {Button} from 'antd';
import {useContext, useEffect} from "react";
import FluenceContext from "./utils/FluenceContext";
import {put} from '../compiled-aqua/ipfs';


export default function FluenceBtn() {
	const Fluence = useContext(FluenceContext);
	// console.log(`###: Fluence`, Fluence);

	async function onUpload() {
		// @ts-ignore
		console.log('###: Fluence status onUpload: ', Fluence?.getStatus());
	}

	return <Button type="primary" onClick={onUpload}>Connect to Fluence</Button>
}
