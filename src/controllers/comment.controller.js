import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const aggregate = Comment.aggregate([
        { $match: { video: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
            },
        },
        { $unwind: "$ownerDetails" },
        {
            $project: {
                content: 1,
                owner: {
                    _id: "$ownerDetails._id",
                    name: "$ownerDetails.name",
                    email: "$ownerDetails.email",
                },
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ]);

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    };

    const comments = await Comment.aggregatePaginate(aggregate, options);

    res.status(200).json(new ApiResponse(comments));

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video

    const { videoId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: userId,
    });

    res.status(201).json(new ApiResponse(comment, "Comment added successfully"));
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findOneAndUpdate(
        { _id: commentId, owner: userId },
        { content },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(404, "Comment not found or not authorized to update");
    }

    res.status(200).json(new ApiResponse(comment, "Comment updated successfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findOneAndDelete({ _id: commentId, owner: userId });

    if (!comment) {
        throw new ApiError(404, "Comment not found or not authorized to delete");
    }

    res.status(200).json(new ApiResponse(null, "Comment deleted successfully"));
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
