import React, { useEffect, useState } from 'react';
import EditListEntry from './EditListEntry';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../slices/userSlice';
import { fetchUserPatchInfo } from '../slices/userSlice';
import EditMetadataModal from './EditMetadataModal';

const ManageUploads = ({ setNotification }) => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const userId = user ? user.id : null;
    const userPatches = useSelector(state => state.user.userPatches);
    const [patches, setPatches] = useState([]); // Corrected state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPatchId, setCurrentPatchId] = useState(null);

    const handleOpenModal = (patchId) => {
        setCurrentPatchId(patchId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentPatchId(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserPatchInfo(userId));
        }
    }, [userId, dispatch]);
    
    useEffect(() => {
        setPatches(userPatches); // Set the patches state when userPatches updates
    }, [userPatches]);

    const handlePatchDeleted = (patchId) => {
        setPatches(prevPatches => prevPatches.filter(patch => patch._id !== patchId));
    };

    return (
        <div className="w-5/6 xs:w-5/6 sm:w-5/6 md:w-5/6 lg:w-2/3">
            <div className="text-2xl mb-5">Manage uploads</div>
            <ul className="list-none p-0">
                {patches.map((singlePatchInfo) => ( // Use the 'patches' state for rendering
                    <EditListEntry
                        key={singlePatchInfo._id}
                        singlePatchInfo={singlePatchInfo}
                        userId={userId}
                        handleOpenModal={handleOpenModal}
                        handlePatchDeleted={handlePatchDeleted} // Pass the handlePatchDeleted function as a prop
                    />
                ))}
            </ul>
            <EditMetadataModal
                isOpen={isModalOpen}
                closeModal={handleCloseModal}
                patchId={currentPatchId}
                fetchPatchInfo={() => dispatch(fetchUserPatchInfo(userId))}
                setNotification={setNotification} // Pass the function down to EditMetadataModal
                />
        </div>
    );
};

export default React.memo(ManageUploads);
