import "./Comment.css";
import { HoverButton, Pagination } from "@components/ui";
import { useRef, useState, useEffect } from "react";
import CommentItem from "./components/CommentItem/CommentItem.jsx";
import { useCreateCommentMutation } from "@/hooks/useComments";
import { useToast } from "@components/ui/Toast";
import { useLang } from "@hooks/useLang";
import { AuthService } from "../../../services/auth";
import { Link } from "react-router-dom";

const Comment = ({ newsId, comments = [], commentsCount = 0 }) => {
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10;
    const textareaRef = useRef(null);
    const { toast } = useToast();
    const { getTranslate } = useLang();
    const isAuthenticated = AuthService.isAuthenticated();
    
    const createMutation = useCreateCommentMutation();

    const handleReply = (commentId, userName) => {
        setReplyingTo({ id: commentId, userName });
        setReplyText(`@${userName} `);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyText("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!replyText.trim()) {
            setError(getTranslate("comments", "commentCannotBeEmpty"));
            return;
        }

        if (replyText.trim().length < 10) {
            setError(getTranslate("errors", "passwordTooShort"));
            return;
        }

        setError("");

        try {
            await createMutation.mutateAsync({
                newsId,
                message: replyText.trim(),
                parentId: replyingTo?.id
            });
            
            setReplyText("");
            setReplyingTo(null);
            
            toast.success(replyingTo ? getTranslate("comments", "replyPosted") : getTranslate("comments", "commentPosted"));
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error(getTranslate("comments", "mustBeLoggedToEdit"));
            } else if (err.response?.data?.detail) {
                toast.error(err.response.data.detail);
            } else if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(getTranslate("errors", "failedToPostComment"));
            }
        }
    };

    useEffect(() => {
        if (replyingTo) {
            textareaRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            textareaRef.current?.focus();
        }
    }, [replyingTo]);

    const totalPages = Math.ceil(comments.length / commentsPerPage);
    const startIndex = (currentPage - 1) * commentsPerPage;
    const endIndex = startIndex + commentsPerPage;
    const currentComments = comments.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        document.querySelector('.comment__list')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <div className="comment">
            <div className="comment__heading">
                <h2 className="comment__heading-title">
                    <span className="comment__heading-count">
                        {commentsCount}
                    </span>
                    {' '}
                    {commentsCount === 1 ? getTranslate("comments", "comment") : getTranslate("comments", "comments")}
                </h2>
            </div>
            <div className="comment__container">
                {comments && comments.length > 0 ? (
                    <>
                        <ul className="comment__list">
                            {currentComments.map((item) => (
                                <CommentItem
                                    key={item.id}
                                    item={item}
                                    onReply={handleReply}
                                />
                            ))}
                        </ul>
                        
                        {totalPages > 1 && (
                            <div className="comment__pagination">
                                <Pagination
                                    page={currentPage}
                                    total={totalPages}
                                    siblings={1}
                                    boundaries={1}
                                    onChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="comment__empty">
                        <p>{getTranslate("comments", "noCommentsYet")}</p>
                    </div>
                )}
                
                {isAuthenticated ? (
                    <form className="comment__form" onSubmit={handleSubmit}>
                        <div className="comment__form-heading">
                            <h5 className="comment__form-heading-title">
                                {replyingTo ? `${getTranslate("comments", "replyTo")} ${replyingTo.userName}` : getTranslate("comments", "leaveComment")}
                            </h5>
                            <span className="comment__form-heading-desc">
                                {getTranslate("comments", "emailNotPublished")}
                            </span>
                        </div>

                        {replyingTo && (
                            <div className="comment__form-replying">
                                <span>{getTranslate("comments", "replyingTo")} @{replyingTo.userName}</span>
                                <button 
                                    type="button" 
                                    onClick={handleCancelReply}
                                    className="comment__form-replying-cancel"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="comment__form-error">
                                {error}
                            </div>
                        )}

                        <div className="comment__form-content">
                            <textarea
                                ref={textareaRef}
                                rows={12}
                                className="comment__form-field"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={getTranslate("news", "writeComment")}
                                disabled={createMutation.isPending}
                            />
                            <div className="comment__form-conten-submit">
                                <HoverButton
                                    variant="silver"
                                    btnSize="md"
                                    border={true}
                                    bgColor="rgba(170, 132, 83, 1)"
                                    hoverBgColor={"rgba(46, 41, 41, 0.25)"}
                                    borderColor={"rgba(170, 132, 83, 1)"}
                                    type="submit"
                                    disabled={createMutation.isPending}
                                >
                                    {createMutation.isPending ? getTranslate("comments", "posting") : (replyingTo ? getTranslate("comments", "postReply") : getTranslate("comments", "postComment"))}
                                </HoverButton>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="comment__auth-required">
                        <p>{getTranslate("comments", "mustBeLoggedToEdit")}</p>
                        <Link to="/auth/login">
                            <HoverButton
                                variant="silver"
                                btnSize="md"
                                border={true}
                                bgColor="rgba(170, 132, 83, 1)"
                                hoverBgColor={"rgba(46, 41, 41, 0.25)"}
                                borderColor={"rgba(170, 132, 83, 1)"}
                            >
                                {getTranslate("auth", "login")}
                            </HoverButton>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;
