import * as IPFS from 'ipfs'
import { forEach } from './asyncTools'

let ipfsInstance: IPFS.IPFS;

export async function initIPFS() {
	ipfsInstance = await IPFS.create();
	const version = await ipfsInstance.version()
	console.log('IPFS Version:', version.version);
}

export async function cleanupIPFS() {
	await ipfsInstance?.stop();
}

export async function resolveResourceIPFS(cid: string) {
	const files = []
	forEach(ipfsInstance.get(cid), (file) => {

		if (!file.content) return;
		const content = []
		
		forEach(file.content, (chunk) => {
			content.push(chunk)
		})
		
		files.push(content)
	})
	return files
}

export async function saveResourceIPFS(data: Uint8Array, pin = true) {
	const { cid } = await ipfsInstance.add(data)
	if(pin) {
		return (await ipfsInstance.pin.add(cid)).toString()
	}
	return cid.toString()
}