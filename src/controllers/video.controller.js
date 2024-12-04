import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
    //TODO: get all videos based on query, sort, pagination

    const filter = {};
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }
    if (userId && isValidObjectId(userId)) {
        filter.owner = userId;
    }

    const sort = {};
    sort[sortBy] = sortType === "asc" ? 1 : -1;

    const aggregate = Video.aggregate([{ $match: filter }, { $sort: sort }]);
    const options = { page: parseInt(page), limit: parseInt(limit) };

    const videos = await Video.aggregatePaginate(aggregate, options);
    res.status(200).json(new ApiResponse(200, videos, "fetched all videos matching query"));
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    // console.log("voideo files", req.files);

    const videoLocalPath = req.files?.videoFile[0].path
    const thumbnailLocalPath = req.files?.thumbnail[0].path
    // console.log(videoLocalPath, thumbnailLocalPath);
    
    if (!(videoLocalPath || thumbnailLocalPath)) {
        throw new ApiError(400, "Video file and thumbnail are required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);
    console.log("video uploaded");
    
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoFile.secure_url,
        thumbnail: thumbnail.secure_url,
        duration: videoFile.duration || 0,
        owner: req.user._id
    });

    res.status(201).json(new ApiResponse(200, newVideo, "video uploaded successfully"));
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId).populate("owner", "name", "email");
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiResponse(video));
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    //can simply pass object in query as done in user controller
    const updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;

    if (req.files && req.files.thumbnail) {
        const thumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path, "image");
        updates.thumbnail = thumbnail.secure_url;
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, updates, { new: true });
    if (!updatedVideo) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiResponse(updatedVideo));

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId);
    if (!deletedVideo) {
        throw new ApiError(404, "Video not found");
    }

    res.status(200).json(new ApiResponse({ message: "Video deleted successfully" }));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    res.status(200).json(new ApiResponse(video));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
