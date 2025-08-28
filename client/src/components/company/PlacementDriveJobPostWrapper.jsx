import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchPlacementDrives, selectPlacementDrives } from "../../slices/placementDriveSlice";
import { useEffect } from "react";


const PlacementDriveJobPostWrapper = () => {
  const { placementDriveId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const drives = useSelector(selectPlacementDrives);

  useEffect(() => {
    if (!drives.length) {
      dispatch(fetchPlacementDrives());
    }
  }, [dispatch, drives.length]);

  if (placementDriveId) {
    // Show the PostJob form and pass placementDriveId as prop
    return <PostJob placementDriveId={placementDriveId} />;
  }

  // No placementDriveId param, show list of drives to select
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Select Placement Drive</h2>
      <ul className="space-y-4">
        {drives.map((drive) => (
          <li key={drive._id}>
            <button
              onClick={() => navigate(`/company/postJob/${drive._id}`)}
              className="w-full p-4 border rounded hover:bg-indigo-50 text-left text-indigo-700 font-semibold"
            >
              {drive.title} — {new Date(drive.startDate).toLocaleDateString()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlacementDriveJobPostWrapper;
