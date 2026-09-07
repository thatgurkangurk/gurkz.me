import { useEffect } from "react";
import { atom, useAtom, getDefaultStore } from "jotai";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#lib/components/ui/alert-dialog.js";
import { Input } from "#lib/components/ui/input.js";
import { Spinner } from "#lib/components/ui/spinner.js";

export type ConfirmDeleteOptions = {
    title: string;
    description: string;
    skipConfirmation?: boolean;
    input?: {
        confirmationText: string;
    };
    confirm?: {
        text?: string;
    };
    cancel?: {
        text?: string;
    };
    onConfirm: () => Promise<unknown>;
    onCancel?: () => void;
};

type DialogState = {
    open: boolean;
    inputText: string;
    options: ConfirmDeleteOptions | null;
    loading: boolean;
};

const INITIAL_STATE: DialogState = {
    open: false,
    inputText: "",
    options: null,
    loading: false,
};

const confirmDialogAtom = atom<DialogState>(INITIAL_STATE);

export function confirmDelete(options: ConfirmDeleteOptions) {
    if (options.skipConfirmation) {
        options.onConfirm();
        return;
    }

    const store = getDefaultStore();
    store.set(confirmDialogAtom, {
        open: true,
        inputText: "",
        options,
        loading: false,
    });
}

export function ConfirmDeleteDialog() {
    const [state, setState] = useAtom(confirmDialogAtom);
    const { open, inputText, options, loading } = state;

    useEffect(() => {
        const forceClose = () => setState(INITIAL_STATE);

        if (import.meta.hot) {
            import.meta.hot.on("vite:beforeUpdate", forceClose);
            return () => {
                try {
                    import.meta.hot?.off("vite:beforeUpdate", forceClose);
                } catch (e) {
                    // Ignore cleanup errors on unmount
                }
            };
        }

        // @ts-ignore
        if (typeof module !== "undefined" && module.hot) {
            // @ts-ignore
            module.hot.addStatusHandler((status) => {
                if (status === "prepare") forceClose();
            });
        }
    }, [setState]);

    const handleConfirm = () => {
        if (options?.input) {
            if (inputText !== options.input.confirmationText) {
                return;
            }
        }

        setState((prev) => ({ ...prev, loading: true }));

        options
            ?.onConfirm()
            .then(() => {
                setState((prev) => ({ ...prev, open: false }));
            })
            .finally(() => {
                setState((prev) => ({ ...prev, loading: false }));
            });
    };

    const handleCancel = () => {
        options?.onCancel?.();
        setState((prev) => ({ ...prev, open: false }));
    };

    if (!open && !loading && !options) {
        return null;
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) handleCancel();
            }}
        >
            <AlertDialogContent>
                <form
                    method="POST"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleConfirm();
                    }}
                    className="flex flex-col gap-4"
                >
                    <AlertDialogHeader>
                        <AlertDialogTitle>{options?.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {options?.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {options?.input && (
                        <Input
                            value={inputText}
                            onChange={(e) =>
                                setState((prev) => ({
                                    ...prev,
                                    inputText: e.target.value,
                                }))
                            }
                            placeholder={`Enter "${options.input.confirmationText}" to confirm.`}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleConfirm();
                                }
                            }}
                        />
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel type="button" onClick={handleCancel}>
                            {options?.cancel?.text ?? "Cancel"}
                        </AlertDialogCancel>

                        <AlertDialogAction
                            type="submit"
                            variant="destructive"
                            disabled={
                                loading ||
                                (!!options?.input &&
                                    inputText !==
                                        options.input.confirmationText)
                            }
                        >
                            {loading ? (
                                <Spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {options?.confirm?.text ?? "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
