import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import { useState } from "react";

import { IconActionButton } from "@/components/buttons/IconActionButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { AppAlert } from "@/components/feedback/AppAlert";
import { getErrorMessage } from "@/utils/errorUtils";

import { useAlbumComments } from "../hooks/useAlbumComments";
import { useDeleteAlbumComment } from "../hooks/useDeleteAlbumComment";
import { usePostAlbumComment } from "../hooks/usePostAlbumComment";

interface AlbumCommentsProps {
  albumId: string;
  // Only the couple viewing their own shared album can delete comments;
  // public visitors can read and post but not moderate.
  canModerate?: boolean;
}

export function AlbumComments({
  albumId,
  canModerate = false,
}: AlbumCommentsProps) {
  const commentsQuery = useAlbumComments(albumId);
  const postComment = usePostAlbumComment(albumId);
  const deleteComment = useDeleteAlbumComment(albumId);

  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");

  const comments = commentsQuery.data ?? [];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!authorName.trim() || !body.trim()) {
      return;
    }
    postComment.mutate(
      { authorName: authorName.trim(), body: body.trim() },
      { onSuccess: () => setBody("") },
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments {comments.length > 0 ? `(${comments.length})` : ""}
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        {comments.length === 0 ? (
          <Typography variant="body2" color="textSecondary">
            No comments yet.
          </Typography>
        ) : (
          comments.map((comment) => (
            <Stack
              key={comment.id}
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "flex-start" }}
            >
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
                  <Typography variant="subtitle2">
                    {comment.author_name}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {dayjs(comment.created_at).format("MMM D, YYYY")}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  {comment.body}
                </Typography>
              </Box>
              {canModerate ? (
                <IconActionButton
                  label="Delete comment"
                  size="small"
                  onClick={() => deleteComment.mutate(comment.id)}
                >
                  <DeleteRoundedIcon fontSize="small" />
                </IconActionButton>
              ) : null}
            </Stack>
          ))
        )}
      </Stack>

      {postComment.isError ? (
        <AppAlert severity="error" sx={{ mb: 2 }}>
          {getErrorMessage(postComment.error)}
        </AppAlert>
      ) : null}

      <Stack component="form" onSubmit={handleSubmit} spacing={1.5}>
        <TextField
          label="Your name"
          size="small"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 80 } }}
        />
        <TextField
          label="Add a comment"
          size="small"
          multiline
          minRows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 2000 } }}
        />
        <PrimaryButton
          type="submit"
          isLoading={postComment.isPending}
          disabled={!authorName.trim() || !body.trim()}
          sx={{ alignSelf: "flex-start" }}
        >
          Post comment
        </PrimaryButton>
      </Stack>
    </Box>
  );
}
