import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet

    const { content } = req.body;
    const ownerId = req.user._id; // Assuming the user is authenticated

    if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Tweet content cannot be empty");
    }

    const tweet = await Tweet.create({ content, owner: ownerId });

    res.status(201).json(new ApiResponse(tweet, "Tweet created successfully"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(tweets, "User tweets retrieved successfully"));
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const { tweetId } = req.params;
    const { content } = req.body;
    const ownerId = req.user._id; // Assuming the user is authenticated

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findOne({ _id: tweetId, owner: ownerId });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or you are not authorized");
    }

    if (!content || content.trim().length === 0) {
        throw new ApiError(400, "Updated content cannot be empty");
    }

    tweet.content = content;
    await tweet.save();

    res.status(200).json(new ApiResponse(tweet, "Tweet updated successfully"));
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = req.params;
    const ownerId = req.user._id; // Assuming the user is authenticated

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findOne({ _id: tweetId, owner: ownerId });

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or you are not authorized");
    }

    await tweet.remove();

    res.status(200).json(new ApiResponse(null, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
