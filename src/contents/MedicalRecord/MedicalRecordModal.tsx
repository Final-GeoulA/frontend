import React from 'react';
import './style/MedicalRecordModal.css';

type RecordItem = {
  date: string;
  hospital: string;
  amount: number;
  memo?: string;
};

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  records: RecordItem[];
}

const MedicalRecordModal: React.FC<MedicalRecordModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  records,
}) => {
  if (!isOpen) return null;

  const totalAmount = records.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="medical-modal-overlay" onClick={onClose}>
      <div className="medical-modal" onClick={(e) => e.stopPropagation()}>
        <div className="medical-modal-header">
          <div>
            <p className="medical-modal-subtitle">진료 상세 내역</p>
            <h3 className="medical-modal-title">{selectedDate}</h3>
          </div>
          <button className="medical-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="medical-modal-body">
          {records.length === 0 ? (
            <div className="medical-modal-empty">등록된 내역이 없습니다.</div>
          ) : (
            <>
              <div className="medical-modal-summary">
                총 {records.length}건 / 총 진료비 {totalAmount.toLocaleString()}원
              </div>

              <div className="medical-modal-records">
                {records.map((record, index) => (
                  <div key={index} className="medical-modal-record-item">
                    <div className="medical-modal-record-top">
                      <div className="medical-modal-record-left">
                        <span className="medical-modal-label">병원명</span>
                        <span className="medical-modal-value">{record.hospital}</span>
                      </div>

                      <div className="medical-modal-record-right">
                        <span className="medical-modal-label">금액</span>
                        <span className="medical-modal-price">
                          {record.amount.toLocaleString()}원
                        </span>
                      </div>
                    </div>

                    <div className="medical-modal-memo-box">
                      <span className="medical-modal-label">메모</span>
                      <p
                        className={`medical-modal-memo ${
                          !record.memo ? 'medical-modal-memo-empty' : ''
                        }`}
                      >
                        {record.memo || '진료 내용, 처방, 특이사항 등을 메모로 남겨보세요.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordModal;