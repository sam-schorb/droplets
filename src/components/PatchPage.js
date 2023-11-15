import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPatchNumber } from '../slices/patchInfoSlice';
import { likePatch, unlikePatch, selectLikedPatches } from '../slices/likedPatchesSlice';
import { selectUser } from '../slices/userSlice';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { unwrapResult } from '@reduxjs/toolkit';

const PatchPage = () => {
  const { username, patchname } = useParams();
  const [patchInfo, setPatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userId = user?.id;
  const likedPatches = useSelector(selectLikedPatches);

  const tagsAsString = patchInfo?.tags?.join(', ') || 'No tags';

    // Assuming patchInfo is fetched and set correctly from the backend
    const [hasLiked, setHasLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
  
    // Update local state when the Redux store changes
    useEffect(() => {
      if (patchInfo) {
        setHasLiked(likedPatches.includes(patchInfo._id));
        setLikeCount(patchInfo.likes?.length || 0);
      }
    }, [patchInfo, likedPatches]); // Add 'likedPatches'

  useEffect(() => {
    const fetchPatchInfo = async () => {
      try {
        const response = await axios.get(`/artist/${username}/${patchname}`);
        if (response.data) {
          setPatchInfo({
            ...response.data,
            tags: Array.isArray(response.data.tags) ? response.data.tags : [response.data.tags],
          });
        }
      } catch (err) {
        setError('Failed to fetch patch information');
      } finally {
        setLoading(false);
      }
    };

    fetchPatchInfo();
  }, [username, patchname]);

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (!userId) {
      console.log('User not logged in');
      // Implement notification or redirection to login here
    } else {
      console.log('User ID:', userId); // Check if userId is defined
      try {
        if (hasLiked) {
          console.log('Attempting to unlike patch');
          const resultAction = await dispatch(unlikePatch({ userId, patchId: patchInfo._id }));
          setHasLiked(false);
          setLikeCount(prevCount => prevCount > 0 ? prevCount - 1 : 0); // Ensure count doesn't go below 0
          console.log('Unliked:', unwrapResult(resultAction));
        } else {
          console.log('Attempting to like patch');
          const resultAction = await dispatch(likePatch({ userId, patchId: patchInfo._id }));
          setHasLiked(true);
          setLikeCount(prevCount => prevCount + 1);
          console.log('Liked:', unwrapResult(resultAction));
        }
        // Forcing a rerender by updating a timestamp in state (if necessary)
      } catch (error) {
        console.error('Error in like/unlike action:', error);
      }
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  console.log('Render:', { hasLiked, likeCount }); // Check the rendered values


  return (
    <div className="container mx-auto px-4">
      {patchInfo && (
        <>
          <div className="flex flex-col md:flex-row md:items-center py-4">
            <img 
              src={`data:image/jpeg;base64,${patchInfo.image}`} 
              alt={patchInfo.name} 
              className="w-16 h-16 md:w-64 md:h-64 object-cover mr-4" 
            />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl">{patchInfo.name}</h1>
              <p className="text-xl md:text-2xl text-gray-600">{patchInfo.username}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Tags</th>
                  <th className="px-4 py-2 text-left">Upload date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2">{patchInfo.description}</td>
                  <td className="border px-4 py-2">{tagsAsString}</td>
                  <td className="border px-4 py-2">{new Date(patchInfo.uploadDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2">
                    <button
                      className="py-2 px-4 border-2 bg-medium-gray hover:bg-true-gray hover:text-white rounded"
                      onClick={() => dispatch(setPatchNumber(patchInfo._id))}
                    >
                      Load Patch
                    </button>
                  </td>
                  <td className="border px-4 py-2" style={{ verticalAlign: 'middle' }}> {/* Adjust alignment */}
                  <div className="flex items-center"> {/* Flex container for like button and count */}
                    <button
                      onClick={handleLikeToggle}
                      disabled={loading}
                      className="flex items-center px-2 py-1 bg-transparent border-0 rounded"
                    >
                      {hasLiked ? (
                        <AiFillHeart color="white" size="2em" />
                      ) : (
                        <AiOutlineHeart color="white" size="2em" />
                      )}
                    </button>
                    <span className="ml-2">Like count: {likeCount}</span> {/* Added margin for spacing */}
                  </div>
                </td>
                <td className="border px-4 py-2" style={{ verticalAlign: 'middle' }}> {/* Adjust alignment */}
                    {/* Additional information if needed */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
                      };  

export default PatchPage;
