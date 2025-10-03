import Loader from '../common/Loader';
import Text from '../common/Text';

const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  subTitle = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-[-16px] w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-[24px] shadow-lg w-full max-w-[674px] px-6 py-20">
        {/* Title */}
        <Text
          as="h2"
          text={title}
          fontSize="text-[36px]"
          fontWeight="font-semibold"
          className="mb-[60px]"
        />

        {/* Message */}
        <Text
          text={message}
          fontSize="text-md"
          className=""
        />

        {/* subTitle */}
        {subTitle && (
          <Text
            text={subTitle}
            fontSize="text-sm"
            className="mb-[60px]"
          />
        )}

        {/* Action Buttons */}
        <div className="w-full">
          <div className="flex justify-center">
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-md text-white rounded-[10px] w-[500px] h-[60px] flex items-center justify-center
                ${loading ? 'bg-[#e00000] opacity-70 cursor-not-allowed' : 'bg-[#e00000] hover:bg-red-700'}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader size={6} />
                  <Text
                   color="text-white"
                    text="Checking in..."
                    fontSize="text-md"
                    fontWeight="font-medium"
                  />
                </span>
              ) : (
                <Text
                  color="text-white"
                  text={confirmText}
                  fontSize="text-md"
                  fontWeight="font-medium"
                />
              )}
            </button>
          </div>

          <div className="mt-[60px]">
            <button
              onClick={onCancel}
              disabled={loading}
              className={`px-4 py-0 text-md rounded-[10px] w-full 
                ${loading ? 'bg-transparent text-gray-400 cursor-not-allowed' : 'bg-transparent text-gray-800 '}`}
            >
              <Text
                text={cancelText}
                fontSize="text-md"
                fontWeight="font-medium"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
