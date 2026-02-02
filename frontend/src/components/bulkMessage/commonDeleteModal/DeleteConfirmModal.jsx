import { PiWarningCircleBold } from 'react-icons/pi';

const DeleteConfirmModal = ({
  show, 
  onHide, 
  onConfirm,
  title = 'Are you sure?',
  message = 'Do you really want to delete this item?',
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-10 bg-black/10">
      <div className="bg-white rounded-lg w-[90%] max-w-md p-6 text-center shadow-md border transform transition-all duration-300 ease-out animate-slideFadeDown">
        <PiWarningCircleBold className="text-7xl text-red-500 mb-4 mx-auto" />
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 border border-gray-300 text-black rounded"
            onClick={onHide}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-red-500 text-white rounded"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;