import {
    Send,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

import useAuth from "../../hooks/useAuth";
import useWorkspace from "../../hooks/useWorkspace";

import {
    createComment,
    subscribeToTaskComments,
} from "../../services/commentService";

import {
    formatRelativeTime,
} from "../../utils/date";

function TaskComments({
    task,
}) {
    const {
        user,
        profile,
    } = useAuth();

    const {
        currentWorkspace,
    } = useWorkspace();

    const [
        comments,
        setComments,
    ] = useState([]);

    const [body, setBody] =
        useState("");

    const [
        commentsError,
        setCommentsError,
    ] = useState("");

    const [
        isSending,
        setIsSending,
    ] = useState(false);

    useEffect(() => {
        const workspaceId =
            currentWorkspace?.id;

        if (!workspaceId) {
            return;
        }

        const unsubscribe =
            subscribeToTaskComments({
                workspaceId,
                taskId:
                    task.id,

                onData: (data) => {
                    setComments(data);
                    setCommentsError("");
                },

                onError: (error) => {
                    console.error(
                        "Comment subscription failed:",
                        error
                    );

                    setCommentsError(
                        "Unable to load comments."
                    );
                },
            });

        return unsubscribe;
    }, [
        currentWorkspace?.id,
        task.id,
    ]);

    async function handleSendComment() {
        const message =
            body.trim();

        if (
            !message ||
            isSending
        ) {
            return;
        }

        try {
            setIsSending(true);
            setCommentsError("");

            await createComment({
                task,
                user,
                profile,
                body: message,
            });

            setBody("");
        } catch (error) {
            console.error(
                "Failed to add comment:",
                error
            );

            setCommentsError(
                "We couldn't add your comment."
            );
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div>
            {commentsError && (
                <div className="mb-4 rounded-control border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {commentsError}
                </div>
            )}

            {comments.length > 0 ? (
                <div className="space-y-5">
                    {comments.map(
                        (comment) => (
                            <div
                                key={comment.id}
                                className="flex gap-3"
                            >
                                <Avatar
                                    name={
                                        comment
                                            .authorSnapshot
                                            ?.displayName ||
                                        "User"
                                    }
                                    src={
                                        comment
                                            .authorSnapshot
                                            ?.photoURL
                                    }
                                    size="md"
                                />

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="text-sm font-medium text-heading">
                                            {comment
                                                .authorSnapshot
                                                ?.displayName ||
                                                "User"}
                                        </p>

                                        <span className="shrink-0 text-xs text-subtle">
                                            {formatRelativeTime(
                                                comment.createdAt
                                            )}
                                        </span>
                                    </div>

                                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-body">
                                        {comment.body}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <div className="rounded-control border border-dashed border-border px-4 py-6 text-center">
                    <p className="text-sm text-muted">
                        No comments yet.
                    </p>

                    <p className="mt-1 text-xs text-subtle">
                        Start the conversation about this task.
                    </p>
                </div>
            )}

            <div className="mt-6">
                <textarea
                    rows={3}
                    value={body}
                    maxLength={2000}
                    onChange={(event) =>
                        setBody(
                            event.target.value
                        )
                    }
                    placeholder="Write a comment..."
                    className="
            w-full resize-none
            rounded-control
            border border-border
            bg-surface
            px-3 py-3
            text-sm text-heading
            outline-none
            placeholder:text-subtle
            focus:border-primary
            focus:ring-2
            focus:ring-primary/15
          "
                />

                <div className="mt-2 flex justify-end">
                    <Button
                        type="button"
                        onClick={
                            handleSendComment
                        }
                        disabled={
                            isSending ||
                            !body.trim()
                        }
                    >
                        <Send size={15} />

                        {isSending
                            ? "Sending..."
                            : "Send Comment"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default TaskComments;