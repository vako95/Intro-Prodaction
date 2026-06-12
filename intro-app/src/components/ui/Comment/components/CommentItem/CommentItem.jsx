import "./CommentItem.css";
import { HoverButton } from "@components/ui";
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { HotelRating } from "@components/ui";
import { LiaReplySolid } from "react-icons/lia";
import { MdEdit, MdDelete } from "react-icons/md";
import dayjs from "dayjs";
import { useUpdateCommentMutation, useDeleteCommentMutation } from "@/hooks/useComments";
import { useToast } from "@components/ui/Toast";
import { useProfile } from "@/hooks/useAPI";
import { useLang } from "@hooks/useLang";
import { AuthService } from "../../../../../services/auth";

const CommentItem = ({ item, onReply }) => {
    const [isOpen, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(item.message);
    const { toast } = useToast();
    const { getTranslate } = useLang();
    const { query: profileQuery } = useProfile();
    const currentUser = profileQuery.data?.data;
    const isAuthenticated = AuthService.isAuthenticated();
    
    const updateMutation = useUpdateCommentMutation();
    const deleteMutation = useDeleteCommentMutation();

    const handleToggle = () => {
        setOpen((prev) => !prev);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditText(item.message);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditText(item.message);
    };

    const handleSaveEdit = async () => {
        if (!editText.trim()) {
            toast.error(getTranslate("comments", "commentCannotBeEmpty"));
            return;
        }

        if (editText.trim().length < 10) {
            toast.error(getTranslate("comments", "commentTooShort"));
            return;
        }

        try {
            await updateMutation.mutateAsync({
                commentId: item.id,
                message: editText.trim()
            });
            setIsEditing(false);
            toast.success(getTranslate("comments", "commentUpdated"));
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error(getTranslate("comments", "mustBeLoggedToEdit"));
            } else if (error.response?.status === 403) {
                toast.error(getTranslate("comments", "canOnlyEditOwn"));
            } else {
                toast.error(getTranslate("comments", "failedToUpdate"));
            }
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(getTranslate("comments", "confirmDelete"))) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(item.id);
            toast.success(getTranslate("comments", "commentDeleted"));
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error(getTranslate("comments", "mustBeLoggedToDelete"));
            } else if (error.response?.status === 403) {
                toast.error(getTranslate("comments", "canOnlyDeleteOwn"));
            } else {
                toast.error(getTranslate("comments", "failedToDelete"));
            }
        }
    };

    const isOwner = currentUser && item.author && (
        currentUser.id === item.author.id || 
        currentUser.username === item.author.username
    );

    const authorName = item.author?.first_name || item.author?.username || 'Anonymous';
    const authorAvatar = item.author?.avatar || item.author?.profile_picture || null;
    
    const formattedDate = dayjs(item.created_at).format('MMMM DD, YYYY [at] h:mm a');
    
    const rating = item.avg_rating || 0;
    const ratingsCount = item.ratings_count || 0;

    return (
        <li className="comment__item">
            <div className="comment__item-container">

                <div className="comment__avatar-wrapper">
                    {authorAvatar ? (
                        <img 
                            className="comment__avatar-wrapper-img" 
                            src={authorAvatar} 
                            alt={authorName} 
                        />
                    ) : (
                        <div className="comment__avatar-wrapper-placeholder">
                            {authorName.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="comment__content">
                    <div className="comment__author">
                        <div className="comment__author-meta">
                            <span className="comment__author-meta-icon">
                                <IoPersonCircleOutline />
                            </span>
                            <h2 className="comment__author-meta-name">
                                {authorName}
                            </h2>
                        </div>
                        <div className="comment__author-actions">
                            {isAuthenticated && (
                                <HoverButton
                                    className="comment__author-action"
                                    onClick={() => onReply(item.id, authorName)}
                                    variant="default"
                                    hoverBgColor="rgba(34, 34, 34)"
                                    btnSize="xs"
                                >
                                    <span className="comment__author-action-icon">
                                        <LiaReplySolid />
                                    </span>
                                    <span className="comment__author-action-title">
                                        {getTranslate("comments", "reply")}
                                    </span>
                                </HoverButton>
                            )}
                            
                            {isOwner && (
                                <>
                                    <HoverButton
                                        className="comment__author-action comment__author-action--edit"
                                        onClick={handleEdit}
                                        variant="default"
                                        hoverBgColor="rgba(74, 144, 226, 0.15)"
                                        btnSize="xs"
                                        disabled={isEditing}
                                    >
                                        <span className="comment__author-action-icon">
                                            <MdEdit />
                                        </span>
                                        <span className="comment__author-action-title">
                                            {getTranslate("comments", "edit")}
                                        </span>
                                    </HoverButton>
                                    
                                    <HoverButton
                                        className="comment__author-action comment__author-action--delete"
                                        onClick={handleDelete}
                                        variant="default"
                                        hoverBgColor="rgba(220, 53, 69, 0.15)"
                                        btnSize="xs"
                                        disabled={deleteMutation.isPending}
                                    >
                                        <span className="comment__author-action-icon">
                                            <MdDelete />
                                        </span>
                                        <span className="comment__author-action-title">
                                            {deleteMutation.isPending ? getTranslate("comments", "deleting") : getTranslate("comments", "delete")}
                                        </span>
                                    </HoverButton>
                                </>
                            )}
                        </div>
                    </div>

                    {rating > 0 && (
                        <span className="comment__raiting">
                            <HotelRating
                                size={14}
                                value={rating}
                                color="gold"
                            />
                            {ratingsCount > 0 && (
                                <span className="comment__raiting-count">
                                    ({ratingsCount})
                                </span>
                            )}
                        </span>
                    )}
                    
                    <div className="comment__meta">
                        <time className="comment__meta-time" dateTime={item.created_at}>
                            {formattedDate}
                        </time>
                    </div>
                    
                    {isEditing ? (
                        <div className="comment__edit">
                            <textarea
                                className="comment__edit-textarea"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                rows={4}
                                disabled={updateMutation.isPending}
                            />
                            <div className="comment__edit-actions">
                                <HoverButton
                                    onClick={handleSaveEdit}
                                    variant="silver"
                                    btnSize="xs"
                                    bgColor="rgba(170, 132, 83, 1)"
                                    hoverBgColor="rgba(46, 41, 41, 0.25)"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? getTranslate("comments", "saving") : getTranslate("comments", "save")}
                                </HoverButton>
                                <HoverButton
                                    onClick={handleCancelEdit}
                                    variant="default"
                                    btnSize="xs"
                                    hoverBgColor="rgba(34, 34, 34)"
                                    disabled={updateMutation.isPending}
                                >
                                    {getTranslate("comments", "cancel")}
                                </HoverButton>
                            </div>
                        </div>
                    ) : (
                        <div 
                            className="comment__desc"
                            dangerouslySetInnerHTML={{ __html: item.message }}
                        />
                    )}
                    
                    {item?.replies?.length > 0 && (
                        <div className="comment__view">
                            <HoverButton
                                className="comment__view-btn"
                                onClick={handleToggle}
                                variant="default"
                                textHoverColor="red"
                                border={false}
                            >
                                <span className="comment__view-title">
                                    {getTranslate("comments", "viewReplies")}
                                </span>
                                <span className="comment__view-count">
                                    [{item.replies.length}]
                                </span>
                            </HoverButton>
                        </div>
                    )}
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        className="coomment__list comment__list--nested"
                        initial={{ height: "0" }}
                        animate={{ height: "auto" }}
                        exit={{ height: "0" }}
                        transition={{ duration: 0.220, ease: "linear" }}
                    >
                        {item.replies.map((reply) => (
                            <CommentItem
                                onReply={onReply}
                                key={reply.id}
                                item={reply}
                            />
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </li>
    )
}

export default CommentItem;
