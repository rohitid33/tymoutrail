import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaShare, FaCheck, FaCopy } from 'react-icons/fa';

/**
 * EventDetailActions Component
 * 
 * Following the Single Responsibility Principle:
 * This component handles the action buttons and recommendation information
 */
const EventDetailActions = ({ item, type, handleMainAction }) => {
  // Determine the appropriate content label based on type
  const getTypeLabel = () => {
    switch (type) {
      case 'tables':
        return 'Table';
      case 'events':
        return 'Event';
      case 'circles':
        return 'Circle';
      default:
        return 'Item';
    }
  };

  return (
    <div>
      {/* Recommendation Reason */}
      {item.recommendation && (
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium text-indigo-800 mb-2">Why We Recommend This</h3>
          <p className="text-indigo-700">{item.recommendation.reason}</p>
          <div className="mt-2 bg-white rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${item.recommendation.score * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-right mt-1 text-indigo-600">
            {Math.round(item.recommendation.score * 100)}% match
          </p>
        </div>
      )}
      
      {/* Type-specific details */}
      {type === 'tables' && item.topic && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Discussion Topic</h3>
          <p>{item.topic}</p>
        </div>
      )}
      
      {type === 'circles' && item.memberCount && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Members</h3>
          <p>{item.memberCount} members</p>
        </div>
      )}
      
      {type === 'events' && item.price !== undefined && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Price</h3>
          <p>{item.price === 0 ? 'Free' : `$${item.price}`}</p>
        </div>
      )}
      
      {/* Action Button */}
      <button
        onClick={handleMainAction}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition mt-4"
      >
        Request to Join
      </button>
      
      {/* Share Button */}
      <ShareButton item={item} type={type} />
    </div>
  );
};

EventDetailActions.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  handleMainAction: PropTypes.func.isRequired
};

// Share Button Component
const ShareButton = ({ item, type }) => {
  const [copied, setCopied] = useState(false);
  
  // Get the current URL to share
  const shareUrl = window.location.href;
  
  // Handle copy to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="mt-6">
      <div className="text-center text-gray-600 mb-2">
        Share this {type === 'events' ? 'event' : type === 'tables' ? 'table' : 'circle'} with friends
      </div>
      <button
        onClick={handleCopyLink}
        className={`w-full flex items-center justify-center py-2.5 px-6 rounded-lg font-medium transition ${copied ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'}`}
      >
        {copied ? (
          <>
            <FaCheck className="mr-2" />
            Link Copied!
          </>
        ) : (
          <>
            <FaShare className="mr-2" />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
};

export default EventDetailActions;
