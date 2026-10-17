'use client';

import React, { useState } from 'react';
import { getSavedPincode, savePincode } from '@/lib/cartStorage';

export default function DeliveryAddressBar() {
  const [pincode, setPincode] = useState(() => getSavedPincode());
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(pincode);
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(inputValue.trim())) {
      setError('Please enter a valid 6-digit PIN code');
      return;
    }
    setError('');
    setPincode(inputValue.trim());
    savePincode(inputValue.trim());
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-t-sm border border-b-0 border-gray-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2874f0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>

        <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
          <span className="text-xs text-gray-500 font-medium">
            Deliver to:
          </span>
          <span className="text-sm font-semibold text-gray-900">
            {pincode}
          </span>
          <span className="text-xs text-green-700 font-semibold bg-green-50 px-2 py-1 rounded-xs border border-green-200">
            Express 2-3 Days Available
          </span>
        </div>
      </div>

      <div>
        {editing ? (
          <form onSubmit={handleSave} className="flex items-center gap-2">
            <input
              type="text"
              maxLength={6}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter PIN"
              className="w-28 px-2.5 py-1 text-xs border border-blue-500 rounded-xs outline-none focus:ring-1 focus:ring-blue-500 font-medium"
              autoFocus
            />
            <button
              type="submit"
              className="text-xs font-semibold text-white bg-[#2874f0] hover:bg-blue-600 px-3 py-1 rounded-xs transition-colors cursor-pointer"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError('');
              }}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              setInputValue(pincode);
              setEditing(true);
            }}
            className="text-xs font-semibold text-[#2874f0] border border-blue-200 hover:bg-blue-50 px-3.5 py-1.5 rounded-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Change
          </button>
        )}
      </div>

      {error && <p className="w-full text-[11px] text-red-600 mt-1">{error}</p>}
    </div>
  );
}
