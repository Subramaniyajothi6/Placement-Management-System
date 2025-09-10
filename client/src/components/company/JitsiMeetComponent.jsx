import { JitsiMeeting } from "@jitsi/react-sdk";
import { useNavigate, useParams } from "react-router";

const JitsiMeetComponent = () => {
  const { meetingId, user } = useParams();
  const navigate = useNavigate();

  if (!meetingId) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600 font-semibold">No meeting ID provided in URL.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(`/${user}/dashboard`)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow mr-4"
        >
          ← Back to Dashboard
        </button>
        <h2 className="text-2xl font-bold text-indigo-700">
          Video Interview Room
        </h2>
      </div>

      <div className="mb-4">
        <p className="text-gray-600">
          You are joining interview room:{" "}
          <span className="font-mono bg-gray-100 py-1 px-2 rounded">{meetingId}</span>
        </p>
      </div>

      <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 bg-black">
        <JitsiMeeting
          roomName={meetingId}
          getIFrameRef={node => {
            node.style.height = "600px";
            node.style.width = "100%";
            node.style.border = "none";
            node.style.borderRadius = "8px";
          }}
          configOverwrite={{
            startWithAudioMuted: true,
            startWithVideoMuted: false,
          }}
          interfaceConfigOverwrite={{
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'fullscreen',
              'hangup', 'chat', 'settings', 'raisehand', 'videoquality',
            ],
          }}
          userInfo={{
            displayName: "Candidate",
          }}
        />
      </div>
    </div>
  );
};

export default JitsiMeetComponent;
