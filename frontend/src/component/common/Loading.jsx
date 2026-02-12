import React from 'react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-gray-200 rounded-full border-t-4 border-blue-500 animate-spin"></div>
      <p className="mt-4 text-gray-500 text-lg font-semibold">Loading...</p>
    </div>
  )
}

export default Loading
