const formatNumber = (num) => num?.toLocaleString() ?? 'N/A';

const PrintableReport = ({ report }) => {
    if (!report) return null;

    const {
        placementDrive,
        participantCount,
        interviewCount,
        offersMade,
        studentsPlaced,
        startDate,
        endDate,
        summary,
    } = report;

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', color: '#000', padding: 20, backgroundColor: '#fff' }}>
            <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Report Details</h1>

            <dl>
                <dt><strong>Placement Drive:</strong></dt>
                <dd>{placementDrive?.title || 'N/A'}</dd>

                <dt><strong>Company:</strong></dt>
                <dd>{placementDrive?.companyName || 'N/A'}</dd>

                <dt><strong>Participant Count:</strong></dt>
                <dd>{formatNumber(participantCount)}</dd>

                <dt><strong>Interview Count:</strong></dt>
                <dd>{formatNumber(interviewCount)}</dd>

                <dt><strong>Offers Made:</strong></dt>
                <dd>{formatNumber(offersMade)}</dd>

                <dt><strong>Students Placed:</strong></dt>
                <dd>{formatNumber(studentsPlaced)}</dd>

                <dt><strong>Period:</strong></dt>
                <dd>{startDate ? new Date(startDate).toLocaleDateString() : 'N/A'} - {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}</dd>
            </dl>

            {summary && (
                <>
                    <h2 style={{ marginTop: 30, marginBottom: 10 }}>Summary</h2>
                    <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{summary}</pre>
                </>
            )}
        </div>
    );
};

export default PrintableReport;
