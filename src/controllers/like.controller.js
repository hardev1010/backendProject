import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user._id;
    //TODO: toggle like on video

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Check if the like already exists
    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    if (existingLike) {
        // If like exists, remove it (toggle off)
        await existingLike.remove();
        res.status(200).json(new ApiResponse(null, "Like removed successfully"));
    } else {
        // If like doesn't exist, create a new one (toggle on)
        const newLike = await Like.create({
            video: videoId,
            likedBy: userId,
        });
        res.status(201).json(new ApiResponse(newLike, "Video liked successfully"));
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user._id
    //TODO: toggle like on comment

    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

    if (existingLike) {
        await existingLike.remove();
        res.status(200).json(new ApiResponse(null, "Like removed from comment successfully"));
    } else {
        const newLike = await Like.create({
            comment: commentId,
            likedBy: userId,
        });
        res.status(201).json(new ApiResponse(newLike, "Comment liked successfully"));
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user._id
    //TODO: toggle like on tweet

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (existingLike) {
        await existingLike.remove();
        res.status(200).json(new ApiResponse(null, "Like removed from tweet successfully"));
    } else {
        const newLike = await Like.create({
            tweet: tweetId,
            likedBy: userId,
        });
        res.status(201).json(new ApiResponse(newLike, "Tweet liked successfully"));
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id;

    const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } })
        .populate("video", "title thumbnail")
        .exec();

    res.status(200).json(new ApiResponse(likedVideos, "Liked videos retrieved successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}