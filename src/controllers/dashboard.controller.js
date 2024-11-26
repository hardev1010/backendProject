import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const { channelId } = req.params;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Total videos uploaded by the channel
    const totalVideos = await Video.countDocuments({ owner: channelId });

    // Total views across all videos
    const totalViews = await Video.aggregate([
        { $match: { owner: mongoose.Types.ObjectId(channelId) } },
        { $group: { _id: null, totalViews: { $sum: "$view" } } },
    ]);

    // Total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

    // Total likes across all videos
    const totalLikes = await Like.countDocuments({ video: { $in: await Video.find({ owner: channelId }).select("_id") } });

    res.status(200).json(
        new ApiResponse(
            {
                totalVideos,
                totalViews: totalViews[0]?.totalViews || 0,
                totalSubscribers,
                totalLikes,
            },
            "Channel stats retrieved successfully"
        )
    );
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const { channelId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const videos = await Video.find({ owner: channelId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

    const totalVideos = await Video.countDocuments({ owner: channelId });

    res.status(200).json(
        new ApiResponse(
            {
                videos,
                totalVideos,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalVideos / limit),
            },
            "Channel videos retrieved successfully"
        )
    );
})

export {
    getChannelStats, 
    getChannelVideos
    }