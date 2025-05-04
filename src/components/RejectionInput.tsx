import React, { useEffect, useRef } from 'react';

interface RejectionInputProps {
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isValid: boolean;
}

function RejectionInput({ 
  value, 
  onChange,
  onCancel,
  onConfirm,
  isValid
}: RejectionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="mt-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder="Enter reason for rejection..."
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          style={{ resize: 'none' }}
        />
      </div>
      <div className="mt-2 flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!isValid}
          className={`px-4 py-2 text-white rounded ${
            isValid ? 'bg-red-500 hover:bg-red-600' : 'bg-red-300 cursor-not-allowed'
          }`}
        >
          Confirm Reject
        </button>
      </div>
    </div>
  );
}

export default RejectionInput;