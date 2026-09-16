import { beforeNavigate } from '$app/navigation';

/** Warns before an in-app navigation or a tab close/reload while `isDirty()` is true. */
export const useUnsavedChangesGuard = (
	isDirty: () => boolean,
	confirmMessage: () => string
): void => {
	beforeNavigate(({ cancel }) => {
		if (isDirty() && !confirm(confirmMessage())) cancel();
	});

	$effect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (isDirty()) event.preventDefault();
		};
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	});
};
