import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../states/AuthContext";
import { Camera, Save, User, MapPin, Phone, Mail, CheckCircle2, X } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth(); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk Notifikasi (Toast)
  const [showToast, setShowToast] = useState(false);
  
  const objectUrlRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      if (user.avatar) {
        setImagePreview(user.avatar);
      }
    }
  }, [user]);

  // Cleanup untuk mencegah Memory Leak
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const newUrl = URL.createObjectURL(file);
      objectUrlRef.current = newUrl;
      setImagePreview(newUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulasi proses penyimpanan ke database (1 detik)
    setTimeout(() => {
      setIsLoading(false);
      setShowToast(true); // Munculkan notifikasi
      
      // Sembunyikan notifikasi otomatis setelah 3 detik
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 relative">
      
      {/* --- KOMPONEN TOAST NOTIFICATION --- */}
      <div 
        className={`fixed top-24 right-8 z-50 flex items-center gap-3 bg-white border-l-4 border-green-500 px-6 py-4 rounded-lg shadow-xl transition-all duration-300 transform ${
          showToast ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <CheckCircle2 className="text-green-500" size={24} />
        <div>
          <h4 className="font-bold text-gray-800">Berhasil!</h4>
          <p className="text-sm text-gray-500">Profil Anda telah berhasil diperbarui.</p>
        </div>
        <button onClick={() => setShowToast(false)} className="ml-4 text-gray-400 hover:text-gray-600" aria-label="Tutup">
          <X size={18} />
        </button>
      </div>
      {/* ----------------------------------- */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Banner */}
        <div className="h-32 bg-ink w-full"></div>

        <div className="px-8 pb-10">
          {/* Section Foto Profil */}
          <div className="flex flex-col items-center -mt-16 mb-8">
            <div className="relative w-32 h-32 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={60} className="text-gray-300" />
              )}
            </div>
            
            {/* Tombol Ubah Foto */}
            <label className="mt-4 cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-300">
              <Camera size={16} />
              Ubah Foto Profil
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{formData.name || "Nama Pengguna"}</h2>
            <p className="text-gray-500 text-sm mt-1">Bergabung sejak 2026</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Input Nama - DIPERBAIKI */}
              <div>
                <label htmlFor="profile-name" className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="profile-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sun focus:border-sun outline-none transition-all"
                    placeholder="Masukkan nama lengkap"
                    required
                  />
                </div>
              </div>

              {/* Input Email (Disabled) - DIPERBAIKI */}
              <div>
                <label htmlFor="profile-email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="profile-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed outline-none"
                    disabled
                  />
                </div>
              </div>

              {/* Input No HP - DIPERBAIKI */}
              <div className="md:col-span-2">
                <label htmlFor="profile-phone" className="block text-sm font-semibold text-gray-700 mb-2">Nomor Handphone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    id="profile-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sun focus:border-sun outline-none transition-all"
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>
            </div>

            {/* Input Alamat - DIPERBAIKI */}
            <div>
              <label htmlFor="profile-address" className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-4 text-gray-400" size={18} />
                <textarea
                  id="profile-address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sun focus:border-sun outline-none transition-all resize-none"
                  placeholder="Masukkan alamat lengkap"
                ></textarea>
              </div>
            </div>

            {/* Tombol Simpan */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-sun text-ink font-bold py-3 px-8 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-70 shadow-sm"
              >
                {isLoading ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}