/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PenSquare, FileText, Download, Plus, Trash2, ChevronRight, Sparkles, RefreshCw, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- CƠ SỞ DỮ LIỆU CHUẨN CT 2018 (SÁCH CÁNH DIỀU) ---
const curriculumData: Record<string, Record<string, { nhanBiet: string; thongHieu: string; vanDung: string }>> = {
  "Chương VI. Một số yếu tố của xác suất": {
    "Xác suất có điều kiện": {
      nhanBiet: "- Nhận biết được khái niệm xác suất có điều kiện.",
      thongHieu: "- Tính được xác suất có điều kiện trong những trường hợp đơn giản.\n- Nhận biết được hai biến cố độc lập.",
      vanDung: "- Giải quyết được một số bài toán thực tế có sử dụng xác suất có điều kiện."
    },
    "Xác suất toàn phần": {
      nhanBiet: "- Nhận biết được công thức xác suất toàn phần.\n- Nhận biết được công thức Bayes.",
      thongHieu: "- Vận dụng được công thức xác suất toàn phần và công thức Bayes để tính toán xác suất trong các bài toán đơn giản.",
      vanDung: "- Giải quyết được một số bài toán thực tiễn gắn với công thức xác suất toàn phần và công thức Bayes."
    }
  },
  "Chương 1. Nguyên hàm, tích phân": {
    "Nguyên hàm": {
      nhanBiet: "- Nhận biết được khái niệm nguyên hàm của một hàm số.\n- Nhận biết được bảng nguyên hàm cơ bản.",
      thongHieu: "- Tính được nguyên hàm trong những trường hợp đơn giản.",
      vanDung: "- Giải quyết bài toán thực tiễn gắn với nguyên hàm."
    },
    "Tích phân": {
      nhanBiet: "- Nhận biết được khái niệm và tính chất của tích phân.",
      thongHieu: "- Tính được tích phân bằng bảng nguyên hàm và tính chất.",
      vanDung: "- Sử dụng phương pháp đổi biến, từng phần.\n- Ứng dụng tích phân giải quyết bài toán thực tế."
    }
  }
};

const defaultLevels = () => [
  { tenMucDo: 'Nhận biết', yeuCau: '', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100', qs: { nlc: '', ds: '', tln: '' } },
  { tenMucDo: 'Thông hiểu', yeuCau: '', color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-100', qs: { nlc: '', ds: '', tln: '' } },
  { tenMucDo: 'Vận dụng', yeuCau: '', color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-100', qs: { nlc: '', ds: '', tln: '' } }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('nhap-lieu');
  const [data, setData] = useState<any[]>([]);

  // Khởi tạo 1 chương trống khi load app
  useEffect(() => {
    setData([{ tenChuong: '', noiDungs: [{ tenNoiDung: '', soTiet: 0, mucDos: defaultLevels() }] }]);
  }, []);

  const themChuongMoi = () => {
    setData([...data, { tenChuong: '', noiDungs: [{ tenNoiDung: '', soTiet: 0, mucDos: defaultLevels() }] }]);
  };

  const xoaChuong = (cIdx: number) => {
    const newData = data.filter((_, index) => index !== cIdx);
    setData(newData.length ? newData : [{ tenChuong: '', noiDungs: [{ tenNoiDung: '', soTiet: 0, mucDos: defaultLevels() }] }]);
  };

  const themNoiDung = (chuongIndex: number) => {
    const newData = [...data];
    newData[chuongIndex].noiDungs.push({ tenNoiDung: '', soTiet: 0, mucDos: defaultLevels() });
    setData(newData);
  };

  const xoaNoiDung = (chuongIndex: number, ndIndex: number) => {
    const newData = [...data];
    newData[chuongIndex].noiDungs = newData[chuongIndex].noiDungs.filter((_: any, index: number) => index !== ndIndex);
    if (newData[chuongIndex].noiDungs.length === 0) {
      newData[chuongIndex].noiDungs = [{ tenNoiDung: '', soTiet: 0, mucDos: defaultLevels() }];
    }
    setData(newData);
  };

  // HÀM XỬ LÝ LÕI: Tự động map Yêu cầu cần đạt
  const handleChonNoiDung = (chuongIndex: number, ndIndex: number, tenNoiDungSelected: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    const chuong = newData[chuongIndex];
    const noiDung = chuong.noiDungs[ndIndex];
    
    noiDung.tenNoiDung = tenNoiDungSelected;

    const chuongData = curriculumData[chuong.tenChuong];
    if (chuongData && chuongData[tenNoiDungSelected]) {
      const yc = chuongData[tenNoiDungSelected];
      noiDung.mucDos[0].yeuCau = yc.nhanBiet;
      noiDung.mucDos[1].yeuCau = yc.thongHieu;
      noiDung.mucDos[2].yeuCau = yc.vanDung;
    } else {
      noiDung.mucDos.forEach((md: any) => md.yeuCau = '');
    }
    
    setData(newData);
  };

  // Cập nhật số câu hỏi
  const handleUpdateQS = (cIdx: number, nIdx: number, mIdx: number, field: string, value: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[cIdx].noiDungs[nIdx].mucDos[mIdx].qs[field] = value;
    setData(newData);
  };

  // Cập nhật số tiết
  const handleUpdateSoTiet = (cIdx: number, nIdx: number, value: number) => {
    const newData = JSON.parse(JSON.stringify(data));
    newData[cIdx].noiDungs[nIdx].soTiet = value;
    setData(newData);
  };

  // Hàm đếm số câu từ chuỗi (ví dụ: "Câu 1, 2" -> 2 câu)
  const countQuestions = (input: string) => {
    if (!input || !input.trim()) return 0;
    // Tách theo dấu phẩy, chấm phẩy hoặc từ "và", loại bỏ các phần tử rỗng
    return input.split(/[,;\s]+(v\u00E0)?\s*/).filter(s => s && s.match(/\d/)).length;
  };

  // Tính tổng số câu và điểm
  const getTotals = () => {
    let p1 = 0, p2 = 0, p3 = 0;
    data.forEach(c => {
      c.noiDungs.forEach((nd: any) => {
        nd.mucDos.forEach((md: any) => {
          p1 += countQuestions(md.qs.nlc);
          p2 += countQuestions(md.qs.ds);
          p3 += countQuestions(md.qs.tln);
        });
      });
    });
    return { 
      p1, p2, p3, 
      total: p1 + p2 + p3,
      score1: p1 * 0.25,
      score2: p2 * 1.0,
      score3: p3 * 0.5,
      totalScore: (p1 * 0.25) + (p2 * 1.0) + (p3 * 0.5)
    };
  };

  const totals = getTotals();

  // THUẬT TOÁN TỰ ĐỘNG PHÂN BỔ (CHUẨN 2025)
  const tuDongPhanBo = () => {
    const newData = JSON.parse(JSON.stringify(data));
    const totalSotiet = newData.reduce((acc: number, c: any) => acc + c.noiDungs.reduce((sum: number, nd: any) => sum + (nd.soTiet || 0), 0), 0);
    
    if (totalSotiet === 0) {
      alert("Vui lòng nhập 'Số tiết' cho các nội dung kiến thức trước khi tự động phân bổ!");
      return;
    }

    // Định mức số câu theo cấu trúc 2025: 12 MC, 4 T/F, 6 SA
    const quota = { p1: 12, p2: 4, p3: 6 };
    let currentIdx = { p1: 1, p2: 1, p3: 1 };

    // Danh sách phẳng các bài để dễ tính toán
    const allNoiDungs: any[] = [];
    newData.forEach((c: any, cIdx: number) => {
      c.noiDungs.forEach((nd: any, nIdx: number) => {
        allNoiDungs.push({ cIdx, nIdx, soTiet: nd.soTiet || 0 });
      });
    });

    // Phân bổ câu hỏi theo tỷ lệ số tiết
    allNoiDungs.forEach((item, idx) => {
      const { cIdx, nIdx, soTiet } = item;
      const ratio = soTiet / totalSotiet;
      
      // Tính số câu cho từng phần (làm tròn)
      const c1 = Math.round(quota.p1 * ratio);
      const c2 = Math.round(quota.p2 * ratio);
      const c3 = Math.round(quota.p3 * ratio);

      // Reset các trường
      newData[cIdx].noiDungs[nIdx].mucDos.forEach((md: any) => {
        md.qs.nlc = '';
        md.qs.ds = '';
        md.qs.tln = '';
      });

      // Phân bổ câu vào các mức độ (Ví dụ quy tắc: NB > TH > VD)
      // Phần I (MC)
      for (let i = 0; i < c1; i++) {
        const level = i < Math.ceil(c1 * 0.5) ? 0 : (i < Math.ceil(c1 * 0.8) ? 1 : 2);
        const current = newData[cIdx].noiDungs[nIdx].mucDos[level].qs.nlc;
        newData[cIdx].noiDungs[nIdx].mucDos[level].qs.nlc = (current ? current + ', ' : '') + `Câu ${currentIdx.p1++}`;
      }

      // Phần II (True/False)
      for (let i = 0; i < c2; i++) {
        const level = i < Math.ceil(c2 * 0.5) ? 0 : (i < Math.ceil(c2 * 0.8) ? 1 : 2);
        const current = newData[cIdx].noiDungs[nIdx].mucDos[level].qs.ds;
        newData[cIdx].noiDungs[nIdx].mucDos[level].qs.ds = (current ? current + ', ' : '') + `Câu ${currentIdx.p2++}`;
      }

      // Phần III (Short Answer)
      for (let i = 0; i < c3; i++) {
        const level = i < Math.ceil(c3 * 0.5) ? 0 : (i < Math.ceil(c3 * 0.8) ? 1 : 2);
        const current = newData[cIdx].noiDungs[nIdx].mucDos[level].qs.tln;
        newData[cIdx].noiDungs[nIdx].mucDos[level].qs.tln = (current ? current + ', ' : '') + `Câu ${currentIdx.p3++}`;
      }
    });

    // Điều chỉnh khớp tổng số câu nếu bị dư/thiếu do làm tròn
    // (Trong phiên bản này ta để người dùng chỉnh sửa thêm nếu cần)
    
    setData(newData);
  };

  const calculateRowSpan = (chuong: any) => {
    return chuong.noiDungs.reduce((total: number, nd: any) => total + nd.mucDos.length, 0);
  };

  let globalRowIdx = 0; // Để tính STT liên tục cho bài học

  const exportToWord = () => {
    const tableElement = document.getElementById('ma-tran-table');
    if (!tableElement) {
      alert("Không tìm thấy bảng để xuất!");
      return;
    }

    const cloneTable = tableElement.cloneNode(true) as HTMLTableElement;
    cloneTable.setAttribute('border', '1');
    cloneTable.style.borderCollapse = 'collapse';
    cloneTable.style.width = '100%';

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Ma trận Đề kiểm tra</title>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: "Times New Roman", Times, serif; font-size: 11pt; }
          th, td { border: 1px solid black; padding: 5px; text-align: center; vertical-align: middle; }
          th { font-weight: bold; }
        </style>
      </head>
      <body>
        <h2 style="text-align: center; font-family: 'Times New Roman', Times, serif; font-weight: bold;">MA TRẬN ĐỀ KIỂM TRA MÔN TOÁN 12</h2>
        ${cloneTable.outerHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Ma_Tran_De_Thi.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToWordDacTa = () => {
    const tableElement = document.getElementById('dac-ta-table');
    if (!tableElement) {
      alert("Không tìm thấy bảng đặc tả để xuất!");
      return;
    }

    const cloneTable = tableElement.cloneNode(true) as HTMLTableElement;
    cloneTable.setAttribute('border', '1');
    cloneTable.style.borderCollapse = 'collapse';
    cloneTable.style.width = '100%';

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Bản Đặc tả Đề kiểm tra</title>
        <style>
          table { border-collapse: collapse; width: 100%; font-family: "Times New Roman", Times, serif; font-size: 11pt; }
          th, td { border: 1px solid black; padding: 5px; text-align: center; vertical-align: middle; }
          .text-left { text-align: left; }
          th { font-weight: bold; }
        </style>
      </head>
      <body>
        <h2 style="text-align: center; font-family: 'Times New Roman', Times, serif; font-weight: bold;">BẢN ĐẶC TẢ ĐỀ KIỂM TRA MÔN TOÁN 12</h2>
        ${cloneTable.outerHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Ban_Dac_Ta_De_Thi.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="max-w-4xl mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-indigo-600 font-bold tracking-[0.2em] text-[10px] uppercase mb-3">Smarter Education Tools</p>
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight italic">Math Matrix <span className="text-indigo-600">Pro</span></h1>
          <div className="h-1 w-20 bg-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-slate-500 text-base max-w-lg mx-auto leading-relaxed">
            Hệ thống chuyên dụng tối ưu hóa quy trình xây dựng ma trận và đặc tả đề thi theo chuẩn chương trình GDPT 2018.
          </p>
        </motion.div>
      </header>

      {/* Tabs */}
      <div className="flex justify-center space-x-2 mb-10 overflow-x-auto py-2">
        <button 
          onClick={() => setActiveTab('nhap-lieu')} 
          className={`px-6 py-3 rounded-full font-bold text-sm flex items-center transition-all duration-300 whitespace-nowrap ${activeTab === 'nhap-lieu' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
        >
          <PenSquare className="w-4 h-4 mr-2" /> Nhập liệu
        </button>
        <button 
          onClick={() => setActiveTab('ma-tran')} 
          className={`px-6 py-3 rounded-full font-bold text-sm flex items-center transition-all duration-300 whitespace-nowrap ${activeTab === 'ma-tran' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
        >
          <Plus className="w-4 h-4 mr-2" /> Ma trận đề thi
        </button>
        <button 
          onClick={() => setActiveTab('dac-ta')} 
          className={`px-6 py-3 rounded-full font-bold text-sm flex items-center transition-all duration-300 whitespace-nowrap ${activeTab === 'dac-ta' ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
        >
          <FileText className="w-4 h-4 mr-2" /> Bảng ma trận đặc tả
        </button>
        <button 
          onClick={() => setActiveTab('tao-de')} 
          className={`px-6 py-3 rounded-full font-bold text-sm flex items-center transition-all duration-300 whitespace-nowrap ${activeTab === 'tao-de' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'}`}
        >
          <Sparkles className="w-4 h-4 mr-2" /> Tạo đề tự động
        </button>
      </div>

      <main className="max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          {/* TAB 1: NHẬP LIỆU */}
          {activeTab === 'nhap-lieu' && (
            <motion.div 
              key="nhap-lieu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Cấu trúc Ma trận</h2>
                  <p className="text-slate-500 text-sm">Thiết lập các chương, nội dung và phân bổ câu hỏi.</p>
                </div>
                <button 
                  onClick={themChuongMoi} 
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" /> Thêm Chương Mới
                </button>
              </div>
              
              {data.map((chuong, cIdx) => (
                <motion.div 
                  layout
                  key={`c-${cIdx}`} 
                  className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex-1 w-full">
                      <label className="block text-[10px] font-black text-indigo-600 mb-2 uppercase tracking-widest">Chương / Chủ đề {cIdx + 1}</label>
                      <div className="flex gap-3 relative">
                        <input 
                          list={`chuong-suggestions-${cIdx}`}
                          className="flex-1 p-4 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none bg-slate-50 font-bold text-slate-800 transition-all pr-12"
                          value={chuong.tenChuong}
                          placeholder="Chọn hoặc nhập tên Chương / Chủ đề..."
                          onChange={(e) => {
                            const newData = JSON.parse(JSON.stringify(data));
                            newData[cIdx].tenChuong = e.target.value;
                            setData(newData);
                          }}
                        />
                        <ChevronRight className="absolute right-16 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 rotate-90 pointer-events-none" />
                        <datalist id={`chuong-suggestions-${cIdx}`}>
                          {Object.keys(curriculumData).map(c => <option key={c} value={c}>{c}</option>)}
                        </datalist>
                        <button 
                          onClick={() => xoaChuong(cIdx)}
                          className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors border-2 border-transparent hover:border-rose-100"
                          title="Xóa chương"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {chuong.tenChuong && chuong.noiDungs.map((nd: any, nIdx: number) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={`n-${nIdx}`} 
                        className="ml-0 md:ml-10 mt-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 relative"
                      >
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="flex-[3] w-full">
                            <div className="flex justify-between items-center mb-3">
                              <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest">Nội dung kiến thức {nIdx + 1}</label>
                              <button 
                                onClick={() => xoaNoiDung(cIdx, nIdx)}
                                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="relative group">
                              <input 
                                list={`nd-suggestions-${cIdx}-${nIdx}`}
                                className="w-full p-4 border-2 border-slate-50 rounded-2xl focus:border-indigo-500 outline-none bg-white shadow-xl shadow-slate-100/50 font-bold text-slate-800 transition-all pr-12"
                                value={nd.tenNoiDung}
                                placeholder="Nhập hoặc chọn nội dung kiến thức..."
                                onChange={(e) => {
                                  const newData = JSON.parse(JSON.stringify(data));
                                  newData[cIdx].noiDungs[nIdx].tenNoiDung = e.target.value;
                                  setData(newData);
                                }}
                                onBlur={(e) => {
                                  // Nếu nội dung khớp với gợi ý thì tự động map yêu cầu
                                  handleChonNoiDung(cIdx, nIdx, e.target.value);
                                }}
                              />
                              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 rotate-90" />
                              <datalist id={`nd-suggestions-${cIdx}-${nIdx}`}>
                                {Object.keys(curriculumData[chuong.tenChuong] || {}).map(n => <option key={n} value={n}>{n}</option>)}
                              </datalist>
                            </div>
                          </div>
                          <div className="flex-1 w-full">
                            <label className="block text-[10px] font-black text-slate-400 mb-3 uppercase tracking-widest text-center">SỐ TIẾT</label>
                            <div className="p-1 bg-white rounded-3xl border-2 border-slate-50 shadow-xl shadow-slate-100/50">
                              <input 
                                type="number"
                                className="w-full p-4 border-none rounded-2xl outline-none bg-transparent font-black text-slate-800 text-center text-xl"
                                value={nd.soTiet || ''}
                                placeholder="0"
                                onChange={(e) => handleUpdateSoTiet(cIdx, nIdx, parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        </div>

                        {nd.tenNoiDung && (
                          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {nd.mucDos.map((md: any, mIdx: number) => (
                              <div key={`m-${mIdx}`} className={`p-5 rounded-2xl border-2 ${md.borderColor} ${md.bgColor} transition-all hover:shadow-md`}>
                                <div className="flex items-center mb-4">
                                  <div className={`w-2 h-2 rounded-full mr-2 ${md.color.replace('text', 'bg')}`}></div>
                                  <p className={`font-black text-xs uppercase tracking-wider ${md.color}`}>{md.tenMucDo}</p>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-2 ml-1">Yêu cầu cần đạt (Sửa nội dung)</label>
                                    <textarea 
                                      className="w-full p-3 bg-white/50 border border-slate-200 rounded-xl text-[10px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none leading-relaxed text-slate-600 h-24"
                                      value={md.yeuCau}
                                      onChange={(e) => {
                                        const newData = JSON.parse(JSON.stringify(data));
                                        newData[cIdx].noiDungs[nIdx].mucDos[mIdx].yeuCau = e.target.value;
                                        setData(newData);
                                      }}
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="group">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Nhiều lựa chọn</label>
                                      <input 
                                        placeholder="Câu 1, 2..." 
                                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={md.qs.nlc} 
                                        onChange={e => handleUpdateQS(cIdx, nIdx, mIdx, 'nlc', e.target.value)}
                                      />
                                    </div>
                                    <div className="group">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Đúng - Sai</label>
                                      <input 
                                        placeholder="Câu 1a, 1b..." 
                                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={md.qs.ds} 
                                        onChange={e => handleUpdateQS(cIdx, nIdx, mIdx, 'ds', e.target.value)}
                                      />
                                    </div>
                                    <div className="group">
                                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Trả lời ngắn</label>
                                      <input 
                                        placeholder="Câu 1..." 
                                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={md.qs.tln} 
                                        onChange={e => handleUpdateQS(cIdx, nIdx, mIdx, 'tln', e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {chuong.tenChuong && (
                    <button 
                      onClick={() => themNoiDung(cIdx)} 
                      className="mt-8 ml-0 md:ml-10 px-6 py-3 border-2 border-dashed border-slate-200 text-slate-500 font-bold text-xs rounded-2xl hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center group"
                    >
                      <Plus className="w-3 h-3 mr-2 group-hover:rotate-90 transition-transform" /> Thêm nội dung kiến thức khác
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* TAB 2: MA TRẬN ĐỀ THI */}
          {activeTab === 'ma-tran' && (
            <motion.div 
              key="ma-tran"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative"
            >
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Ma trận Đề kiểm tra Môn Toán 12</h2>
                <p className="text-slate-400 text-xs mt-2 italic font-medium">(Dành cho kỳ thi tốt nghiệp THPT và kiểm tra định kỳ)</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button onClick={themChuongMoi} className="px-5 py-2.5 bg-slate-600 text-white rounded-lg font-bold text-xs flex items-center hover:bg-slate-700 transition-all shadow-md">
                    <Plus className="w-3.5 h-3.5 mr-2" /> Thêm Chương
                  </button>
                  <button onClick={() => {
                    if (data.length === 0) themChuongMoi();
                    else themNoiDung(data.length - 1);
                  }} className="px-5 py-2.5 bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center hover:bg-indigo-600 transition-all shadow-md">
                    <Plus className="w-3.5 h-3.5 mr-2" /> Thêm Bài Mới
                  </button>
                  <button onClick={tuDongPhanBo} className="px-5 py-2.5 bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center hover:bg-emerald-600 transition-all shadow-md">
                    <FileText className="w-3.5 h-3.5 mr-2" /> Tự Động Phân Bổ
                  </button>
                  <button onClick={exportToWord} className="px-5 py-2.5 bg-sky-600 text-white rounded-lg font-bold text-xs flex items-center hover:bg-sky-700 transition-all shadow-md">
                    <Download className="w-3.5 h-3.5 mr-2" /> Xuất File Word
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table id="ma-tran-table" className="w-full border-collapse text-[11px] min-w-[1200px]">
                  <thead>
                    <tr className="bg-[#f8fbff] text-slate-800">
                      <th className="border border-slate-200 p-3 w-12 text-center" rowSpan={3}>STT</th>
                      <th className="border border-slate-200 p-3 w-16 text-center" rowSpan={3}>SỐ TIẾT</th>
                      <th className="border border-slate-200 p-3 text-center uppercase font-black" rowSpan={3}>Nội dung kiến thức, đơn vị kiến thức</th>
                      <th className="border border-slate-200 p-2 text-center font-black bg-indigo-50/50" colSpan={7}>SỐ CÂU HỎI THEO MỨC ĐỘ NHẬN THỨC</th>
                      <th className="border border-slate-200 p-3 w-20 text-center font-black" rowSpan={3}>TỔNG SỐ CÂU</th>
                      <th className="border border-slate-200 p-3 w-20 text-center font-black" rowSpan={3}>TỶ LỆ (%)</th>
                    </tr>
                    <tr className="bg-white">
                      <th className="border border-slate-200 p-1.5 text-center font-bold bg-emerald-50/30" colSpan={2}>TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN</th>
                      <th className="border border-slate-200 p-1.5 text-center font-bold bg-amber-50/30" colSpan={3}>TRẮC NGHIỆM ĐÚNG/SAI</th>
                      <th className="border border-slate-200 p-1.5 text-center font-bold bg-rose-50/30" colSpan={2}>TRẢ LỜI NGẮN</th>
                    </tr>
                    <tr className="bg-slate-50/50 text-slate-500 font-bold">
                      <th className="border border-slate-200 p-1.5">Biết</th>
                      <th className="border border-slate-200 p-1.5">Hiểu</th>
                      <th className="border border-slate-200 p-1.5">Biết</th>
                      <th className="border border-slate-200 p-1.5">Hiểu</th>
                      <th className="border border-slate-200 p-1.5">Vận dụng</th>
                      <th className="border border-slate-200 p-1.5">Hiểu</th>
                      <th className="border border-slate-200 p-1.5">Vận dụng / VDC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let globalCounter = 0;
                      return data.flatMap((chuong, cIdx) => 
                        chuong.noiDungs.map((nd: any, nIdx: number) => {
                          globalCounter++;
                          const q1 = [countQuestions(nd.mucDos[0].qs.nlc), countQuestions(nd.mucDos[1].qs.nlc), countQuestions(nd.mucDos[2].qs.nlc)];
                          const q2 = [countQuestions(nd.mucDos[0].qs.ds), countQuestions(nd.mucDos[1].qs.ds), countQuestions(nd.mucDos[2].qs.ds)];
                          const q3 = [countQuestions(nd.mucDos[0].qs.tln), countQuestions(nd.mucDos[1].qs.tln), countQuestions(nd.mucDos[2].qs.tln)];
                          const rowTotal = q1.reduce((a, b) => a + b, 0) + q2.reduce((a, b) => a + b, 0) + q3.reduce((a, b) => a + b, 0);
                          
                          return (
                            <tr key={`mt-${cIdx}-${nIdx}`} className="hover:bg-slate-100 transition-colors">
                              <td className="border border-slate-100 p-3 text-center text-slate-400 font-medium">{globalCounter}</td>
                              <td className="border border-slate-100 p-3 text-center font-bold bg-slate-50/30">{nd.soTiet || 0}</td>
                              <td className="border border-slate-100 p-3 font-bold text-slate-700">
                                {nd.tenNoiDung || <span className="text-slate-200 italic font-normal">Chưa nhập nội dung...</span>}
                              </td>
                              {/* Part I */}
                              <td className="border border-slate-100 p-3 text-center bg-emerald-50/10 font-bold">{q1[0] || 0}</td>
                              <td className="border border-slate-100 p-3 text-center bg-emerald-50/10 font-bold">{q1[1] || 0}</td>
                              {/* Part II */}
                              <td className="border border-slate-100 p-3 text-center bg-amber-50/10 font-bold">{q2[0] || 0}</td>
                              <td className="border border-slate-100 p-3 text-center bg-amber-50/10 font-bold">{q2[1] || 0}</td>
                              <td className="border border-slate-100 p-3 text-center bg-amber-50/10 font-bold">{q2[2] || 0}</td>
                              {/* Part III */}
                              <td className="border border-slate-100 p-3 text-center bg-rose-50/10 font-bold">{q3[1] || 0}</td>
                              <td className="border border-slate-100 p-3 text-center bg-rose-50/10 font-bold">{q3[2] || 0}</td>
                              
                              <td className="border border-slate-100 p-3 text-center font-black text-indigo-600 bg-indigo-50/20">{rowTotal}</td>
                              <td className="border border-slate-100 p-3 text-center font-bold text-slate-400">{totals.total > 0 ? ((rowTotal/totals.total)*100).toFixed(0) : 0}%</td>
                            </tr>
                          );
                        })
                      );
                    })()}

                    {/* Tổng cộng row */}
                    <tr className="bg-slate-900 text-white font-black">
                      <td className="border border-slate-800 p-4 text-center" colSpan={3}>TỔNG CỘNG</td>
                      <td className="border border-slate-800 p-4 text-center">{data.reduce((acc, c) => acc + c.noiDungs.reduce((a: any, nd: any) => a + countQuestions(nd.mucDos[0].qs.nlc), 0), 0)}</td>
                      <td className="border border-slate-800 p-4 text-center">{data.reduce((acc, c) => acc + c.noiDungs.reduce((a: any, nd: any) => a + countQuestions(nd.mucDos[1].qs.nlc), 0), 0)}</td>
                      
                      <td className="border border-slate-800 p-4 text-center">{data.reduce((acc, c) => acc + c.noiDungs.reduce((a: any, nd: any) => a + countQuestions(nd.mucDos[0].qs.ds), 0), 0)}</td>
                      <td className="border border-slate-800 p-4 text-center">{data.reduce((acc, c) => acc + c.noiDungs.reduce((a: any, nd: any) => a + countQuestions(nd.mucDos[1].qs.ds), 0), 0)}</td>
                      <td className="border border-slate-800 p-4 text-center">{data.reduce((acc, c) => acc + c.noiDungs.reduce((a: any, nd: any) => a + countQuestions(nd.mucDos[2].qs.ds), 0), 0)}</td>
                      
                      <td className="border border-slate-800 p-4 text-center">{data.reduce((acc, c) => acc + c.noiDungs.reduce((a: any, nd: any) => a + countQuestions(nd.mucDos[1].qs.tln), 0), 0)}</td>
                      <td className="border border-slate-800 p-4 text-center">{data.reduce((acc, c) => acc + c.noiDungs.reduce((a: any, nd: any) => a + countQuestions(nd.mucDos[2].qs.tln), 0), 0)}</td>
                      
                      <td className="border border-slate-800 p-4 text-center bg-indigo-600">{totals.total}</td>
                      <td className="border border-slate-800 p-4 text-center">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Cards Summary */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex items-center space-x-6">
                  <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce"></div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">PHẦN I: TRẮC NGHIỆM</h3>
                    <p className="text-2xl font-black text-slate-900">{totals.p1} / 12 <span className="text-[10px] text-slate-400 font-medium">câu</span></p>
                    <p className="text-sm font-bold text-slate-500">Điểm: <span className="text-emerald-600">{totals.score1.toFixed(2)} / 3.00</span></p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex items-center space-x-6">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">PHẦN II: ĐÚNG/SAI</h3>
                    <p className="text-2xl font-black text-slate-900">{totals.p2} / 4 <span className="text-[10px] text-slate-400 font-medium">câu</span></p>
                    <p className="text-sm font-bold text-slate-500">Điểm: <span className="text-amber-600">{totals.score2.toFixed(2)} / 4.00</span></p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 flex items-center space-x-6">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-rose-500 rounded-full animate-bounce"></div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">PHẦN III: TRẢ LỜI NGẮN</h3>
                    <p className="text-2xl font-black text-slate-900">{totals.p3} / 6 <span className="text-[10px] text-slate-400 font-medium">câu</span></p>
                    <p className="text-sm font-bold text-slate-500">Điểm: <span className="text-rose-600">{totals.score3.toFixed(2)} / 3.00</span></p>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                App được thiết kế bởi <span className="text-slate-900">Bùi Thị Kiên</span>
              </div>
            </motion.div>
          )}

          {/* TAB 3: BẢNG ĐẶC TẢ */}
          {activeTab === 'dac-ta' && (
            <motion.div 
              key="dac-ta"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl overflow-hidden"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Bảng Đặc tả Đề thi</h2>
                  <p className="text-slate-500 text-sm mt-1">Chi tiết yêu cầu cần đạt và cấu trúc phân bổ câu hỏi.</p>
                </div>
                <button onClick={exportToWordDacTa} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center shadow-lg shadow-slate-200">
                  <Download className="w-4 h-4 mr-2" /> Xuất File Word
                </button>
              </div>

              <div className="overflow-x-auto -mx-8 px-8">
                <table id="dac-ta-table" className="w-full border-collapse text-sm min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="border border-slate-800 p-4 w-12 text-[10px] uppercase font-black" rowSpan={3}>TT</th>
                      <th className="border border-slate-800 p-4 w-56 text-[10px] uppercase font-black" rowSpan={3}>Chương / Chủ đề</th>
                      <th className="border border-slate-800 p-4 w-48 text-[10px] uppercase font-black" rowSpan={3}>Nội dung</th>
                      <th className="border border-slate-800 p-4 w-32 text-[10px] uppercase font-black" rowSpan={3}>Mức độ</th>
                      <th className="border border-slate-800 p-4 text-[10px] uppercase font-black" rowSpan={3}>Yêu cầu cần đạt</th>
                      <th className="border border-slate-800 p-2 text-[10px] uppercase font-black" colSpan={7}>Số câu hỏi theo định dạng</th>
                    </tr>
                    <tr className="bg-slate-800 text-slate-300">
                      <th className="border border-slate-700 p-2 text-[9px] uppercase font-bold" colSpan={2}>Nhiều lựa chọn</th>
                      <th className="border border-slate-700 p-2 text-[9px] uppercase font-bold" colSpan={3}>Đúng - Sai (ý)</th>
                      <th className="border border-slate-700 p-2 text-[9px] uppercase font-bold" colSpan={2}>Trả lời ngắn</th>
                    </tr>
                    <tr className="bg-slate-100 text-slate-500">
                      <th className="border border-slate-200 p-1.5 w-14 text-[8px] font-black">Biết</th>
                      <th className="border border-slate-200 p-1.5 w-14 text-[8px] font-black">Hiểu</th>
                      <th className="border border-slate-200 p-1.5 w-14 text-[8px] font-black">Biết</th>
                      <th className="border border-slate-200 p-1.5 w-14 text-[8px] font-black">Hiểu</th>
                      <th className="border border-slate-200 p-1.5 w-14 text-[8px] font-black">Vận dụng</th>
                      <th className="border border-slate-200 p-1.5 w-14 text-[8px] font-black">Hiểu</th>
                      <th className="border border-slate-200 p-1.5 w-14 text-[8px] font-black">Vận dụng c.</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {data.map((chuong, cIdx) => (
                      chuong.tenChuong && chuong.noiDungs.map((nd: any, nIdx: number) => (
                        nd.tenNoiDung && nd.mucDos.map((md: any, mIdx: number) => (
                          <tr key={`row-${cIdx}-${nIdx}-${mIdx}`} className="hover:bg-indigo-50/30 transition-colors group">
                            {nIdx === 0 && mIdx === 0 && (
                              <td className="border border-slate-200 p-4 font-black text-center bg-slate-50" rowSpan={calculateRowSpan(chuong)}>{cIdx + 1}</td>
                            )}
                            {nIdx === 0 && mIdx === 0 && (
                              <td className="border border-slate-200 p-4 font-black text-slate-900 bg-slate-50" rowSpan={calculateRowSpan(chuong)}>{chuong.tenChuong}</td>
                            )}
                            {mIdx === 0 && (
                              <td className="border border-slate-200 p-4 font-bold text-indigo-600" rowSpan={nd.mucDos.length}>{nd.tenNoiDung}</td>
                            )}
                            <td className={`border border-slate-200 p-4 text-[11px] font-black text-center uppercase tracking-tighter ${md.color}`}>
                              {md.tenMucDo}
                            </td>
                            <td className="border border-slate-200 p-4 whitespace-pre-line text-[11px] leading-relaxed text-justify text-slate-600">
                              {md.yeuCau || '---'}
                            </td>
                            {/* Multiple Choice */}
                            <td className="border border-slate-200 p-2 text-center font-bold text-slate-900">{mIdx === 0 ? md.qs.nlc : ''}</td>
                            <td className="border border-slate-200 p-2 text-center font-bold text-slate-900">{mIdx === 1 ? md.qs.nlc : ''}</td>
                            {/* Đúng Sai */}
                            <td className="border border-slate-200 p-2 text-center font-bold text-slate-900">{mIdx === 0 ? md.qs.ds : ''}</td>
                            <td className="border border-slate-200 p-2 text-center font-bold text-slate-900">{mIdx === 1 ? md.qs.ds : ''}</td>
                            <td className="border border-slate-200 p-2 text-center font-bold text-slate-900">{mIdx === 2 ? md.qs.ds : ''}</td>
                            {/* Trả lời ngắn */}
                            <td className="border border-slate-200 p-2 text-center font-bold text-slate-900">{mIdx === 1 ? md.qs.tln : ''}</td>
                            <td className="border border-slate-200 p-2 text-center font-bold text-slate-900">{mIdx === 2 ? md.qs.tln : ''}</td>
                          </tr>
                        ))
                      ))
                    ))}
                    {data.every(c => !c.tenChuong) && (
                      <tr>
                        <td colSpan={14} className="text-center p-20">
                          <div className="flex flex-col items-center justify-center text-slate-300">
                            <FileText className="w-16 h-16 mb-4 opacity-20" />
                            <p className="italic font-medium">Chưa có dữ liệu. Vui lòng thiết lập cấu trúc tại tab Nhập liệu.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 4: TẠO ĐỀ TỰ ĐỘNG */}
          {activeTab === 'tao-de' && (
            <TabTaoDeTuDong data={data} countQuestions={countQuestions} />
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-4xl mx-auto mt-20 text-center pb-12 border-t border-slate-200 pt-8">
        <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.3em]">Math Matrix Pro &copy; 2026</p>
        <p className="text-slate-400 text-[10px] mt-2 italic">Dành cho giáo viên tối ưu hóa quy trình kiểm tra đánh giá</p>
      </footer>
    </div>
  );
}

// ===== COMPONENT TAB 4: TẠO ĐỀ THI TỰ ĐỘNG =====
type CauHoi = {
  id: number;
  phan: 'nlc' | 'ds' | 'tln';
  soThuTu: number;
  chuong: string;
  noiDung: string;
  mucDo: string;
  yeuCau: string;
  noiDungCauHoi: string;
  dapAn: string;
};

// Phân bổ số câu theo tỉ lệ số tiết (Largest Remainder Method)
function allocateByTiet(quota: number, items: Array<{ soTiet: number }>): number[] {
  if (items.length === 0) return [];
  const totalTiet = items.reduce((s, nd) => s + nd.soTiet, 0);
  if (totalTiet === 0) {
    const base = Math.floor(quota / items.length);
    const alloc = items.map(() => base);
    let rem = quota - base * items.length;
    for (let i = 0; rem > 0 && i < items.length; i++, rem--) alloc[i]++;
    return alloc;
  }
  const exact = items.map(nd => (nd.soTiet / totalTiet) * quota);
  const floor = exact.map(v => Math.floor(v));
  let needed = quota - floor.reduce((a, b) => a + b, 0);
  const order = exact.map((v, i) => ({ rem: v - floor[i], i })).sort((a, b) => b.rem - a.rem);
  for (let k = 0; k < needed; k++) floor[order[k].i]++;
  return floor;
}

// ========== NGÂN HÀNG CÂU Hỏi TOÁN 12 (nguồn: thuvienhoclieu.com) ==========
type QBankEntry = { mucDo: 'NB'|'TH'|'VD'|'VDC'; phan: 'nlc'|'ds'|'tln'; noiDung: string; dapAn: string; };

const QUESTION_BANK: Record<string, QBankEntry[]> = {
  'default': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Hàm số nào là nguyên hàm của f(x)=2x?\nA. F(x)=x²+1\u2003B. F(x)=x²-3\u2003C. F(x)=2x²\u2003D. F(x)=½x²', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Đạo hàm của y=x³-3x+2 là:\nA. y’=3x²-3\u2003B. y’=3x²+3\u2003C. y’=x²-3\u2003D. y’=3x²', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Giá trị của ∫₀¹ x\u202fdx bằng:\nA. ½\u2003B. 1\u2003C. ¼\u2003D. 2', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Hàm y=sin\u202fx có đạo hàm là:\nA. cos\u202fx\u2003B. -sin\u202fx\u2003C. -cos\u202fx\u2003D. sin\u202fx', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Hàm nào đồng biến trên ℝ?\nA. y=2x+1\u2003B. y=-x+3\u2003C. y=x²\u2003D. y=-x²', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Cực tiểu của y=x²-4x+3 là:\nA. x=2\u2003B. x=-2\u2003C. x=4\u2003D. x=1', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] lim(x→0)\u202fsin(x)/x bằng:\nA. 1\u2003B. 0\u2003C. ∞\u2003D. -1', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Hàm y=x³-3x²+2 đạt cực đại tại:\nA. x=0\u2003B. x=2\u2003C. x=-1\u2003D. x=1', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Diện tích giới hạn bởi y=x² và y=x là:\nA. 1/6\u2003B. 1/3\u2003C. 1/2\u2003D. 1', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Nguyên hàm của f(x)=e^x+1/x là:\nA. e^x+ln|x|+C\u2003B. e^x-1/x²+C\u2003C. xe^x+C\u2003D. e^x+x+C', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Tiệm cận đứng của y=(2x+1)/(x-1) là:\nA. x=1\u2003B. x=-1\u2003C. y=2\u2003D. y=1', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Giá trị nhỏ nhất của y=x+4/x trên (0;+∞) là:\nA. 4\u2003B. 5\u2003C. 6\u2003D. 8', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S):
a) [Nhận biết] ∫₀¹ x²\u202fdx = 1/3.
b) [Thông hiểu] ∫₀^π cos(x)\u202fdx = 0.
c) [Thông hiểu] Nếu f(x)≥0 trên [a,b] thì ∫ f(x)dx≥0.
d) [Vận dụng] Làm z_1=2+3i, z_2=1-i. Tính |z_1+z_2|.`, dapAn:'Đ Đ Đ √10' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Tính ∫₀¹ (3x²-2x+1)\u202fdx.`, dapAn:'2' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Tính diện tích hình phẳng giới hạn bởi y=x²-1 và trục hoành.`, dapAn:'4/3' },
    { mucDo:'VDC', phan:'tln', noiDung:`[VẬN DỤNG CAO] Chứng minh hàm số y=x³-3x²+3x+1 năng trên toàn trục số.`, dapAn:'y’=3(x-1)²≥0 với mọi x, dấu bằng chỉ tại x=1.' },
  ],
  'nguyên hàm': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Họ nguyên hàm của f(x)=3x²-2x+1:\nA. x³-x²+x+C\u2003B. x³+x²-x+C\u2003C. 6x-2+C\u2003D. 3x³-x²+C', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] ∯ cos(x)\u202fdx bằng:\nA. sin(x)+C\u2003B. -sin(x)+C\u2003C. -cos(x)+C\u2003D. tan(x)+C', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] ∯ e^(2x)\u202fdx bằng:\nA. ½e^(2x)+C\u2003B. 2e^(2x)+C\u2003C. e^(2x)+C\u2003D. e^x+C', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] ∯(2x+1)/(x²+x)\u202fdx bằng:\nA. ln|x²+x|+C\u2003B. 2ln|x|+C\u2003C. ln|2x+1|+C\u2003D. 2/(x²+x)+C', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] ∯ x·e^x\u202fdx bằng:\nA. xe^x-e^x+C\u2003B. xe^x+e^x+C\u2003C. x²e^x+C\u2003D. e^x(x+1)', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Cho F(x)=x³-3x+2. Xác định đúng (Đ)/sai (S):
a) [Nhận biết] F(x) là nguyên hàm của f(x)=3x²-3.
b) [Thông hiểu] Họ nguyên hàm của f(x) là x³-3x+C.
c) [Thông hiểu] F(1)=0.
d) [Vận dụng] G(x)=F(x)-5 cũng là nguyên hàm của f(x).`, dapAn:'Đ Đ S Đ' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Tính ∫₀¹ (3x²-2x+1)\u202fdx.`, dapAn:'2' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Tính diện tích hình phẳng giới hạn bởi y=x²-1 và Ox.`, dapAn:'4/3' },
    { mucDo:'VDC', phan:'tln', noiDung:`[VẬN DỤNG CAO] Tính ∫₀^(π/2) sin(x)/(1+cos(x))\u202fdx.`, dapAn:'ln\u202f2' },
  ],
  'tích phân': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] ∫₀¹ (2x+1)\u202fdx bằng:\nA. 2\u2003B. 1\u2003C. 3\u2003D. 0', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Newton-Leibniz: ∫ᵃᴮ f(x)dx=\nA. F(b)-F(a)\u2003B. F(a)-F(b)\u2003C. f(b)-f(a)\u2003D. F(a)+F(b)', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] ∫₀^π sin(x)\u202fdx bằng:\nA. 2\u2003B. 0\u2003C. 1\u2003D. -1', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Diện tích giới hạn bởi y=√x và y=x trên [0,1]:\nA. 1/3\u2003B. 1/6\u2003C. 2/3\u2003D. 1/2', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] ∫₁² (x+1/x)\u202fdx bằng:\nA. 3/2+ln2\u2003B. 3/2-ln2\u2003C. 2+ln2\u2003D. 1+ln2', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S) về tích phân:
a) [Nhận biết] ∫₀¹ x²\u202fdx = 1/3.
b) [Thông hiểu] ∫₀^π cos(x)\u202fdx = 0.
c) [Thông hiểu] f(x)≥0 trên [a,b] ⇒ ∫ f(x)dx≥0.
d) [Vận dụng] Diện tích giới hạn bởi y=x² và Ox trên [0,1] bằng 1/3.`, dapAn:'Đ Đ Đ Đ' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Tính ∫₀² (x²+2x)\u202fdx.`, dapAn:'20/3' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Tính diện tích hình phẳng giới hạn bởi y=x² và y=2x.`, dapAn:'4/3' },
    { mucDo:'VDC', phan:'tln', noiDung:`[VẬN DỤNG CAO] Tính thể tích khối tròn xoay khi quay hình phẳng giới hạn bởi y=√x, y=0, x=4 quanh Ox.`, dapAn:'8π' },
  ],
  'xác suất': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Không gian mẫu khi tung 1 xúc xắc gồm bao nhiêu phần tử?\nA. 6\u2003B. 36\u2003C. 12\u2003D. 3', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Xác suất của biến cố chắc chắn bằng:\nA. 1\u2003B. 0\u2003C. 0.5\u2003D. không xác định', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] C(5,2) bằng:\nA. 10\u2003B. 20\u2003C. 5\u2003D. 15', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Tung 2 xúc xắc cân. Xác suất ta liêu hai mặt 6:\nA. 1/36\u2003B. 1/6\u2003C. 1/12\u2003D. 1/3', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Túi 4 bi đỏ, 3 bi xanh. Rút 2 bi. P(1 đỏ 1 xanh)=\nA. 4/7\u2003B. 12/21\u2003C. 2/7\u2003D. 3/7', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S):
a) [Nhận biết] 0≤P(A)≤1 với mọi biến cố A.
b) [Thông hiểu] A, B xung khắc ⇒ P(A+B)=P(A)+P(B).
c) [Thông hiểu] P(∅)=1.
d) [Vận dụng] P(Ā)=1-P(A).`, dapAn:'Đ Đ S Đ' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Hộp 5 bi đỏ, 3 bi xanh. Rút 2 bi. Tính P(cả 2 đỏ).`, dapAn:'5/14' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Lớp 30 HS (16 nam, 14 nữ), chọn 3 người. Đếm số cách chọn có đủ nam và nữ.`, dapAn:'C(16,2)×C(14,1)+C(16,1)×C(14,2)=3136' },
    { mucDo:'VDC', phan:'tln', noiDung:`[VẬN DỤNG CAO] Một bạn trả lời câu hỏi trắc nghiệm 10 câu ngẫu nhiên. Tính xác suất trả lời đúng ít nhất 8 câu.`, dapAn:'C(10,8)+C(10,9)+C(10,10) ÷ 4¹⁰ ≈ 0.000386' },
  ],
  'hàm số': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Hàm y=x³-3x²+3x-1 có tiệm cận ngang:\nA. Không có\u2003B. y=1\u2003C. y=0\u2003D. y=-1', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Hàm bậc bốn nào sau đây?\nA. y=x⁴-2x²+1\u2003B. y=x³-x\u2003C. y=2x+1\u2003D. y=x²+1', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Hàm nào dưới đây là hàm lẻ?\nA. y=x³-x\u2003B. y=x²+1\u2003C. y=x+1\u2003D. y=|x|', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Tiệm cận đứng và ngang của y=(x+2)/(x-1):\nA. x=1 và y=1\u2003B. x=1 và y=2\u2003C. x=-2 và y=1\u2003D. x=2 và y=-1', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Khoảng đồng biến của y=x³-3x:\nA. (-∞;-1) và (1;+∞)\u2003B. (-1;1)\u2003C. (0;+∞)\u2003D. (-∞;0)', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S) về hàm số:
a) [Nhận biết] Hàm bậc 3 y=ax³+... (a≠0) có đúng 1 điểm cực tri.
b) [Thông hiểu] f’(x₀)=0 ⇒ x₀ là điểm cực tri của f.
c) [Thông hiểu] Tiệm cận ngang của y=(x+1)/(x-1) là y=1.
d) [Vận dụng] Hàm y=x³-3x đạt CĐ tại x=-1, giá trị CĐ=2.`, dapAn:'S S Đ Đ' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Tìm cực trị của y=2x³-3x²-12x+1.`, dapAn:'CĐ: y(-1)=8; CT: y(2)=-19' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Cho y=(mx+1)/(x-1) đi qua A(2;3). Tìm m.`, dapAn:'m=2' },
    { mucDo:'VDC', phan:'tln', noiDung:`[VẬN DỤNG CAO] Tìm m để phương trình x³-3x²+m=0 có 3 nghiệm phân biệt.`, dapAn:'-4 < m < 0' },
  ],
  'hình học': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Thể tích hình cầu bán kính R:\nA. 4πR³/3\u2003B. 2πR³/3\u2003C. πR³\u2003D. 4πR³', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Diện tích mặt cầu bán kính R:\nA. 4πR²\u2003B. 2πR²\u2003C. πR²\u2003D. 4πR', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Khối trụ bán kính r, cao h có V=\nA. πr²h\u2003B. 2πr²h\u2003C. πrh\u2003D. πrh²', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Khối trụ r=2, h=3. Thể tích là:\nA. 12π\u2003B. 6π\u2003C. 4π\u2003D. 9π', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Tứ diện đều cạnh a có V=\nA. a³√2/12\u2003B. a³/6\u2003C. a³√3/12\u2003D. a³√2/6', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S):
a) [Nhận biết] Lập phương cạnh a có V=a³.
b) [Thông hiểu] Mặt cầu bán kính R có S=4πR².
c) [Thông hiểu] Khối nón có V=πr²h/3.
d) [Vận dụng] Khối trụ r, h có V=2πr²h.`, dapAn:'Đ Đ Đ S' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Hình hộp 3 cạnh tại 1 đỉnh là 2, 3, 4. Tính thể tích.`, dapAn:'24' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Hình nón r=3, đường sinh l=5. Tính V.`, dapAn:'12π' },
    { mucDo:'VDC', phan:'tln', noiDung:`[VẬN DỤNG CAO] Khối cầu ngoại tiếp tứ diện đều cạnh a. Tính thể tích khối cầu.`, dapAn:'V=4π(a√6/4)³/3=πa³√6/16' },
  ],
  'số phức': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Mô đun của z=3+4i:\nA. 5\u2003B. 7\u2003C. 25\u2003D. 1', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Số phức liên hợp của z=2-3i:\nA. 2+3i\u2003B. -2+3i\u2003C. -2-3i\u2003D. 3-2i', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] i² bằng:\nA. -1\u2003B. 1\u2003C. i\u2003D. -i', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] i¹⁰⁰ bằng:\nA. 1\u2003B. -1\u2003C. i\u2003D. -i', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Phương trình z²+4=0 có nghiệm:\nA. z=±2i\u2003B. z=±2\u2003C. z=2i\u2003D. z=-2i', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S):
a) [Nhận biết] Phần thực của z=5-3i bằng 5.
b) [Thông hiểu] |z|=|z̄| với mọi z.
c) [Thông hiểu] i²=-1.
d) [Vận dụng] Mô đun của z=1+i là √2.`, dapAn:'Đ Đ Đ Đ' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Tính (3+4i)/(1-2i).`, dapAn:'-1+2i' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Giải phương trình z²-(2+3i)z-(1-3i)=0.`, dapAn:'z=3+i hoặc z=-1+2i' },
    { mucDo:'VDC', phan:'tln', noiDung:`[VẬN DỤNG CAO] Tìm các số phức z biết |z|=|z-4i|=|z-4|.`, dapAn:'z=2+2i' },
  ],
};

// Lấy câu hỏi từ ngân hàng theo từ khóa chủ đề
function getQuestionsFromBank(noiDung: string, phan: 'nlc'|'ds'|'tln', mucDo: string): QBankEntry | undefined {
  const noi = noiDung.toLowerCase();
  const keys = Object.keys(QUESTION_BANK).filter(k => k !== 'default');
  const matchedKey = keys.find(k => noi.includes(k)) || 'default';
  const targetMucDo = mucDo === 'Nhận biết' ? 'NB' : mucDo === 'Thông hiểu' ? 'TH' : mucDo === 'Vận dụng cao' ? 'VDC' : 'VD';
  let pool = QUESTION_BANK[matchedKey].filter(q => q.phan === phan && q.mucDo === targetMucDo);
  if (pool.length === 0) pool = QUESTION_BANK['default'].filter(q => q.phan === phan && q.mucDo === targetMucDo);
  if (pool.length === 0) pool = QUESTION_BANK['default'].filter(q => q.phan === phan);
  return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : undefined;
}

function generateExamQuestions(data: any[], _countQuestions: (s: string) => number): CauHoi[] {
  const QUOTA_NLC_NB = 7, QUOTA_NLC_TH = 5;
  const QUOTA_DS = 4;
  const QUOTA_TLN_TH = 2, QUOTA_TLN_VD = 2, QUOTA_TLN_VDC = 2;

  const topics: Array<{ chuong: string; noiDung: string; soTiet: number; mucDos: any[] }> = [];
  data.forEach((chuong: any) => {
    if (!chuong.tenChuong) return;
    chuong.noiDungs.forEach((nd: any) => {
      if (!nd.tenNoiDung) return;
      topics.push({ chuong: chuong.tenChuong, noiDung: nd.tenNoiDung, soTiet: nd.soTiet || 0, mucDos: nd.mucDos || [] });
    });
  });
  if (topics.length === 0) return [];

  const mkQ = (phan: CauHoi['phan'], nd: typeof topics[0], mucDo: string, fallbackContent: string, fallbackDapAn: string): CauHoi => {
    const bankQ = getQuestionsFromBank(nd.noiDung, phan, mucDo);
    return {
      id: Date.now() + Math.random(), phan, soThuTu: 0,
      chuong: nd.chuong, noiDung: nd.noiDung, mucDo,
      yeuCau: nd.mucDos.find((m: any) => m.tenMucDo === (mucDo === 'Nhận biết' ? 'Nhận biết' : mucDo.includes('Thông') ? 'Thông hiểu' : 'Vận dụng'))?.yeuCau || '',
      noiDungCauHoi: bankQ ? bankQ.noiDung : fallbackContent,
      dapAn: bankQ ? bankQ.dapAn : fallbackDapAn,
    };
  };

  const nlcPool: CauHoi[] = [], dsPool: CauHoi[] = [], tlnPool: CauHoi[] = [];

  allocateByTiet(QUOTA_NLC_NB, topics).forEach((count, i) => {
    for (let k = 0; k < count; k++)
      nlcPool.push(mkQ('nlc', topics[i], 'Nhận biết',
        `[NHẬN BIẾT] Câu hỏi về "${topics[i].noiDung}".\nA. PA\u2003B. PB\u2003C. PC\u2003D. PD`, 'A'));
  });
  allocateByTiet(QUOTA_NLC_TH, topics).forEach((count, i) => {
    for (let k = 0; k < count; k++)
      nlcPool.push(mkQ('nlc', topics[i], 'Thông hiểu',
        `[THÔNG HIỂU] Câu hỏi về "${topics[i].noiDung}".\nA. PA\u2003B. PB\u2003C. PC\u2003D. PD`, 'A'));
  });
  allocateByTiet(QUOTA_DS, topics).forEach((count, i) => {
    for (let k = 0; k < count; k++)
      dsPool.push(mkQ('ds', topics[i], 'Hỗn hợp (NB+TH+TH+VD)',
        `Mệnh đề về "${topics[i].noiDung}":\na) [NB] ...\nb) [TH] ...\nc) [TH] ...\nd) [VD] ...`, 'a) Đ b) S c) Đ d) S'));
  });
  allocateByTiet(QUOTA_TLN_TH, topics).forEach((count, i) => {
    for (let k = 0; k < count; k++)
      tlnPool.push(mkQ('tln', topics[i], 'Thông hiểu', `[THÔNG HIỂU] Câu hỏi về "${topics[i].noiDung}".`, '...'));
  });
  allocateByTiet(QUOTA_TLN_VD, topics).forEach((count, i) => {
    for (let k = 0; k < count; k++)
      tlnPool.push(mkQ('tln', topics[i], 'Vận dụng', `[VẬN DỤNG] Câu hỏi về "${topics[i].noiDung}".`, '...'));
  });
  allocateByTiet(QUOTA_TLN_VDC, topics).forEach((count, i) => {
    for (let k = 0; k < count; k++)
      tlnPool.push(mkQ('tln', topics[i], 'Vận dụng cao', `[VẬN DỤNG CAO] Câu hỏi về "${topics[i].noiDung}".`, '...'));
  });

  const nlc = nlcPool.slice(0, QUOTA_NLC_NB + QUOTA_NLC_TH).map((q, i) => ({ ...q, soThuTu: i + 1 }));
  const ds  = dsPool.slice(0, QUOTA_DS).map((q, i) => ({ ...q, soThuTu: i + 1 }));
  const tln = tlnPool.slice(0, QUOTA_TLN_TH + QUOTA_TLN_VD + QUOTA_TLN_VDC).map((q, i) => ({ ...q, soThuTu: i + 1 }));
  return [...nlc, ...ds, ...tln];
}
function allocateByTiet(quota: number, items: Array<{ soTiet: number }>): number[] {
  if (items.length === 0) return [];
  const totalTiet = items.reduce((s, nd) => s + nd.soTiet, 0);
  if (totalTiet === 0) {
    // Ph\u00e2n \u0111\u1ec1u n\u1ebfu kh\u00f4ng c\u00f3 s\u1ed1 ti\u1ebft
    const base = Math.floor(quota / items.length);
    const alloc = items.map(() => base);
    let rem = quota - base * items.length;
    for (let i = 0; rem > 0 && i < items.length; i++, rem--) alloc[i]++;
    return alloc;
  }
  const exact = items.map(nd => (nd.soTiet / totalTiet) * quota);
  const floor = exact.map(v => Math.floor(v));
  let needed = quota - floor.reduce((a, b) => a + b, 0);
  // S\u1eafp x\u1ebfp theo ph\u1ea7n d\u01b0 gi\u1ea3m d\u1ea7n
  const order = exact.map((v, i) => ({ rem: v - floor[i], i })).sort((a, b) => b.rem - a.rem);
  for (let k = 0; k < needed; k++) floor[order[k].i]++;
  return floor;
}

function generateExamQuestions(data: any[], _countQuestions: (s: string) => number): CauHoi[] {
  // === QUOTA CHU\u1ea8N M\u1edaI ===
  const QUOTA_NLC_NB = 7;  // Tr\u1eafc nghi\u1ec7m NL\u1ef8a CH\u1eccN: NB
  const QUOTA_NLC_TH = 5;  // Tr\u1eafc nghi\u1ec7m NL\u1ef8a CH\u1eccN: TH  (VD = 0)
  const QUOTA_DS     = 4;  // \u0110\u00fangSai: 4 c\u00e2u \u00d7 4 \u00fd = 16 \u00fd (a)NB b)TH c)TH d)VD
  const QUOTA_TLN_TH  = 2; // Tr\u1ea3 l\u1eddi ng\u1eafn: TH
  const QUOTA_TLN_VD  = 2; // Tr\u1ea3 l\u1eddi ng\u1eafn: VD
  const QUOTA_TLN_VDC = 2; // Tr\u1ea3 l\u1eddi ng\u1eafn: VDC

  // T\u1eadp h\u1ee3p t\u1ea5t c\u1ea3 n\u1ed9i dung h\u1ee3p l\u1ec7 c\u00f9ng s\u1ed1 ti\u1ebft
  const topics: Array<{ chuong: string; noiDung: string; soTiet: number; mucDos: any[] }> = [];
  data.forEach((chuong: any) => {
    if (!chuong.tenChuong) return;
    chuong.noiDungs.forEach((nd: any) => {
      if (!nd.tenNoiDung) return;
      topics.push({
        chuong: chuong.tenChuong,
        noiDung: nd.tenNoiDung,
        soTiet: nd.soTiet || 0,
        mucDos: nd.mucDos || []
      });
    });
  });
  if (topics.length === 0) return [];

  // H\u00e0m t\u1ea1o c\u00e2u h\u1ecfi m\u1eabu
  const mkQ = (phan: CauHoi['phan'], nd: typeof topics[0], mucDo: string, content: string, dapAn: string): CauHoi => ({
    id: Date.now() + Math.random(),
    phan,
    soThuTu: 0,
    chuong: nd.chuong,
    noiDung: nd.noiDung,
    mucDo,
    yeuCau: nd.mucDos.find((m: any) =>
      mucDo === 'Nh\u1eadn bi\u1ebft' ? m.tenMucDo === 'Nh\u1eadn bi\u1ebft' :
      mucDo.includes('Th\u00f4ng hi\u1ec3u') ? m.tenMucDo === 'Th\u00f4ng hi\u1ec3u' :
      m.tenMucDo === 'V\u1eadn d\u1ee5ng'
    )?.yeuCau || '',
    noiDungCauHoi: content,
    dapAn
  });

  const nlcPool: CauHoi[] = [];
  const dsPool:  CauHoi[] = [];
  const tlnPool: CauHoi[] = [];

  // === PH\u1ea6N I: NLC ===
  // 7 c\u00e2u NH\u1eacN BI\u1ebeT ph\u00e2n b\u1ed5 theo s\u1ed1 ti\u1ebft
  allocateByTiet(QUOTA_NLC_NB, topics).forEach((count, i) => {
    const nd = topics[i];
    for (let k = 0; k < count; k++) {
      nlcPool.push(mkQ('nlc', nd, 'Nh\u1eadn bi\u1ebft',
        `[NH\u1eacN BI\u1ebeT] C\u00e2u h\u1ecfi tr\u1eafc nghi\u1ec7m v\u1ec1 "${nd.noiDung}".\nGi\u00e1o vi\u00ean \u0111i\u1ec1n n\u1ed9i dung c\u00e2u h\u1ecfi t\u1ea1i \u0111\u00e2y.\nA. Ph\u01b0\u01a1ng \u00e1n A\u2003B. Ph\u01b0\u01a1ng \u00e1n B\u2003C. Ph\u01b0\u01a1ng \u00e1n C\u2003D. Ph\u01b0\u01a1ng \u00e1n D`,
        'A'
      ));
    }
  });
  // 5 c\u00e2u TH\u00d4NG HI\u1ec2U ph\u00e2n b\u1ed5 theo s\u1ed1 ti\u1ebft
  allocateByTiet(QUOTA_NLC_TH, topics).forEach((count, i) => {
    const nd = topics[i];
    for (let k = 0; k < count; k++) {
      nlcPool.push(mkQ('nlc', nd, 'Th\u00f4ng hi\u1ec3u',
        `[TH\u00d4NG HI\u1ec2U] C\u00e2u h\u1ecfi tr\u1eafc nghi\u1ec7m v\u1ec1 "${nd.noiDung}".\nGi\u00e1o vi\u00ean \u0111i\u1ec1n n\u1ed9i dung c\u00e2u h\u1ecfi t\u1ea1i \u0111\u00e2y.\nA. Ph\u01b0\u01a1ng \u00e1n A\u2003B. Ph\u01b0\u01a1ng \u00e1n B\u2003C. Ph\u01b0\u01a1ng \u00e1n C\u2003D. Ph\u01b0\u01a1ng \u00e1n D`,
        'A'
      ));
    }
  });

  // === PH\u1ea6N II: \u0110\u00daNG SAI ===
  // 4 c\u00e2u ph\u00e2n b\u1ed5 theo s\u1ed1 ti\u1ebft, m\u1ed7i c\u00e2u 4 \u00fd: a)NB b)TH c)TH d)VD
  allocateByTiet(QUOTA_DS, topics).forEach((count, i) => {
    const nd = topics[i];
    for (let k = 0; k < count; k++) {
      dsPool.push(mkQ('ds', nd, 'H\u1ed7n h\u1ee3p (NB+TH+TH+VD)',
        `Cho c\u00e1c m\u1ec7nh \u0111\u1ec1 sau v\u1ec1 "${nd.noiDung}", x\u00e1c \u0111\u1ecbnh \u0111\u00fang (\u0110) ho\u1eb7c sai (S):\n` +
        `a) [Nh\u1eadn bi\u1ebft]\u00a0 M\u1ec7nh \u0111\u1ec1 1 \u2013 Gi\u00e1o vi\u00ean \u0111i\u1ec1n n\u1ed9i dung.\n` +
        `b) [Th\u00f4ng hi\u1ec3u] M\u1ec7nh \u0111\u1ec1 2 \u2013 Gi\u00e1o vi\u00ean \u0111i\u1ec1n n\u1ed9i dung.\n` +
        `c) [Th\u00f4ng hi\u1ec3u] M\u1ec7nh \u0111\u1ec1 3 \u2013 Gi\u00e1o vi\u00ean \u0111i\u1ec1n n\u1ed9i dung.\n` +
        `d) [V\u1eadn d\u1ee5ng]\u00a0\u00a0 M\u1ec7nh \u0111\u1ec1 4 \u2013 Gi\u00e1o vi\u00ean \u0111i\u1ec1n n\u1ed9i dung.`,
        'a) \u0110\u00fang\u2003b) Sai\u2003c) \u0110\u00fang\u2003d) Sai'
      ));
    }
  });

  // === PH\u1ea6N III: TR\u1ea2 L\u1edcI NG\u1eaeN ===
  // 2 c\u00e2u TH ph\u00e2n b\u1ed5 theo s\u1ed1 ti\u1ebft
  allocateByTiet(QUOTA_TLN_TH, topics).forEach((count, i) => {
    const nd = topics[i];
    for (let k = 0; k < count; k++) {
      tlnPool.push(mkQ('tln', nd, 'Th\u00f4ng hi\u1ec3u',
        `[TH\u00d4NG HI\u1ec2U] C\u00e2u h\u1ecfi tr\u1ea3 l\u1eddi ng\u1eafn v\u1ec1 "${nd.noiDung}".\nGi\u00e1o vi\u00ean \u0111i\u1ec1n n\u1ed9i dung c\u00e2u h\u1ecfi t\u1ea1i \u0111\u00e2y.`,
        '...'
      ));
    }
  });
  // 2 c\u00e2u VD ph\u00e2n b\u1ed5 theo s\u1ed1 ti\u1ebft
  allocateByTiet(QUOTA_TLN_VD, topics).forEach((count, i) => {
    const nd = topics[i];
    for (let k = 0; k < count; k++) {
      tlnPool.push(mkQ('tln', nd, 'V\u1eadn d\u1ee5ng',
        `[V\u1eacN D\u1ee4NG] C\u00e2u h\u1ecfi tr\u1ea3 l\u1eddi ng\u1eafn v\u1ec1 "${nd.noiDung}".\nGi\u00e1o vi\u00ean \u0111i\u1ec1n n\u1ed9i dung c\u00e2u h\u1ecfi t\u1ea1i \u0111\u00e2y.`,
        '...'
      ));
    }
  });
  // 2 c\u00e2u VDC ph\u00e2n b\u1ed5 theo s\u1ed1 ti\u1ebft
  allocateByTiet(QUOTA_TLN_VDC, topics).forEach((count, i) => {
    const nd = topics[i];
    for (let k = 0; k < count; k++) {
      tlnPool.push(mkQ('tln', nd, 'V\u1eadn d\u1ee5ng cao',
        `[V\u1eacN D\u1ee4NG CAO] C\u00e2u h\u1ecfi tr\u1ea3 l\u1eddi ng\u1eafn v\u1ec1 "${nd.noiDung}".\nGi\u00e1o vi\u00ean \u0111i\u1ec1n n\u1ed9i dung c\u00e2u h\u1ecfi t\u1ea1i \u0111\u00e2y.`,
        '...'
      ));
    }
  });

  // \u0110\u00e1nh l\u1ea1i STT v\u00e0 tr\u1ea3 v\u1ec1
  const nlc = nlcPool.slice(0, QUOTA_NLC_NB + QUOTA_NLC_TH).map((q, i) => ({ ...q, soThuTu: i + 1 }));
  const ds  = dsPool.slice(0, QUOTA_DS).map((q, i) => ({ ...q, soThuTu: i + 1 }));
  const tln = tlnPool.slice(0, QUOTA_TLN_TH + QUOTA_TLN_VD + QUOTA_TLN_VDC).map((q, i) => ({ ...q, soThuTu: i + 1 }));

  return [...nlc, ...ds, ...tln];
}







// ========== NGÂN HÀNG CÂU Hỏi TOÁN 12 (thập từ thuvienhoclieu.com) ==========
type QBankEntry = { mucDo: 'NB'|'TH'|'VD'|'VDC'; phan: 'nlc'|'ds'|'tln'; noiDung: string; dapAn: string; };

const QUESTION_BANK: Record<string, QBankEntry[]> = {
  // Tích phân / Nguyên hàm
  'default': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Hàm số nào sau đây là nguyên hàm của hàm số f(x) = 2x?\nA. F(x) = x² + 1\u2003B. F(x) = x² \u2013 3\u2003C. F(x) = 2x²\u2003D. F(x) = ½ x²', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Đạo hàm của hàm số y = x³ \u2013 3x + 2 là\nA. y’ = 3x² \u2013 3\u2003B. y’ = 3x² + 3\u2003C. y’ = x² \u2013 3\u2003D. y’ = 3x²', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Giá trị của ∫₀¹ x dx bằng:\nA. ½\u2003B. 1\u2003C. ¼\u2003D. 2', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Hàm số y = sin x có đạo hàm là:\nA. cos x\u2003B. \u2013sin x\u2003C. \u2013cos x\u2003D. sin x', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Trong các hàm số sau, hàm số nào đồng biến trên ℝ?\nA. y = 2x + 1\u2003B. y = \u2013x + 3\u2003C. y = x²\u2003D. y = \u2013x²', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Cực tri ểu của hàm số y = x² \u2013 4x + 3 là:\nA. x = 2\u2003B. x = \u22122\u2003C. x = 4\u2003D. x = 1', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Giới hạn lim(x→0) sin(x)/x bằng:\nA. 1\u2003B. 0\u2003C. ∞\u2003D. \u22121', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Cho hàm số y = x³ \u2013 3x² + 2. Hàm số đạt cực đại tại x bằng:\nA. x = 0\u2003B. x = 2\u2003C. x = \u22121\u2003D. x = 1', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Diện tích hình phẳng giới hạn bởi y = x² và y = x là:\nA. 1/6\u2003B. 1/3\u2003C. 1/2\u2003D. 1', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Nguyên hàm của f(x) = e^x + 1/x là:\nA. e^x + ln|x| + C\u2003B. e^x \u2013 1/x² + C\u2003C. xe^x + C\u2003D. e^x + x + C', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Tiệm cận đứng của đồ thị hàm số y = (2x+1)/(x\u22121) là:\nA. x = 1\u2003B. x = \u22121\u2003C. y = 2\u2003D. y = 1', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Giá trị nhỏ nhất của hàm y = x + 4/x trên (0; +∞) là:\nA. 4\u2003B. 5\u2003C. 6\u2003D. 8', dapAn:'A' },
  ],
  'nguyên hàm': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Họ nguyên hàm của hàm số f(x) = 3x² \u2013 2x + 1 là:\nA. x³ \u2013 x² + x + C\u2003B. x³ + x² \u2013 x + C\u2003C. 6x \u2013 2 + C\u2003D. 3x³ \u2013 x² + C', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] ∫ cos(x) dx bằng:\nA. sin(x) + C\u2003B. \u2013sin(x) + C\u2003C. \u2013cos(x) + C\u2003D. tan(x) + C', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] ∫ e^(2x) dx bằng:\nA. ½e^(2x) + C\u2003B. 2e^(2x) + C\u2003C. e^(2x) + C\u2003D. e^x + C', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Tính ∫(2x + 1)/(x² + x) dx bằng:\nA. ln|x² + x| + C\u2003B. 2ln|x| + C\u2003C. ln|2x + 1| + C\u2003D. 2/(x² + x) + C', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] ∫ x·e^x dx bằng:\nA. xe^x \u2013 e^x + C\u2003B. xe^x + e^x + C\u2003C. x²e^x + C\u2003D. e^x(x+1) \u2013 C', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Cho hàm số f(x) và F(x) = x³ \u2013 3x + 2. Xác định đúng (Đ)/sai (S):\na) [Nhận biết] F(x) là một nguyên hàm của f(x) = 3x² \u2013 3.\nb) [Thông hiểu] Họ nguyên hàm của f(x) là x³ \u2013 3x + C.\nc) [Thông hiểu] Giá trị của F(1) = 0.\nd) [Vận dụng] Nếu G(x) = F(x) \u2013 5 thì G(x) cũng là nguyên hàm của f(x).`, dapAn:'Đ Đ S Đ' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Tính ∫₀¹ (3x² \u2013 2x + 1) dx.`, dapAn:'2' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Tính diện tích hình phẳng giới hạn bởi đường cong y = x² \u2013 1 và trục hoành.`, dapAn:'4/3' },
  ],
  'tích phân': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Tích phân ∫₀¹ (2x + 1) dx bằng mấy?\nA. 2\u2003B. 1\u2003C. 3\u2003D. 0', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Công thức Newton\u2013Leibniz: ∫ᵃᴮ f(x)dx bằng:\nA. F(b)\u2013F(a)\u2003B. F(a)\u2013F(b)\u2003C. f(b)\u2013f(a)\u2003D. F(a)+F(b)', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] ∫₀ⁿ sin(x) dx bằng:\nA. 2\u2003B. 0\u2003C. 1\u2003D. \u22121', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Diện tích giới hạn bởi y = √x và y = x trên [0,1] là:\nA. 1/3\u2003B. 1/6\u2003C. 2/3\u2003D. 1/2', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] ∫₁² (x + 1/x) dx bằng:\nA. 3/2 + ln2\u2003B. 3/2 \u2013 ln2\u2003C. 2 + ln2\u2003D. 1 + ln2', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S) về tích phân:\na) [Nhận biết] ∫₀¹ x² dx = 1/3.\nb) [Thông hiểu] ∫₀ⁿ cos(x) dx = 0.\nc) [Thông hiểu] Nếu f(x) ≥ 0 trên [a,b] thì ∫ᵃᴮ f(x)dx ≥0.\nd) [Vận dụng] Diện tích hình phẳng giới hạn bởi y=x² và y=0 trên [0,1] bằng 1/3.`, dapAn:'Đ Đ Đ Đ' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Tính ∫₀² (x² + 2x) dx.`, dapAn:'20/3' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Tính diện tích hình phẳng giới hạn bởi y = x² và y = 2x.`, dapAn:'4/3' },
  ],
  'xác suất': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Không gian mẫu khi tung một con xcầu cân gồm bao nhiêu phần tử:\nA. 6\u2003B. 36\u2003C. 12\u2003D. 3', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Xác suất của biến cố chắc chắn bằng:\nA. 1\u2003B. 0\u2003C. 0.5\u2003D. không xác định', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Số tổ hợp chọn 2 vật từ 5 vật là:\nA. 10\u2003B. 20\u2003C. 5\u2003D. 15', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Tung hai xu xcầu. Xác suất xuất hiện hai mặt 6 chấm là:\nA. 1/36\u2003B. 1/6\u2003C. 1/12\u2003D. 1/3', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Một túi có 4 bi đỏ, 3 bi xanh. Rút ngẫu nhiên 2 bi. Xác suất được 1 đỏ 1 xanh là:\nA. 4/7\u2003B. 12/21\u2003C. 2/7\u2003D. 3/7', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S) về xác suất:\na) [Nhận biết] 0 ≤ P(A) ≤ 1 với mọi biến cố A.\nb) [Thông hiểu] Nếu A và B xung khắc thì P(A+B) = P(A) + P(B).\nc) [Thông hiểu] P(∅) = 1 vĩ ∅ là biến cố không thể.\nd) [Vận dụng] Biến cố bổ của A có xác suất P(\u0100) = 1 \u2013 P(A).`, dapAn:'Đ Đ S Đ' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Hộp chứa 5 bi đỏ, 3 bi xanh. Rút ngẫu nhiên 2 bi. Tính xác suất được cả 2 bi đỏ.`, dapAn:'5/14' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Một lớp có 30 HS, cần chọn 3 bạn tham gia đội tuyển. Tính số cách chọn sao cho có đủ nam và nữ (16 nam, 14 nữ).`, dapAn:'C(16,2)×C(14,1) + C(16,1)×C(14,2) = 1680 + 1456 = 3136' },
  ],
  'hàm số': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Hàm số y = x³ \u2013 3x² + 3x \u2013 1 có tiệm cận ngang là:\nA. Không có\u2003B. y = 1\u2003C. y = 0\u2003D. y = \u22121', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Hàm số nào sau đây là hàm bậc bốn?\nA. y = x⁴ \u2013 2x² + 1\u2003B. y = x³ \u2013 x\u2003C. y = 2x + 1\u2003D. y = x² + 1', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Hàm số y = (x+2)/(x\u22121) có tiệm cận đứng và ngang lần lượt là:\nA. x=1 và y=1\u2003B. x=1 và y=2\u2003C. x=\u22122 và y=1\u2003D. x=2 và y=\u22121', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Khoảng đồng biến của hàm y = x³ \u2013 3x là:\nA. (\u2212∞;\u22121) và (1;+∞)\u2003B. (\u22121;1)\u2003C. (0;+∞)\u2003D. (\u2212∞;0)', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S) về hàm số:\na) [Nhận biết] Hàm số bậc 3 y=ax³+bx²+cx+d (a≠0) có đúng một điểm cực tri.\nb) [Thông hiểu] Nếu f’(x₀)=0 thì x₀ là điểm cực tri của f.\nc) [Thông hiểu] Tiệm cận ngang của y=(x+1)/(x\u22121) là y=1.\nd) [Vận dụng] Hàm y = x³ \u2013 3x đạt cực đại tại x=\u22121, giá trị cực đại là 2.`, dapAn:'S S Đ Đ' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Tìm cực trị của hàm số y = 2x³ \u2013 3x² \u2013 12x + 1.`, dapAn:'CĐ: y(\u22121)=8; CT: y(2)=\u221319' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Cho hàm số y = (mx+1)/(x\u22121) có đồ thị đi qua A(2;3). Tìm m.`, dapAn:'m = 2' },
  ],
  'hình học': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Thể tích hình cầu bán kính R là:\nA. 4πR³/3\u2003B. 2πR³/3\u2003C. πR³\u2003D. 4πR³', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Diện tích mặt cầu bán kính R là:\nA. 4πR²\u2003B. 2πR²\u2003C. πR²\u2003D. 4πR', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Khối trụ có bán kính đáy r=2 và chiều cao h=3. Thể tích là:\nA. 12π\u2003B. 6π\u2003C. 4π\u2003D. 9π', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Tứ diện đều cạnh a có thể tích bằng:\nA. a³√2/12\u2003B. a³/6\u2003C. a³√3/12\u2003D. a³√2/6', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S) về hình khối:\na) [Nhận biết] Khối lập phương cạnh a có thể tích V = a³.\nb) [Thông hiểu] Hình cầu bán kính R có diện tích xung quanh bằng 4πR².\nc) [Thông hiểu] Khối nón chính có thể tích V = πr²h/3.\nd) [Vận dụng] Hình trụ bán kính r, chiều cao h có thể tích V = 2πr²h.`, dapAn:'Đ Đ Đ S' },
    { mucDo:'TH', phan:'tln', noiDung:`[THÔNG HIỂU] Khối hộp chữ nhật có ba cạnh tại một đỉnh là 2, 3, 4. Tính thể tích.`, dapAn:'24' },
    { mucDo:'VD', phan:'tln', noiDung:`[VẬN DỤNG] Hình nón có bán kính đáy r=3, đường sinh l=5. Tính thể tích.`, dapAn:'V = π¹4¹3²÷3 = 12π' },
  ],
  'số phức': [
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Mô đun của số phức z = 3 + 4i là:\nA. 5\u2003B. 7\u2003C. 25\u2003D. 1', dapAn:'A' },
    { mucDo:'NB', phan:'nlc', noiDung:'[NHẬN BIẾT] Số phức liên hợp của z = 2 \u2013 3i là:\nA. 2 + 3i\u2003B. \u22122 + 3i\u2003C. \u22122 \u2013 3i\u2003D. 3 \u2013 2i', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Giá trị của i¹⁰⁰ bằng:\nA. 1\u2003B. \u22121\u2003C. i\u2003D. \u2013i', dapAn:'A' },
    { mucDo:'TH', phan:'nlc', noiDung:'[THÔNG HIỂU] Phương trình z² + 4 = 0 có nghiệm là:\nA. z = ±2i\u2003B. z = ±2\u2003C. z = 2i\u2003D. z = \u22122i', dapAn:'A' },
    { mucDo:'NB', phan:'ds', noiDung:`Xác định đúng (Đ)/sai (S) về số phức:\na) [Nhận biết] Phần thực của z = 5 \u2013 3i bằng 5.\nb) [Thông hiểu] |z| = |z&#x304;| với mọi số phức z.\nc) [Thông hiểu] i² = \u22121.\nd) [Vận dụng] Mô đun của z=1+i là √2.`, dapAn:'Đ Đ Đ Đ' },
  ],
};

// Tìm câu hỏi phù hợp từ ngân hàng theo từ khóa
function getQuestionsFromBank(noiDung: string, phan: 'nlc'|'ds'|'tln', mucDo?: string): QBankEntry | undefined {
  const noi = noiDung.toLowerCase();
  // Tìm key phù hợp nhất
  const keys = Object.keys(QUESTION_BANK).filter(k => k !== 'default');
  const matchedKey = keys.find(k => noi.includes(k)) || 'default';
  const pool = QUESTION_BANK[matchedKey].filter(q =>
    q.phan === phan &&
    (!mucDo || mucDo.toLowerCase().includes(q.mucDo.toLowerCase().substring(0,2).toLowerCase()) || q.mucDo === mucDo)
  );
  if (pool.length === 0) {
    // Fallback to default pool
    const fallback = QUESTION_BANK['default'].filter(q => q.phan === phan);
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}





      nd.mucDos.forEach((md: any, mIdx: number) => {
        // Phần I: Trắc nghiệm nhiều phương án
        if (md.qs.nlc && md.qs.nlc.trim()) {
          const count = countQuestions(md.qs.nlc);
          for (let i = 0; i < count; i++) {
            nlcRaw.push({
              id: Date.now() + Math.random(),
              phan: 'nlc',
              soThuTu: nlcIdx++,
              chuong: chuong.tenChuong,
              noiDung: nd.tenNoiDung,
              mucDo: md.tenMucDo,
              yeuCau: md.yeuCau || '',
              noiDungCauHoi:
                `[${md.tenMucDo.toUpperCase()}] Câu hỏi trắc nghiệm về "${nd.tenNoiDung}".\n` +
                `Giáo viên điền nội dung câu hỏi tại đây.\n` +
                `A. Phương án A\u2003B. Phương án B\u2003C. Phương án C\u2003D. Phương án D`,
              dapAn: 'A'
            });
          }
        }
        // Phần II: Đúng / Sai – mỗi câu 4 ý theo cấu trúc a)NB b)NB c)TH d)VD
        if (md.qs.ds && md.qs.ds.trim()) {
          const count = countQuestions(md.qs.ds);
          for (let i = 0; i < count; i++) {
            dsRaw.push({
              id: Date.now() + Math.random(),
              phan: 'ds',
              soThuTu: dsIdx++,
              chuong: chuong.tenChuong,
              noiDung: nd.tenNoiDung,
              mucDo: md.tenMucDo,
              yeuCau: md.yeuCau || '',
              noiDungCauHoi:
                `Cho các mệnh đề sau về "${nd.tenNoiDung}", xác định đúng (Đ) hoặc sai (S):\n` +
                `a) [Nhận biết] Mệnh đề 1 – Giáo viên điền nội dung.\n` +
                `b) [Nhận biết] Mệnh đề 2 – Giáo viên điền nội dung.\n` +
                `c) [Thông hiểu] Mệnh đề 3 – Giáo viên điền nội dung.\n` +
                `d) [Vận dụng] Mệnh đề 4 – Giáo viên điền nội dung.`,
              dapAn: 'a) Đúng\u2003b) Sai\u2003c) Đúng\u2003d) Sai'
            });
          }
        }
        // Phần III: Trả lời ngắn – phân loại mIdx=1→TH, mIdx=2→VD/VDC
        if (md.qs.tln && md.qs.tln.trim()) {
          const count = countQuestions(md.qs.tln);
          for (let i = 0; i < count; i++) {
            const isTH = mIdx === 1;
            const pool = isTH ? tlnTH : tlnVD;
            pool.push({
              id: Date.now() + Math.random(),
              phan: 'tln',
              soThuTu: 0,
              chuong: chuong.tenChuong,
              noiDung: nd.tenNoiDung,
              mucDo: isTH ? 'Thông hiểu' : 'Vận dụng',
              yeuCau: md.yeuCau || '',
              noiDungCauHoi:
                `[${isTH ? 'THÔNG HIỂU' : 'VẬN DỤNG'}] Câu hỏi trả lời ngắn về "${nd.tenNoiDung}".\n` +
                `Giáo viên điền nội dung câu hỏi tại đây.`,
              dapAn: '...'
            });
          }
        }
      });
    });
  });

  // === CHUẨN HÓA THEO QUOTA CHUẨN ===
  // Phần I: 12 câu Trắc nghiệm nhiều phương án
  const nlc = nlcRaw.slice(0, 12).map((q, i) => ({ ...q, soThuTu: i + 1 }));

  // Phần II: 4 câu Đúng/Sai (mỗi câu 4 ý, tổng 16 ý NB+NB+TH+VD)
  const ds = dsRaw.slice(0, 4).map((q, i) => ({ ...q, soThuTu: i + 1 }));

  // Phần III: 6 câu TLN = 2 TH + 2 VD + 2 VDC
  const tlnTHFinal = tlnTH.slice(0, 2).map((q, i) => ({
    ...q,
    soThuTu: i + 1,
    mucDo: 'Thông hiểu',
    noiDungCauHoi: q.noiDungCauHoi.replace(/\[.*?\]/, '[THÔNG HIỂU]')
  }));
  const tlnVDFinal = tlnVD.slice(0, 2).map((q, i) => ({
    ...q,
    soThuTu: tlnTHFinal.length + i + 1,
    mucDo: 'Vận dụng',
    noiDungCauHoi: q.noiDungCauHoi.replace(/\[.*?\]/, '[VẬN DỤNG]')
  }));
  const tlnVDCFinal = tlnVD.slice(2, 4).map((q, i) => ({
    ...q,
    soThuTu: tlnTHFinal.length + tlnVDFinal.length + i + 1,
    mucDo: 'Vận dụng cao',
    noiDungCauHoi: q.noiDungCauHoi.replace(/\[.*?\]/, '[VẬN DỤNG CAO]')
  }));

  const tln = [...tlnTHFinal, ...tlnVDFinal, ...tlnVDCFinal].slice(0, 6);

  return [...nlc, ...ds, ...tln];
}


function TabTaoDeTuDong({ data, countQuestions }: { data: any[], countQuestions: (s: string) => number }) {
  const [cauHois, setCauHois] = React.useState<CauHoi[]>([]);
  const [isGenerated, setIsGenerated] = React.useState(false);
  const [tenTruong, setTenTruong] = React.useState('TRƯỜNG THPT ...');
  const [tenDe, setTenDe] = React.useState('ĐỀ KIỂM TRA MÔN TOÁN 12');
  const [thoiGian, setThoiGian] = React.useState('90');
  const [nguonTaiLieu, setNguonTaiLieu] = React.useState('thuvienhoclieu.com');
  const [hienThiDapAn, setHienThiDapAn] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [warnMsg, setWarnMsg] = React.useState<string>('');

  const QUOTA = { nlc: 12, ds: 4, tln: 6 };
  const hasData = data.some(c => c.tenChuong && c.noiDungs.some((nd: any) => nd.tenNoiDung));
  const nlcQuestions = cauHois.filter(q => q.phan === 'nlc');
  const dsQuestions  = cauHois.filter(q => q.phan === 'ds');
  const tlnQuestions = cauHois.filter(q => q.phan === 'tln');

  const handleGenerate = () => {
    const qs = generateExamQuestions(data, countQuestions);
    setCauHois(qs);
    setIsGenerated(true);
    setEditingId(null);
    // Kiểm tra và cảnh báo nếu thiếu câu
    const nlcRaw = qs.filter(q => q.phan === 'nlc').length;
    const dsRaw  = qs.filter(q => q.phan === 'ds').length;
    const tlnRaw = qs.filter(q => q.phan === 'tln').length;
    const warns: string[] = [];
    if (nlcRaw < QUOTA.nlc) warns.push(`Trắc nghiệm nhiều phương án: ma trận có ${nlcRaw}/${QUOTA.nlc} câu`);
    if (dsRaw  < QUOTA.ds)  warns.push(`Đúng/Sai: ma trận có ${dsRaw}/${QUOTA.ds} câu`);
    if (tlnRaw < QUOTA.tln) warns.push(`Trả lời ngắn: ma trận có ${tlnRaw}/${QUOTA.tln} câu`);
    setWarnMsg(warns.length ? '⚠️ Lưu ý: ' + warns.join(' · ') : '');
  };

  const handleUpdateCauHoi = (id: number, field: keyof CauHoi, value: string) => {
    setCauHois(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const exportExamToWord = () => {
    const phanI = nlcQuestions.map((q, i) => `
      <tr>
        <td style="border:1px solid #ccc;padding:8px;width:30px;text-align:center;font-weight:bold">${i + 1}</td>
        <td style="border:1px solid #ccc;padding:8px;">${q.noiDungCauHoi.replace(/\n/g, '<br/>')}</td>
        <td style="border:1px solid #ccc;padding:8px;text-align:center;">${q.mucDo}</td>
        <td style="border:1px solid #ccc;padding:8px;text-align:center;">${q.dapAn}</td>
      </tr>`).join('');

    const phanII = dsQuestions.map((q, i) => `
      <tr>
        <td style="border:1px solid #ccc;padding:8px;width:30px;text-align:center;font-weight:bold">${i + 1}</td>
        <td style="border:1px solid #ccc;padding:8px;">${q.noiDungCauHoi.replace(/\n/g, '<br/>')}</td>
        <td style="border:1px solid #ccc;padding:8px;text-align:center;">${q.mucDo}</td>
        <td style="border:1px solid #ccc;padding:8px;text-align:center;">${q.dapAn}</td>
      </tr>`).join('');

    const phanIII = tlnQuestions.map((q, i) => `
      <tr>
        <td style="border:1px solid #ccc;padding:8px;width:30px;text-align:center;font-weight:bold">${i + 1}</td>
        <td style="border:1px solid #ccc;padding:8px;">${q.noiDungCauHoi.replace(/\n/g, '<br/>')}</td>
        <td style="border:1px solid #ccc;padding:8px;text-align:center;">${q.mucDo}</td>
        <td style="border:1px solid #ccc;padding:8px;text-align:center;">${q.dapAn}</td>
      </tr>`).join('');

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${tenDe}</title>
      <style>
        body { font-family: "Times New Roman", Times, serif; font-size: 12pt; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 6px; vertical-align: top; }
        th { background: #f0f0f0; font-weight: bold; text-align: center; }
        h1,h2,h3 { text-align: center; }
        .section-title { background: #1e293b; color: white; padding: 8px; font-weight: bold; margin: 20px 0 10px; }
      </style>
      </head>
      <body>
        <p style="text-align:center;font-weight:bold">${tenTruong}</p>
        <h2>${tenDe}</h2>
        <p style="text-align:center">Thời gian làm bài: ${thoiGian} phút (không kể thời gian phát đề)</p>
        <p style="text-align:right;font-style:italic;font-size:10pt;color:#555">📚 Nguồn tài liệu: ${nguonTaiLieu}</p>
        <hr/>

        <div class="section-title">PHẦN I. TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN (${nlcQuestions.length} câu)</div>
        <p><em>Mỗi câu trả lời đúng được 0,25 điểm. Thí sinh chỉ chọn một phương án.</em></p>
        <table>
          <tr><th>STT</th><th>Nội dung câu hỏi</th><th>Mức độ</th><th>Đáp án</th></tr>
          ${phanI}
        </table>

        <div class="section-title">PHẦN II. TRẮC NGHIỆM ĐÚNG / SAI (${dsQuestions.length} câu)</div>
        <p><em>Mỗi câu có 4 mệnh đề. Thí sinh xác định đúng (Đ) / sai (S) cho mỗi mệnh đề.</em></p>
        <table>
          <tr><th>STT</th><th>Nội dung câu hỏi</th><th>Mức độ</th><th>Đáp án</th></tr>
          ${phanII}
        </table>

        <div class="section-title">PHẦN III. TRẢ LỜI NGẮN (${tlnQuestions.length} câu)</div>
        <p><em>Thí sinh điền đáp số vào ô trả lời.</em></p>
        <table>
          <tr><th>STT</th><th>Nội dung câu hỏi</th><th>Mức độ</th><th>Đáp án</th></tr>
          ${phanIII}
        </table>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'De_Thi_Tu_Dong.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const phanColors = {
    nlc: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', headerBg: 'bg-emerald-600' },
    ds:  { bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700',   headerBg: 'bg-amber-600'   },
    tln: { bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-700',    headerBg: 'bg-rose-600'    },
  };

  return (
    <motion.div
      key="tao-de"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header / Config card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Tạo đề thi tự động</h2>
            </div>
            <p className="text-slate-500 text-sm ml-[52px]">Sinh đề thi theo đúng cấu trúc ma trận và bảng đặc tả đã thiết lập.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {isGenerated && (
              <>
                <button
                  onClick={() => setHienThiDapAn(!hienThiDapAn)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center transition-all border-2 ${
                    hienThiDapAn ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {hienThiDapAn ? 'Ẩn đáp án' : 'Hiện đáp án'}
                </button>
                <button
                  onClick={exportExamToWord}
                  className="px-5 py-2.5 bg-sky-600 text-white rounded-xl font-bold text-sm flex items-center hover:bg-sky-700 transition-all shadow-md"
                >
                  <Download className="w-4 h-4 mr-2" /> Xuất Word
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thông tin đề */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tên trường / Đơn vị</label>
            <input
              className="w-full p-3 border-2 border-slate-100 rounded-xl focus:border-indigo-400 outline-none bg-slate-50 font-bold text-slate-800 text-sm transition"
              value={tenTruong}
              onChange={e => setTenTruong(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tên đề thi</label>
            <input
              className="w-full p-3 border-2 border-slate-100 rounded-xl focus:border-indigo-400 outline-none bg-slate-50 font-bold text-slate-800 text-sm transition"
              value={tenDe}
              onChange={e => setTenDe(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Thời gian (phút)</label>
            <input
              type="number"
              className="w-full p-3 border-2 border-slate-100 rounded-xl focus:border-indigo-400 outline-none bg-slate-50 font-black text-slate-800 text-sm transition"
              value={thoiGian}
              onChange={e => setThoiGian(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">Nguồn tài liệu</label>
            <input
              className="w-full p-3 border-2 border-indigo-100 rounded-xl focus:border-indigo-400 outline-none bg-indigo-50/50 font-bold text-indigo-700 text-sm transition"
              value={nguonTaiLieu}
              onChange={e => setNguonTaiLieu(e.target.value)}
              placeholder="ví dụ: thuvienhoclieu.com"
            />
          </div>
        </div>

        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
            <AlertCircle className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-bold text-slate-400">Chưa có dữ liệu ma trận</p>
            <p className="text-sm text-slate-400 mt-1">Vui lòng thiết lập chương và nội dung kiến thức tại tab <strong>Nhập liệu</strong> trước.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {!isGenerated ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-indigo-300" />
                </div>
                <p className="text-slate-500 mb-6 text-sm">Nhấn nút bên dưới để sinh đề thi tự động từ ma trận và bảng đặc tả đã cài đặt.</p>
                <button
                  onClick={handleGenerate}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-base flex items-center mx-auto shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-3" /> Sinh đề thi tự động
                </button>
              </div>
            ) : (
              <div className="w-full">
                {/* C\u1ea3nh b\u00e1o n\u1ebfu thi\u1ebfu c\u00e2u */}
                {warnMsg && (
                  <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs font-bold text-amber-700">{warnMsg}. Vui l\u00f2ng ki\u1ec3m tra l\u1ea1i ma tr\u1eadn t\u1ea1i tab <strong>Nh\u1eadp li\u1ec7u</strong>.</p>
                  </div>
                )}
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className={`rounded-2xl p-4 flex items-center gap-4 border ${nlcQuestions.length < QUOTA.nlc ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-100'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${nlcQuestions.length < QUOTA.nlc ? 'bg-amber-500' : 'bg-emerald-500'}`}><span className="text-white font-black text-sm">I</span></div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-wider ${nlcQuestions.length < QUOTA.nlc ? 'text-amber-700' : 'text-emerald-700'}`}>Nhi\u1ec1u l\u1ef1a ch\u1ecdn</p>
                      <p className="text-2xl font-black text-slate-900">
                        {nlcQuestions.length}<span className="text-sm text-slate-400 font-bold">/{QUOTA.nlc}</span> <span className="text-xs text-slate-400 font-medium">c\u00e2u</span>
                      </p>
                    </div>
                  </div>
                  <div className={`rounded-2xl p-4 flex items-center gap-4 border ${dsQuestions.length < QUOTA.ds ? 'bg-amber-50 border-amber-200' : 'bg-amber-50 border-amber-100'}`}>
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center"><span className="text-white font-black text-sm">II</span></div>
                    <div>
                      <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider">\u0110\u00fang / Sai</p>
                      <p className="text-2xl font-black text-slate-900">
                        {dsQuestions.length}<span className="text-sm text-slate-400 font-bold">/{QUOTA.ds}</span> <span className="text-xs text-slate-400 font-medium">c\u00e2u</span>
                      </p>
                    </div>
                  </div>
                  <div className={`rounded-2xl p-4 flex items-center gap-4 border ${tlnQuestions.length < QUOTA.tln ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-100'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tlnQuestions.length < QUOTA.tln ? 'bg-amber-500' : 'bg-rose-500'}`}><span className="text-white font-black text-sm">III</span></div>
                    <div>
                      <p className={`text-[10px] font-black uppercase tracking-wider ${tlnQuestions.length < QUOTA.tln ? 'text-amber-700' : 'text-rose-700'}`}>Tr\u1ea3 l\u1eddi ng\u1eafn</p>
                      <p className="text-2xl font-black text-slate-900">
                        {tlnQuestions.length}<span className="text-sm text-slate-400 font-bold">/{QUOTA.tln}</span> <span className="text-xs text-slate-400 font-medium">c\u00e2u</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={handleGenerate}
                    className="px-6 py-2.5 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl font-bold text-xs hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-2" /> Sinh l\u1ea1i \u0111\u1ec1 m\u1edbi
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* \u0110\u1ec1 thi */}
      {isGenerated && cauHois.length > 0 && (
        <>
          {/* Banner th\u00f4ng tin \u0111\u1ec1 */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Th\u00f4ng tin \u0111\u1ec1 thi</p>
              <p className="text-lg font-black text-slate-900">{tenDe}</p>
              <p className="text-sm text-slate-500">{tenTruong} &nbsp;&middot;&nbsp; Th\u1eddi gian: <strong>{thoiGian} ph\u00fat</strong></p>
            </div>
            {nguonTaiLieu && (
              <a
                href={nguonTaiLieu.startsWith('http') ? nguonTaiLieu : `https://${nguonTaiLieu}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border-2 border-indigo-100 rounded-2xl text-indigo-700 font-bold text-sm hover:bg-indigo-100 transition-all flex-shrink-0"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ngu\u1ed3n: <span className="underline">{nguonTaiLieu}</span></span>
              </a>
            )}
          </div>

          {/* PH\u1ea6N I */}
          {nlcQuestions.length > 0 && (

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-emerald-600 px-8 py-5 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-black text-lg">PHẦN I. TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN</h3>
                  <p className="text-emerald-100 text-xs mt-0.5">Mỗi câu trả lời đúng được 0,25 điểm · Chọn một phương án đúng nhất</p>
                </div>
                <span className="bg-white/20 text-white font-black text-2xl px-4 py-2 rounded-2xl">{nlcQuestions.length}</span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {nlcQuestions.map((q, i) => (
                  <QuestionCard key={q.id} q={q} idx={i} label={String(q.soThuTu)} phanColors={phanColors} editingId={editingId} setEditingId={setEditingId} hienThiDapAn={hienThiDapAn} handleUpdateCauHoi={handleUpdateCauHoi} />
                ))}
              </div>
            </div>
          )}

          {/* PHẦN II */}
          {dsQuestions.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-amber-500 px-8 py-5 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-black text-lg">PHẦN II. TRẮC NGHIỆM ĐÚNG / SAI</h3>
                  <p className="text-amber-100 text-xs mt-0.5">Mỗi câu có 4 mệnh đề · Xác định đúng (Đ) hoặc sai (S)</p>
                </div>
                <span className="bg-white/20 text-white font-black text-2xl px-4 py-2 rounded-2xl">{dsQuestions.length}</span>
              </div>
              <div className="p-6 grid grid-cols-1 gap-4">
                {dsQuestions.map((q, i) => (
                  <QuestionCard key={q.id} q={q} idx={i} label={String(q.soThuTu)} phanColors={phanColors} editingId={editingId} setEditingId={setEditingId} hienThiDapAn={hienThiDapAn} handleUpdateCauHoi={handleUpdateCauHoi} />
                ))}
              </div>
            </div>
          )}

          {/* PHẦN III */}
          {tlnQuestions.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-rose-600 px-8 py-5 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-black text-lg">PHẦN III. TRẢ LỜI NGẮN</h3>
                  <p className="text-rose-100 text-xs mt-0.5">Thí sinh ghi kết quả vào ô trả lời · Mỗi câu đúng 0,5 điểm</p>
                </div>
                <span className="bg-white/20 text-white font-black text-2xl px-4 py-2 rounded-2xl">{tlnQuestions.length}</span>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {tlnQuestions.map((q, i) => (
                  <QuestionCard key={q.id} q={q} idx={i} label={String(q.soThuTu)} phanColors={phanColors} editingId={editingId} setEditingId={setEditingId} hienThiDapAn={hienThiDapAn} handleUpdateCauHoi={handleUpdateCauHoi} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// Component v\u1ebd h\u00ecnh minh h\u1ecda SVG theo ch\u1ee7 \u0111\u1ec1
function MathDiagramSVG({ noiDung, phan }: { noiDung: string; phan: string }) {
  const noi = noiDung.toLowerCase();
  const uid = React.useId().replace(/:/g, '');

  // TICH PHAN / NGUYEN HAM \u2013 Di\u1ec7n t\u00edch d\u01b0\u1edbi \u0111\u01b0\u1eddng cong
  if (noi.includes('t\u00edch ph\u00e2n') || noi.includes('nguy\u00ean h\u00e0m')) {
    return (
      <svg viewBox="0 0 320 200" className="w-full" aria-label="H\u00ecnh minh h\u1ecda t\u00edch ph\u00e2n">
        <defs>
          <marker id={`arr-${uid}`} markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <polygon points="0,0 7,3.5 0,7" fill="#94a3b8"/>
          </marker>
          <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        {/* L\u01b0\u1edbi */}
        {[50,90,130,170].map(y=><line key={y} x1="40" y1={y} x2="300" y2={y} stroke="#f1f5f9" strokeWidth="1"/>)}
        {[80,130,180,230].map(x=><line key={x} x1={x} y1="10" x2={x} y2="175" stroke="#f1f5f9" strokeWidth="1"/>)}
        {/* Tr\u1ee5c */}
        <line x1="40" y1="170" x2="300" y2="170" stroke="#94a3b8" strokeWidth="1.8" markerEnd={`url(#arr-${uid})`}/>
        <line x1="50" y1="185" x2="50" y2="10" stroke="#94a3b8" strokeWidth="1.8" markerEnd={`url(#arr-${uid})`}/>
        {/* V\u00f9ng di\u1ec7n t\u00edch t\u00f4 m\u00e0u */}
        <path d="M 100,170 L 100,100 C 130,80 160,60 200,55 C 220,53 230,58 240,80 L 240,170 Z"
              fill={`url(#grad-${uid})`} stroke="#6366f1" strokeWidth="0.5"/>
        {/* \u0110\u01b0\u1eddng cong y=f(x) */}
        <path d="M 60,155 C 80,140 90,120 100,100 C 130,80 160,60 200,55 C 225,52 250,65 280,95"
              fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Nh\u00e3n a, b */}
        <line x1="100" y1="170" x2="100" y2="98" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="240" y1="170" x2="240" y2="78" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3"/>
        <text x="96" y="183" fontSize="12" fill="#6366f1" fontWeight="bold" fontFamily="serif">a</text>
        <text x="236" y="183" fontSize="12" fill="#6366f1" fontWeight="bold" fontFamily="serif">b</text>
        {/* Ch\u1eef S */}
        <text x="160" y="135" fontSize="16" fill="#6366f1" fontWeight="bold" fontFamily="serif">S</text>
        {/* Nh\u00e3n tr\u1ee5c */}
        <text x="290" y="180" fontSize="11" fill="#94a3b8" fontStyle="italic">x</text>
        <text x="55" y="16" fontSize="11" fill="#94a3b8" fontStyle="italic">y</text>
        <text x="52" y="167" fontSize="9" fill="#94a3b8">O</text>
        {/* Nh\u00e3n h\u00e0m */}
        <text x="245" y="80" fontSize="11" fill="#6366f1" fontStyle="italic">y=f(x)</text>
        {/* K\u00fd hi\u1ec7u t\u00edch ph\u00e2n */}
        <text x="8" y="125" fontSize="30" fill="#6366f1" fontFamily="serif">\u222b</text>
        <text x="32" y="108" fontSize="9" fill="#6366f1">b</text>
        <text x="32" y="136" fontSize="9" fill="#6366f1">a</text>
      </svg>
    );
  }

  // XAC SUAT \u2013 Bi\u1ec3u \u0111\u1ed3 c\u00e2y x\u00e1c su\u1ea5t
  if (noi.includes('x\u00e1c su\u1ea5t') || noi.includes('bi\u1ebfn c\u1ed1') || noi.includes('bayes') || noi.includes('to\u00e0n ph\u1ea7n')) {
    return (
      <svg viewBox="0 0 320 200" className="w-full" aria-label="C\u00e2y x\u00e1c su\u1ea5t">
        <defs>
          <marker id={`arr2-${uid}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0,0 6,3 0,6" fill="#6366f1"/>
          </marker>
        </defs>
        {/* N\u00fat g\u1ed1c */}
        <circle cx="50" cy="100" r="16" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeWidth="2"/>
        <text x="50" y="104" fontSize="10" fill="#6366f1" fontWeight="bold" textAnchor="middle">\u03a9</text>
        {/* N\u00fat A, \u0100 */}
        <circle cx="170" cy="55" r="16" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="2"/>
        <text x="170" y="59" fontSize="11" fill="#10b981" fontWeight="bold" textAnchor="middle">A</text>
        <circle cx="170" cy="145" r="16" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="2"/>
        <text x="170" y="149" fontSize="11" fill="#f59e0b" fontWeight="bold" textAnchor="middle">\u0100</text>
        {/* N\u00fat B|A, \u0181|A, B|\u0100, \u0181|\u0100 */}
        <circle cx="285" cy="30" r="14" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="1.5"/>
        <text x="285" y="34" fontSize="9" fill="#10b981" fontWeight="bold" textAnchor="middle">B</text>
        <circle cx="285" cy="75" r="14" fill="#10b981" fillOpacity="0.1" stroke="#10b981" strokeWidth="1.5"/>
        <text x="285" y="79" fontSize="9" fill="#10b981" fontWeight="bold" textAnchor="middle">\u0181</text>
        <circle cx="285" cy="125" r="14" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1.5"/>
        <text x="285" y="129" fontSize="9" fill="#f59e0b" fontWeight="bold" textAnchor="middle">B</text>
        <circle cx="285" cy="170" r="14" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="1.5"/>
        <text x="285" y="174" fontSize="9" fill="#f59e0b" fontWeight="bold" textAnchor="middle">\u0181</text>
        {/* \u0110\u01b0\u1eddng n\u1ed1i */}
        <line x1="66" y1="88" x2="154" y2="62" stroke="#6366f1" strokeWidth="1.5" markerEnd={`url(#arr2-${uid})`}/>
        <line x1="66" y1="112" x2="154" y2="138" stroke="#6366f1" strokeWidth="1.5" markerEnd={`url(#arr2-${uid})`}/>
        <line x1="186" y1="48" x2="271" y2="34" stroke="#10b981" strokeWidth="1.5" markerEnd={`url(#arr2-${uid})`}/>
        <line x1="186" y1="60" x2="271" y2="72" stroke="#10b981" strokeWidth="1.5" markerEnd={`url(#arr2-${uid})`}/>
        <line x1="186" y1="138" x2="271" y2="128" stroke="#f59e0b" strokeWidth="1.5" markerEnd={`url(#arr2-${uid})`}/>
        <line x1="186" y1="152" x2="271" y2="167" stroke="#f59e0b" strokeWidth="1.5" markerEnd={`url(#arr2-${uid})`}/>
        {/* X\u00e1c su\u1ea5t */}
        <text x="95" y="68" fontSize="9" fill="#6366f1">P(A)</text>
        <text x="95" y="138" fontSize="9" fill="#6366f1">P(\u0100)</text>
        <text x="215" y="42" fontSize="8" fill="#10b981">P(B|A)</text>
        <text x="215" y="72" fontSize="8" fill="#10b981">P(\u0181|A)</text>
        <text x="215" y="125" fontSize="8" fill="#f59e0b">P(B|\u0100)</text>
        <text x="215" y="165" fontSize="8" fill="#f59e0b">P(\u0181|\u0100)</text>
      </svg>
    );
  }

  // HAM SO \u2013 \u0110\u01b0\u1eddng cong h\u00e0m s\u1ed1
  if (noi.includes('h\u00e0m s\u1ed1') || noi.includes('gi\u1edbi h\u1ea1n') || noi.includes('\u0111\u1ea1o h\u00e0m') || noi.includes('li\u00ean t\u1ee5c')) {
    return (
      <svg viewBox="0 0 320 200" className="w-full" aria-label="\u0110\u1ed3 th\u1ecb h\u00e0m s\u1ed1">
        <defs>
          <marker id={`arr3-${uid}`} markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
            <polygon points="0,0 7,3.5 0,7" fill="#94a3b8"/>
          </marker>
        </defs>
        {[40,80,120,160].map(y=><line key={y} x1="20" y1={y} x2="305" y2={y} stroke="#f1f5f9" strokeWidth="1"/>)}
        {[60,110,160,210,260].map(x=><line key={x} x1={x} y1="5" x2={x} y2="190" stroke="#f1f5f9" strokeWidth="1"/>)}
        {/* Tr\u1ee5c */}
        <line x1="20" y1="100" x2="305" y2="100" stroke="#94a3b8" strokeWidth="1.8" markerEnd={`url(#arr3-${uid})`}/>
        <line x1="160" y1="190" x2="160" y2="5" stroke="#94a3b8" strokeWidth="1.8" markerEnd={`url(#arr3-${uid})`}/>
        <text x="295" y="112" fontSize="11" fill="#94a3b8" fontStyle="italic">x</text>
        <text x="165" y="14" fontSize="11" fill="#94a3b8" fontStyle="italic">y</text>
        <text x="163" y="112" fontSize="9" fill="#94a3b8">O</text>
        {/* \u0110\u01b0\u1eddng cong b\u1eadc 3 */}
        <path d="M 30,160 C 60,155 90,140 120,120 C 140,108 150,100 160,100 C 175,100 195,95 220,70 C 250,40 275,25 300,20"
              fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
        {/* \u0110i\u1ec3m c\u1ef1c \u0111\u1ea1i / c\u1ef1c ti\u1ec3u */}
        <circle cx="110" cy="126" r="4" fill="#ef4444" stroke="white" strokeWidth="1.5"/>
        <text x="93" y="118" fontSize="9" fill="#ef4444">C\u0110</text>
        <circle cx="205" cy="83" r="4" fill="#10b981" stroke="white" strokeWidth="1.5"/>
        <text x="208" y="78" fontSize="9" fill="#10b981">CT</text>
        {/* \u0110\u01b0\u1eddng k\u1ebb */}
        <line x1="110" y1="126" x2="110" y2="100" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3"/>
        <line x1="205" y1="83" x2="205" y2="100" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3"/>
        <text x="106" y="114" fontSize="8" fill="#64748b">x\u2081</text>
        <text x="201" y="114" fontSize="8" fill="#64748b">x\u2082</text>
        <text x="185" y="55" fontSize="11" fill="#6366f1" fontStyle="italic">y=f(x)</text>
      </svg>
    );
  }

  // HINH HOC \u2013 H\u00ecnh kh\u1ed1i
  if (noi.includes('h\u00ecnh') || noi.includes('kh\u1ed1i') || noi.includes('th\u1ec3 t\u00edch') || noi.includes('di\u1ec7n t\u00edch')) {
    return (
      <svg viewBox="0 0 320 200" className="w-full" aria-label="H\u00ecnh h\u1ecdc kh\u00f4ng gian">
        {/* H\u00ecnh h\u1ed9p ch\u1eef nh\u1eadt 3D */}
        <polygon points="80,160 200,160 200,80 80,80" fill="#6366f1" fillOpacity="0.08" stroke="#6366f1" strokeWidth="1.5"/>
        <polygon points="200,160 260,120 260,40 200,80" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeWidth="1.5"/>
        <polygon points="80,80 200,80 260,40 140,40" fill="#6366f1" fillOpacity="0.2" stroke="#6366f1" strokeWidth="1.5"/>
        {/* C\u1ea1nh \u1ea9n */}
        <line x1="80" y1="160" x2="140" y2="120" stroke="#6366f1" strokeWidth="1" strokeDasharray="4,3"/>
        <line x1="140" y1="120" x2="260" y2="120" stroke="#6366f1" strokeWidth="1" strokeDasharray="4,3"/>
        <line x1="140" y1="120" x2="140" y2="40" stroke="#6366f1" strokeWidth="1" strokeDasharray="4,3"/>
        {/* Nh\u00e3n \u0111\u1ec9nh */}
        {[['80','80','A'],['200','80','B'],['200','160','C'],['80','160','D'],
          ['140','40','E'],['260','40','F'],['260','120','G'],['140','120','H']].map(([x,y,l])=>(
          <text key={l} x={parseInt(x)+(l==='A'||l==='D'||l==='E'||l==='H'?-14:4)} y={parseInt(y)+(l==='C'||l==='D'?14:l==='A'||l==='B'?-4:4)}
                fontSize="11" fill="#475569" fontWeight="bold">{l}</text>
        ))}
        {/* K\u00edch th\u01b0\u1edbc */}
        <line x1="80" y1="170" x2="200" y2="170" stroke="#94a3b8" strokeWidth="1"/>
        <text x="135" y="182" fontSize="9" fill="#64748b" textAnchor="middle">a</text>
        <line x1="210" y1="80" x2="210" y2="160" stroke="#94a3b8" strokeWidth="1"/>
        <text x="218" y="124" fontSize="9" fill="#64748b">b</text>
        <line x1="202" y1="77" x2="263" y2="37" stroke="#94a3b8" strokeWidth="1"/>
        <text x="240" y="55" fontSize="9" fill="#64748b">c</text>
      </svg>
    );
  }

  // M\u1eb8C \u0110\u1ecaNH \u2013 H\u1ec7 tr\u1ee5c to\u1ea1 \u0111\u1ed9 v\u1edbi \u0111i\u1ec3m
  return (
    <svg viewBox="0 0 320 200" className="w-full" aria-label="H\u1ec7 tr\u1ee5c to\u1ea1 \u0111\u1ed9">
      <defs>
        <marker id={`arr4-${uid}`} markerWidth="7" markerHeight="7" refX="4" refY="3.5" orient="auto">
          <polygon points="0,0 7,3.5 0,7" fill="#94a3b8"/>
        </marker>
      </defs>
      {[40,80,120,160].map(y=><line key={y} x1="20" y1={y} x2="305" y2={y} stroke="#f8fafc" strokeWidth="1.5"/>)}
      {[60,110,160,210,260].map(x=><line key={x} x1={x} y1="5" x2={x} y2="190" stroke="#f8fafc" strokeWidth="1.5"/>)}
      <line x1="20" y1="110" x2="305" y2="110" stroke="#94a3b8" strokeWidth="1.8" markerEnd={`url(#arr4-${uid})`}/>
      <line x1="160" y1="190" x2="160" y2="5" stroke="#94a3b8" strokeWidth="1.8" markerEnd={`url(#arr4-${uid})`}/>
      {/* \u0110\u01b0\u1eddng cong m\u1eabu */}
      <path d="M 30,170 C 70,150 110,100 160,80 C 210,60 250,50 295,48"
            fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M 30,60 C 70,62 100,70 140,90 C 175,108 230,140 295,170"
            fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3"/>
      <text x="285" y="122" fontSize="11" fill="#94a3b8" fontStyle="italic">x</text>
      <text x="165" y="14" fontSize="11" fill="#94a3b8" fontStyle="italic">y</text>
      <text x="163" y="124" fontSize="9" fill="#94a3b8">O</text>
      <text x="270" y="44" fontSize="10" fill="#6366f1" fontStyle="italic">f(x)</text>
      <text x="270" y="168" fontSize="10" fill="#f59e0b" fontStyle="italic">g(x)</text>
    </svg>
  );
}

// Component c\u00e2u h\u1ecfi ri\u00eang (\u0111\u00fang chu\u1ea9n React component)
type PhanColors = Record<string, { bg: string; border: string; text: string; badge: string; headerBg: string }>;

function QuestionCard({
  q, idx, label, phanColors, editingId, setEditingId, hienThiDapAn, handleUpdateCauHoi
}: {
  q: CauHoi;
  idx: number;
  label: string;
  phanColors: PhanColors;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  hienThiDapAn: boolean;
  handleUpdateCauHoi: (id: number, field: keyof CauHoi, value: string) => void;
}) {
  const c = phanColors[q.phan];
  const isEditing = editingId === q.id;
  const [showDiagram, setShowDiagram] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.03 }}
      className={`rounded-2xl border-2 ${c.border} ${c.bg} p-5`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`w-8 h-8 rounded-xl ${c.headerBg} text-white font-black text-sm flex items-center justify-center flex-shrink-0`}>{label}</span>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${c.badge}`}>{q.mucDo.toUpperCase()}</span>
          <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{q.noiDung}</span>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={() => setShowDiagram(!showDiagram)}
            title="Hi\u1ec7n / \u1ea8n h\u00ecnh minh h\u1ecda"
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
              showDiagram ? 'bg-violet-600 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:border-violet-300 hover:text-violet-600'
            }`}
          >
            \ud83d\udcca H\u00ecnh
          </button>
          <button
            onClick={() => setEditingId(isEditing ? null : q.id)}
            className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-all ${
              isEditing ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            {isEditing ? '\u2713 Xong' : '\u270f\ufe0f S\u1eeda'}
          </button>
        </div>
      </div>

      {/* H\u00ecnh minh h\u1ecda */}
      <AnimatePresence>
        {showDiagram && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-white/70 rounded-2xl border border-slate-200 p-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">
                H\u00ecnh minh h\u1ecda m\u00f4 ph\u1ecfng \u2022 {q.noiDung}
              </p>
              <MathDiagramSVG noiDung={q.noiDung} phan={q.phan} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">N\u1ed9i dung c\u00e2u h\u1ecfi</label>
            <textarea
              className="w-full p-3 border-2 border-indigo-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition bg-white resize-none"
              rows={5}
              value={q.noiDungCauHoi}
              onChange={e => handleUpdateCauHoi(q.id, 'noiDungCauHoi', e.target.value)}
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">\u0110\u00e1p \u00e1n</label>
            <input
              className="w-full p-2.5 border-2 border-indigo-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition bg-white"
              value={q.dapAn}
              onChange={e => handleUpdateCauHoi(q.id, 'dapAn', e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-medium">{q.noiDungCauHoi}</p>
          {hienThiDapAn && (
            <div className={`mt-3 p-2.5 rounded-xl ${c.bg} border ${c.border}`}>
              <span className={`text-[10px] font-black ${c.text} uppercase tracking-wider`}>\u0110\u00e1p \u00e1n: </span>
              <span className="text-sm font-bold text-slate-700">{q.dapAn}</span>
            </div>
          )}
        </div>
      )}
      {q.yeuCau && (
        <div className="mt-3 text-[10px] text-slate-400 italic border-t border-slate-200 pt-2">
          <span className="font-bold text-slate-500">Y\u00eau c\u1ea7u c\u1ea7n \u0111\u1ea1t: </span>{q.yeuCau.split('\n')[0]}
        </div>
      )}
    </motion.div>
  );
}

