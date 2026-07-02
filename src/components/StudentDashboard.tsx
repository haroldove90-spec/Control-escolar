import React, { useState } from 'react';
import { useSchool } from '../SchoolContext';
import { Payment, Student } from '../types';
import { NotificationBell } from './NotificationBell';
import { 
  GraduationCap, Calendar, CreditCard, Send, User, 
  LogOut, ArrowLeftRight, CheckCircle, Clock, AlertTriangle, 
  Upload, FileText, Smartphone, Laptop, Sparkles, X, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StudentDashboard: React.FC = () => {
  const { 
    students, payments, currentStudentId, submitProof, 
    updateStudentProfile, setCurrentRole 
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'metrics' | 'history' | 'notify' | 'profile'>('metrics');

  // Find current student
  const student = students.find(s => s.id === currentStudentId) || students[0];
  const studentPayments = payments.filter(p => p.studentId === student?.id);

  // Notifications or form success states
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Form states for Notificar Pago
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [receiptFileName, setReceiptFileName] = useState('');
  const [studentComments, setStudentComments] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Profile Form States
  const [profName, setProfName] = useState(student?.name || '');
  const [profEmail, setProfEmail] = useState(student?.email || '');
  const [profPhone, setProfPhone] = useState(student?.phone || '');
  const [profGrade, setProfGrade] = useState(student?.grade || '');
  const [profAvatar, setProfAvatar] = useState(student?.profilePicture || '');

  // Calculate student statistics
  const totalPaidCount = studentPayments.filter(p => p.status === 'pagado').length;
  const pendingCount = studentPayments.filter(p => p.status === 'pendiente').length;
  const overdueCount = studentPayments.filter(p => p.status === 'vencido').length;
  const reviewCount = studentPayments.filter(p => p.status === 'revision').length;

  const nextUpcomingPayment = studentPayments
    .filter(p => p.status === 'pendiente' || p.status === 'vencido')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  // Filter pending/overdue payments to notify
  const nonPaidPayments = studentPayments.filter(p => p.status === 'pendiente' || p.status === 'vencido');

  // Handle Drag & Drop simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setReceiptFileName(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFileName(e.target.files[0].name);
    }
  };

  // Submit proof of payment
  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payId = selectedPaymentId || (nonPaidPayments[0] ? nonPaidPayments[0].id : '');
    if (!payId) return;

    const fileToUpload = receiptFileName || 'comprobante_colegiatura_transferencia.pdf';
    submitProof(payId, fileToUpload, studentComments);

    setUploadSuccess(true);
    setReceiptFileName('');
    setStudentComments('');
    setSelectedPaymentId('');

    setTimeout(() => {
      setUploadSuccess(false);
      setActiveTab('history'); // direct them to history to verify it is under review
    }, 2500);
  };

  // Save profile updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(student.id, {
      name: profName,
      email: profEmail,
      phone: profPhone,
      profilePicture: profAvatar
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  const simulateRandomAvatar = () => {
    const urls = [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    ];
    const rand = urls[Math.floor(Math.random() * urls.length)];
    setProfAvatar(rand);
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div>
          <AlertTriangle className="h-10 w-10 text-rose-600 mx-auto mb-3" />
          <p className="font-bold">Error de Simulación</p>
          <p className="text-xs text-slate-500 mt-1">Por favor regresa al inicio y selecciona un alumno válido.</p>
          <button onClick={() => setCurrentRole('admin')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* 1. Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-6 space-y-8 select-none">
        <div className="flex items-center space-x-3 text-white">
          <div className="h-9 w-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-500/20">
            A
          </div>
          <div>
            <h1 className="font-display font-extrabold text-sm tracking-tight text-white leading-none">PORTAL ALUMNO</h1>
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Control Escolar</span>
          </div>
        </div>

        {/* Student Mini Card */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3">
          <img
            src={student.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt={student.name}
            className="h-10 w-10 rounded-full object-cover border border-slate-700"
            referrerPolicy="no-referrer"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{student.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{student.grade}</p>
            <span className={`inline-block mt-1 px-1.5 py-0.5 rounded-full text-[8px] font-extrabold ${
              student.status === 'activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              {student.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'metrics' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span>Mi Colegiatura</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Historial de Pagos</span>
          </button>

          <button
            onClick={() => setActiveTab('notify')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer relative ${
              activeTab === 'notify' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Send className="h-5 w-5" />
            <span>Notificar Pago</span>
            {nonPaidPayments.length > 0 && (
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Mi Perfil Estudiante</span>
          </button>
        </nav>

        {/* Footer actions */}
        <div className="border-t border-slate-800 pt-6 space-y-3">
          <button
            onClick={() => setCurrentRole('admin')}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors bg-slate-800/50 p-2.5 rounded-lg border border-slate-800 cursor-pointer"
          >
            <span className="flex items-center space-x-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Volver a Directivo</span>
            </span>
          </button>

          <button
            onClick={() => setCurrentRole('home')}
            className="w-full flex items-center space-x-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* 2. Main content container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header bar */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            {/* Mobile Brand Title */}
            <div className="md:hidden flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
                A
              </div>
              <div>
                <h2 className="font-display font-extrabold text-xs text-slate-900 leading-none">{student.name}</h2>
                <span className="text-[9px] text-slate-500 font-bold">{student.grade}</span>
              </div>
            </div>

            <h2 className="hidden md:block font-display font-bold text-slate-800 text-lg">
              {activeTab === 'metrics' && 'Resumen Escolar y Estatus'}
              {activeTab === 'history' && 'Historial de Colegiaturas'}
              {activeTab === 'notify' && 'Enviar Comprobante Bancario'}
              {activeTab === 'profile' && 'Configuración de Mi Cuenta (Celular)'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications Center */}
            <NotificationBell />

            {/* Quick role toggle to admin (Mobile visible) */}
            <button
              onClick={() => setCurrentRole('admin')}
              className="md:hidden p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
              title="Volver a Directivo"
            >
              <ArrowLeftRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* 3. SUSPENSION ALERT BANNER */}
        {student.status === 'suspendido' && (
          <div className="bg-gradient-to-r from-rose-50 to-amber-50 border-b border-rose-200 p-4 sm:px-8 text-xs font-medium text-slate-800 flex items-start space-x-3.5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-rose-200 rounded-full -mr-6 -mt-6 opacity-30 animate-pulse" />
            <div className="h-9 w-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0 border border-rose-200">
              <AlertTriangle className="h-5 w-5 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-rose-800 text-xs sm:text-sm uppercase tracking-wide">AVISO DE SUSPENSIÓN TEMPORAL</p>
              <p className="mt-1 leading-relaxed text-slate-600">
                Tu cuenta ha sido <span className="font-bold text-rose-700">suspendida de forma temporal</span> debido a un saldo pendiente de pago ({studentPayments.find(p => p.status === 'vencido')?.month || 'Mes Anterior'}).
              </p>
              <div className="mt-3 flex items-center space-x-3.5">
                <button
                  onClick={() => setActiveTab('notify')}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Subir Comprobante Ahora
                </button>
                <span className="text-[10px] text-slate-400 font-semibold">Al aprobar tu pago, tu cuenta será reactivada automáticamente.</span>
              </div>
            </div>
          </div>
        )}

        {/* 4. Sub-views */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 md:pb-8">
          
          {/* TAB 1: METRICS / STATUS COMPONENT */}
          {activeTab === 'metrics' && (
            <div className="space-y-6 max-w-4xl">
              
              {/* Profile Card & General Estatus (Bento Item 1 Style) */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-50 rounded-full -mr-16 -mt-16 -z-0 opacity-40" />
                
                <div className="relative z-10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5">
                  <img
                    src={student.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={student.name}
                    className="h-20 w-20 rounded-full object-cover border-4 border-slate-100 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="font-display font-black text-slate-900 text-lg uppercase tracking-tight">{student.name}</h3>
                    <p className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider mt-0.5">{student.grade} • ID: {student.id}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Inscripción: {student.enrollmentDate}</p>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col items-center sm:items-end">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-2">Estatus Escolar:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full ${
                      student.status === 'activo' ? 'bg-emerald-500 animate-ripple' : 'bg-rose-500 animate-ripple'
                    }`} />
                    <span className={`px-4 py-2 rounded-full text-xs font-black border uppercase tracking-widest ${
                      student.status === 'activo' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : 'bg-rose-100 text-rose-800 border-rose-200'
                    }`}>
                      {student.status === 'activo' ? 'Al Corriente' : 'Suspendido'}
                    </span>
                  </div>
                  {student.status === 'suspendido' && (
                    <span className="text-[10px] text-rose-600 font-black uppercase tracking-wider mt-2">Adeudas {overdueCount} colegiatura(s)</span>
                  )}
                </div>
              </div>

              {/* Statistical cards (Bento Row) */}
              <div className="grid sm:grid-cols-3 gap-6">
                
                {/* Total Paid Month count (Emerald Theme Box) */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[170px]">
                  <div>
                    <span className="text-[10px] text-emerald-700 font-black uppercase tracking-widest block mb-1">Pagos Aprobados</span>
                    <h4 className="font-display text-3xl font-black italic text-emerald-950 tracking-tight">{totalPaidCount} meses</h4>
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-4 flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Sin adeudos anteriores
                  </p>
                </div>

                {/* Pendientes en Validacion (Slate-900 Dark Box) */}
                <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 shadow-lg flex flex-col justify-between min-h-[170px]">
                  <div>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">En Validación</span>
                    <h4 className="font-display text-3xl font-black italic text-white tracking-tight">{reviewCount} enviado(s)</h4>
                  </div>
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-4 flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1 text-blue-400" /> Esperando aprobación
                  </p>
                </div>

                {/* Próximo Pago Alerta (Amber Theme Box) */}
                <div className="bg-amber-400 text-amber-950 rounded-3xl p-6 shadow-md flex flex-col justify-between min-h-[170px]">
                  {nextUpcomingPayment ? (
                    <div>
                      <span className="text-[10px] text-amber-900 font-black uppercase tracking-widest block mb-1">Próxima Ficha</span>
                      <h4 className="font-display text-2xl font-black italic tracking-tight text-amber-950">{nextUpcomingPayment.month}</h4>
                      <p className="text-[10px] text-rose-800 font-extrabold uppercase mt-2 tracking-wider flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-rose-800" /> Vence: {nextUpcomingPayment.dueDate}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] text-emerald-900 font-black uppercase tracking-widest block mb-1">Próxima Colegiatura</span>
                      <h4 className="font-display text-xl font-extrabold text-amber-950">Al Corriente</h4>
                      <p className="text-[10px] text-slate-800 font-medium uppercase tracking-wider mt-2">Sin adeudos pendientes</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Informational Tuition Panel */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 h-48 w-48 bg-white/10 rounded-full -mr-12 -mt-12 opacity-30 rotate-12" />
                
                <div className="relative z-10 max-w-xl space-y-4">
                  <div className="inline-flex items-center bg-white/10 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest space-x-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                    <span>Aviso de Ciclo Escolar</span>
                  </div>
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight">Instrucciones para tus pagos mensuales</h3>
                  <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                    Las colegiaturas deben cubrirse antes del día 10 de cada mes corriente. Una vez que realices tu transferencia SPEI o depósito bancario, debes subir la captura o comprobante en formato PDF o imagen utilizando el módulo <strong>Notificar Pago</strong>. Al validarlo, el Director reactivará tu estatus en caso de suspensión.
                  </p>
                  
                  <button 
                    onClick={() => setActiveTab('notify')}
                    className="bg-white hover:bg-slate-50 text-indigo-900 font-bold py-3.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                  >
                    Subir Comprobante de Colegiatura
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: HISTORY LIST */}
          {activeTab === 'history' && (
            <div className="space-y-6 max-w-3xl">
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-display font-bold text-slate-900 text-sm">Historial Completo de Mis Pagos</h3>
                <p className="text-xs text-slate-500 mt-1">Monitorea los periodos pagados, comprobantes enviados en revisión, y adeudos del ciclo actual.</p>
              </div>

              <div className="space-y-4">
                {studentPayments.map(p => (
                  <div key={p.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        p.status === 'pagado' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        p.status === 'revision' ? 'bg-blue-50 text-blue-600 border border-blue-100 animate-pulse' :
                        p.status === 'vencido' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-slate-900 text-sm">{p.month}</h4>
                        <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-semibold mt-1">
                          <span>Monto: ${p.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                          <span>•</span>
                          <span>Vence: {p.dueDate}</span>
                        </div>
                        {p.paymentDate && (
                          <p className="text-[10px] text-emerald-600 font-bold mt-1">Aprobado el: {p.paymentDate}</p>
                        )}
                        {p.proofName && (
                          <div className="mt-2 text-[10px] text-slate-600 font-medium bg-slate-50 border border-slate-150 p-2 rounded-lg inline-flex items-center">
                            <FileText className="h-3.5 w-3.5 text-slate-400 mr-1.5" />
                            <span>Comprobante: {p.proofName}</span>
                          </div>
                        )}
                        {p.notes && p.status === 'vencido' && (
                          <p className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-100 p-2 rounded-lg mt-2 italic">
                            Motivo del rechazo: "{p.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold border uppercase ${
                        p.status === 'pagado' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        p.status === 'revision' ? 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse' :
                        p.status === 'vencido' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                        'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {p.status === 'revision' ? 'En Validación' : p.status}
                      </span>
                      
                      {(p.status === 'pendiente' || p.status === 'vencido') && (
                        <button
                          onClick={() => {
                            setSelectedPaymentId(p.id);
                            setActiveTab('notify');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                        >
                          Pagar
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICAR PAGO */}
          {activeTab === 'notify' && (
            <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="border-b border-slate-150 pb-4 mb-6">
                <h3 className="font-display font-extrabold text-slate-900 text-sm uppercase tracking-tight">Notificar Transferencia</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Sube tu recibo SPEI o depósito para aprobación directiva</p>
              </div>

              {nonPaidPayments.length === 0 ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-150 rounded-2xl text-emerald-800">
                  <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-bold text-base">¡Estás al Corriente!</h4>
                  <p className="text-xs mt-1 text-slate-600">No tienes periodos de colegiaturas con deudas pendientes. ¡Gracias por tu puntualidad!</p>
                </div>
              ) : (
                <>
                  {uploadSuccess ? (
                    <div className="p-8 text-center bg-blue-50 border border-blue-150 rounded-2xl text-blue-800">
                      <CheckCircle className="h-10 w-10 text-blue-600 mx-auto mb-3 animate-bounce" />
                      <h4 className="font-bold text-base">¡Comprobante Enviado Exitosamente!</h4>
                      <p className="text-xs mt-1 text-slate-600">El Director escolar recibirá un aviso de revisión de inmediato. Tu cuenta será evaluada.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleNotifySubmit} className="space-y-6">
                      
                      {/* Month dropdown */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Seleccionar mes a liquidar</label>
                        <select
                          required
                          value={selectedPaymentId}
                          onChange={(e) => setSelectedPaymentId(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3.5 focus:bg-white focus:outline-none focus:border-emerald-500 cursor-pointer text-slate-800"
                        >
                          <option value="">-- Selecciona el mes --</option>
                          {nonPaidPayments.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.month} — Mto: ${p.amount.toLocaleString('es-MX')} ({p.status === 'vencido' ? 'VENCIDO ⚠️' : 'PENDIENTE'})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Mock Drag and drop */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Comprobante de Pago (PDF o Imagen)</label>
                        
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                            isDragging ? 'border-emerald-500 bg-emerald-50/40' : 
                            receiptFileName ? 'border-emerald-600 bg-slate-50' : 'border-slate-250 hover:border-slate-400 bg-slate-50/50'
                          }`}
                        >
                          <input
                            type="file"
                            id="receipt-file"
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="image/*,.pdf"
                          />
                          <label htmlFor="receipt-file" className="cursor-pointer block">
                            {receiptFileName ? (
                              <div className="space-y-2">
                                <FileText className="h-10 w-10 text-emerald-600 mx-auto" />
                                <p className="text-xs font-bold text-emerald-700">{receiptFileName}</p>
                                <p className="text-[10px] text-slate-400">Haga clic o arrastre para reemplazar el archivo</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="h-10 w-10 text-slate-400 mx-auto" />
                                <p className="text-xs font-bold text-slate-700">Arrastra tu comprobante aquí o búscalo en tu dispositivo</p>
                                <p className="text-[10px] text-slate-400">Formatos permitidos: PDF, JPG, PNG (Mín. 44px área de toque)</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Optional Notes */}
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Comentarios adicionales (Opcional)</label>
                        <textarea
                          value={studentComments}
                          onChange={(e) => setStudentComments(e.target.value)}
                          placeholder="Ej. Realicé transferencia SPEI a nombre de mi tutor con el número de folio 12401..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3.5 focus:bg-white focus:outline-none focus:border-emerald-500"
                          rows={3}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-100 cursor-pointer"
                      >
                        Enviar Comprobante a Dirección
                      </button>

                    </form>
                  )}
                </>
              )}
            </div>
          )}

          {/* TAB 4: STUDENT PROFILE (OPTIMIZED AND DESIGNED TO LOOK LIKE MOBILE PHONES SETTINGS SCREEN) */}
          {activeTab === 'profile' && (
            <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
              
              {/* Phone Status Bar Simulation for immersive look */}
              <div className="bg-slate-900 text-white h-8 px-5 flex items-center justify-between text-[10px] font-mono select-none">
                <span>Colegio Movil</span>
                <div className="flex items-center space-x-1.5">
                  <span>LTE</span>
                  <div className="h-2 w-4 bg-white/80 rounded-[2px]" />
                </div>
              </div>

              {/* Profile Mobile-focused header */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 text-center relative">
                <button
                  type="button"
                  onClick={simulateRandomAvatar}
                  className="relative group block mx-auto w-20 h-20 mb-3 cursor-pointer"
                  title="Cambiar foto de perfil"
                >
                  <img
                    src={profAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt="Alumno"
                    className="h-20 w-20 rounded-full object-cover border-2 border-emerald-500 shadow-md group-hover:opacity-80 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold">
                    Cambiar
                  </div>
                </button>
                <h3 className="font-display font-extrabold text-sm tracking-tight">{profName}</h3>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-0.5">{profGrade}</p>
              </div>

              {/* Settings Body */}
              <div className="p-5 bg-slate-50 space-y-5">
                {profileSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-[10px] font-extrabold rounded-lg">
                    ✓ Perfil actualizado desde celular.
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={profName}
                      onChange={(e) => setProfName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl text-xs font-semibold p-2.5 focus:outline-none focus:border-emerald-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={profEmail}
                      onChange={(e) => setProfEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl text-xs font-semibold p-2.5 focus:outline-none focus:border-emerald-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Teléfono Móvil</label>
                    <input
                      type="tel"
                      required
                      value={profPhone}
                      onChange={(e) => setProfPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl text-xs font-semibold p-2.5 focus:outline-none focus:border-emerald-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Grado Escolar (Lectura)</label>
                    <input
                      type="text"
                      disabled
                      value={profGrade}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold p-2.5 text-slate-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-xs transition-colors cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </form>

                {/* Additional mobile-like menu cells */}
                <div className="bg-white rounded-2xl border border-slate-150 divide-y divide-slate-100 overflow-hidden text-xs">
                  <div className="p-3.5 flex justify-between items-center text-slate-700">
                    <span className="font-semibold">Cambiar Contraseña</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="p-3.5 flex justify-between items-center text-slate-700">
                    <span className="font-semibold">Preferencias de Notificaciones</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                  <div className="p-3.5 flex justify-between items-center text-rose-600 font-bold cursor-pointer" onClick={() => setCurrentRole('home')}>
                    <span>Cerrar Sesión</span>
                    <LogOut className="h-4 w-4" />
                  </div>
                </div>

              </div>

              {/* Phone Home Indicator bar */}
              <div className="bg-slate-100 py-3 flex justify-center">
                <div className="h-1 w-24 bg-slate-300 rounded-full" />
              </div>

            </div>
          )}

        </main>
      </div>

      {/* 5. Mobile Bottom Navigation bar (Hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 h-16 flex justify-around items-center px-4 z-40 select-none">
        
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'metrics' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] font-bold">Estatus</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'history' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <CreditCard className="h-5 w-5" />
          <span className="text-[10px] font-bold">Historial</span>
        </button>

        <button
          onClick={() => setActiveTab('notify')}
          className={`flex flex-col items-center space-y-1 relative ${
            activeTab === 'notify' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Send className="h-5 w-5" />
          <span className="text-[10px] font-bold">Enviar Pago</span>
          {nonPaidPayments.length > 0 && (
            <span className="absolute right-1 top-0 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold">Mi Perfil</span>
        </button>

      </nav>

    </div>
  );
};
