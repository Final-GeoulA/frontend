// userId=21로 고정
// 추후 로그인 기능 연동 후 실제 로그인 사용자 ID(userId)로 변경 예정

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/MedicalRecordUpload.css';
import axios from 'axios';

const MedicalRecordUpload: React.FC = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');

  const [hospital, setHospital] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const [loadingOcr, setLoadingOcr] = useState(false);

  const userId = 21; // 로그인 후 해당 유저로 수정 필요

  // 이미지 선택 
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    const ocrUrl = `${process.env.REACT_APP_BACK_END_URL}/api/medical-record/ocr`;

    console.log('OCR URL:', ocrUrl);

    try {
      setLoadingOcr(true);

      const res = await axios.post(ocrUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('OCR RESPONSE:', res.data);

      if (res.data.success && res.data.parsed) {
        const parsed = res.data.parsed;

        // OCR 결과를 입력칸에 자동 반영
        setHospital(parsed.hospitalName || '');
        setDate(parsed.paymentDate || '');
        setAmount(parsed.price ? String(parsed.price) : '');

        // rawText를 메모에 자동으로 넣고 싶으면 아래 주석 해제
        // setMemo(parsed.rawText || '');

        alert('OCR 인식이 완료되었습니다.');
      } else {
        alert(res.data.message || 'OCR 인식 실패');
      }
    } catch (error: any) {
      console.error('OCR 호출 실패:', error);

      if (error.response) {
        console.error('OCR 응답 데이터:', error.response.data);
        console.error('OCR 응답 상태:', error.response.status);
      } else if (error.request) {
        console.error('OCR 요청은 갔지만 응답 없음:', error.request);
      } else {
        console.error('OCR 요청 설정 오류:', error.message);
      }

      alert('OCR 처리 중 오류가 발생했습니다.');
    } finally {
      setLoadingOcr(false);
    }
  };

  const handleSubmit = async () => {
    if (!hospital || !date || !amount) {
      alert('병원명, 날짜, 금액은 필수입니다.');
      return;
    }

    if (Number(amount) <= 0) {
      alert('금액은 0보다 커야 합니다.');
      return;
    }

    const url = `${process.env.REACT_APP_BACK_END_URL}/api/medical-record/save`;

    const requestData = {
      userId,
      hospitalName: hospital,
      paymentDate: date,
      price: Number(amount),
      memo,
    };

    console.log('SAVE URL:', url);
    console.log('REQUEST DATA:', requestData);

    try {
      const res = await axios.post(url, requestData);

      console.log('SAVE RESPONSE:', res.data);

      if (res.data.success) {
        alert('진료 기록이 저장되었습니다.');

        setHospital('');
        setDate('');
        setAmount('');
        setMemo('');
        setImage(null);
        setPreview('');

        navigate('/MedicalRecord');
      } else {
        alert(res.data.message || '저장 실패');
      }
    } catch (error: any) {
      console.error('진료 기록 저장 실패:', error);

      if (error.response) {
        console.error('응답 데이터:', error.response.data);
        console.error('응답 상태:', error.response.status);
      } else if (error.request) {
        console.error('요청은 갔지만 응답 없음:', error.request);
      } else {
        console.error('요청 설정 오류:', error.message);
      }

      alert('서버 오류');
    }
  };

  return (
    <div className="medical-upload-page">
      <div className="medical-upload-card">
        <h2 className="medical-upload-title">진료 기록 추가</h2>
        <p className="medical-upload-subtitle">
          영수증을 업로드하면 자동으로 정보를 불러올 수 있어요
        </p>

        <label className="medical-upload-box">
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />

          {preview ? (
            <img src={preview} alt="영수증 미리보기" className="medical-upload-preview" />
          ) : (
            <div className="medical-upload-placeholder">
              <p className="upload-main">영수증 사진 업로드</p>
              <p className="upload-sub">클릭해서 파일 선택</p>
            </div>
          )}
        </label>

        {loadingOcr && (
          <div className="ocr-loading-box">
            <div className="ocr-spinner"></div>
            <p className="ocr-loading-text">영수증을 분석하고 있어요...</p>
            <p className="ocr-loading-subtext">잠시만 기다려 주세요</p>
          </div>
        )}

        <div className="medical-upload-form">
          <div className="input-group">
            <label>병원명</label>
            <input
              type="text"
              className="input-text"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="예: 연세피부과"
            />
          </div>

          <div className="input-group">
            <label>진료 날짜</label>
            <input
              type="date"
              className="input-text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>진료비</label>
            <input
              type="number"
              className="input-text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="예: 12000"
            />
          </div>

          <div className="input-group">
            <label>메모</label>
            <textarea
              value={memo}
              className="input-text"
              onChange={(e) => setMemo(e.target.value)}
              placeholder="진료 내용이나 특이사항을 입력하세요"
            />
          </div>
        </div>

        <button
          className="medical-upload-submit"
          onClick={handleSubmit}
          disabled={loadingOcr}
        >
          {loadingOcr ? 'OCR 인식 중...' : '저장하기'}
        </button>
      </div>
    </div>
  );
};

export default MedicalRecordUpload;