import React from 'react';

const SwipeRecords = () => {
    const mockSwipeRecords = [

    ];
  
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Matches</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left border-b">Date</th>
                    <th className="p-3 text-left border-b">Tags</th>
                    <th className="p-3 text-left border-b">Currently</th>
                    <th className="p-3 text-left border-b">Group</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSwipeRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{record.date}</td>
                      <td className="p-3 border-b">{record.type}</td>
                      <td className="p-3 border-b">{record.doctor}</td>
                      <td className="p-3 border-b">{record.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  
export default SwipeRecords;