import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import videoSlice from './videoSlice'
import playlistSlice from './playlistSlice'
import commentSlice from './commentSlice'
import likeSlice from './likeSlice'
import subscriptionSlice from './subscriptionSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        videos: videoSlice,
        playlists: playlistSlice,
        comments: commentSlice,
        likes: likeSlice,
        subscriptions: subscriptionSlice
    }
})