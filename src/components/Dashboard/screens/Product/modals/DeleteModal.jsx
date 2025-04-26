import { FiX } from 'react-icons/fi';

const DeleteModal = ({
  show,
  onClose,
  onConfirm,
  isDeleting,
  title = "Confirmar Exclusão",
  message = "Tem certeza que deseja excluir este item permanentemente?",
  confirmText = "Confirmar Exclusão"
}) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={isDeleting}
            />
          </div>
          <div className="modal-body">
            <p>{message}</p>
            <p className="text-danger fw-bold">Esta ação não pode ser desfeita!</p>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="btn btn-danger" 
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Excluindo...
                </>
              ) : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;