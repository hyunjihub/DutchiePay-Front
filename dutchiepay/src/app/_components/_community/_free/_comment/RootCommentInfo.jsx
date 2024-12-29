import CommentInfo from './CommentInfo';
import ReplyEditForm from './ReplyEditForm';
import { useState } from 'react';

export default function RootCommentInfo({
  item,
  refreshComments,
  setIsReplyActive,
  isReplyActive,
}) {
  const [isDeleted, setIsDeleted] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  return (
    <>
      <CommentInfo
        item={item}
        refreshComments={refreshComments}
        setIsEdit={setIsEdit}
        setIsDeleted={setIsDeleted}
        setIsReplyActive={setIsReplyActive}
        isReplyActive={isReplyActive}
      />
      {isEdit ? (
        <ReplyEditForm
          commentId={item.commentId}
          item={item}
          setIsEdit={setIsEdit}
          refreshComments={refreshComments}
        />
      ) : (
        <span className="text-sm px-[12px]">{item.contents}</span>
      )}
    </>
  );
}
