const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <button 
              onClick={onClose} 
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };
  
  export default Modal;