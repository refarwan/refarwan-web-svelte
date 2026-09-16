export interface UploadCallbacks {
	onProgress: (percent: number) => void;
	onProcessing: () => void;
	onSuccess: () => void;
	onError: (message: string) => void;
}

const parseErrorMessage = (responseText: string): string => {
	try {
		const body = JSON.parse(responseText) as Record<string, unknown>;
		if (typeof body.message === 'string') return body.message;

		const [first] = Object.values(body).filter(
			(value): value is string => typeof value === 'string'
		);
		return first ?? 'Upload failed';
	} catch {
		return 'Upload failed';
	}
};

export const uploadWithProgress = (
	url: string,
	formData: FormData,
	callbacks: UploadCallbacks
): XMLHttpRequest => {
	const request = new XMLHttpRequest();

	request.upload.addEventListener('progress', (event) => {
		if (!event.lengthComputable) return;
		const percent = Math.round((event.loaded / event.total) * 100);
		callbacks.onProgress(Math.min(99, percent));
		if (percent >= 100) callbacks.onProcessing();
	});

	request.addEventListener('load', () => {
		if (request.status >= 200 && request.status < 300) {
			callbacks.onSuccess();
			return;
		}
		callbacks.onError(parseErrorMessage(request.responseText));
	});

	request.addEventListener('error', () => {
		callbacks.onError('Upload failed');
	});

	request.open('POST', url);
	request.send(formData);

	return request;
};
