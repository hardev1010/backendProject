import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos } from '../store/videoSlice';

const VideoList = () => {
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.videos);
  const status = useSelector((state) => state.videos.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVideos());
    }
  }, [status, dispatch]);

  return (
    <div>
      <h1>Video List</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error loading videos</p>}
      {status === 'succeeded' &&
        videos.map((video) => (
          <div key={video._id}>
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </div>
        ))}
    </div>
  );
};

export default VideoList;
