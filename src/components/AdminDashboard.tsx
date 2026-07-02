import React, { useState } from 'react';
import { useSchool } from '../SchoolContext';
import { Student, Payment } from '../types';
import { NotificationBell } from './NotificationBell';
import { 
  Users, BarChart3, CreditCard, User, LogOut, Plus, 
  Search, ShieldAlert, CheckCircle, AlertTriangle, HelpCircle, 
  FileText, Check, X, Smartphone, ArrowLeftRight, BellRing, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const { 
    students, payments, notifications, registerStudent, 
    suspendStudent, reactivateStudent, sendTuitionNotice, 
    approvePayment, rejectPayment, setCurrentRole 
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'metrics' | 'register' | 'payments' | 'profile'>('metrics');
  
  // Search and filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentForPayments, setSelectedStudentForPayments] = useState<string | null>(null);
  const [paymentFilterStatus, setPaymentFilterStatus] = useState<string>('all');
  
  // Register form state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('1° de Secundaria');
  const [initialMonth, setInitialMonth] = useState('Julio 2026');
  const [initialAmount, setInitialAmount] = useState('1500');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Review modal state
  const [verifyingPayment, setVerifyingPayment] = useState<Payment | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  // Profile edit simulation state
  const [adminName, setAdminName] = useState('Mtro. Ricardo Guzmán Ruiz');
  const [adminRole, setAdminRole] = useState('Director General');
  const [adminPhone, setAdminPhone] = useState('5511223344');
  const [adminEmail, setAdminEmail] = useState('director.ricardo@colegio.edu.mx');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // --- Calculations for metrics ---
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'activo').length;
  const suspendedStudents = students.filter(s => s.status === 'suspendido').length;

  const totalCollected = payments.filter(p => p.status === 'pagado').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pendiente').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'vencido').reduce((acc, curr) => acc + curr.amount, 0);
  const totalInReview = payments.filter(p => p.status === 'revision').reduce((acc, curr) => acc + curr.amount, 0);

  const expectedTotal = totalCollected + totalPending + totalOverdue + totalInReview;
  const collectionPercentage = expectedTotal > 0 ? Math.round((totalCollected / expectedTotal) * 100) : 0;

  // Handle student registration submit
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail || !newStudentPhone) return;

    registerStudent(
      {
        name: newStudentName,
        email: newStudentEmail,
        phone: newStudentPhone,
        grade: newStudentGrade,
      },
      initialMonth,
      Number(initialAmount)
    );

    setRegisterSuccess(true);
    // Reset form
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    
    setTimeout(() => {
      setRegisterSuccess(false);
      setActiveTab('payments'); // direct them to payments to see new setup
    }, 2000);
  };

  // Handle Payment review validation
  const handleApprovePayment = (payId: string) => {
    approvePayment(payId);
    setVerifyingPayment(null);
    setRejectReason('');
    setShowRejectInput(false);
  };

  const handleRejectPayment = (payId: string) => {
    if (!rejectReason) return;
    rejectPayment(payId, rejectReason);
    setVerifyingPayment(null);
    setRejectReason('');
    setShowRejectInput(false);
  };

  // Handle Admin Profile update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2500);
  };

  // Filtered lists
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.grade.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const revisionPayments = payments.filter(p => p.status === 'revision');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* 1. Desktop Sidebar (Hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 p-6 space-y-8 select-none">
        <div className="flex items-center space-x-3 text-white">
          <div className="h-9 w-9 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-indigo-500/20">
            C
          </div>
          <div>
            <h1 className="font-display font-extrabold text-sm tracking-tight text-white leading-none">CONTROL ESCOLAR</h1>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Módulo Director</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'metrics' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Métricas Generales</span>
          </button>
          
          <button
            onClick={() => setActiveTab('payments')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer relative ${
              activeTab === 'payments' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Control de Pagos</span>
            {revisionPayments.length > 0 && (
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'register' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span>Registrar Alumno</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'profile' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                : 'hover:bg-slate-800 hover:text-slate-100'
            }`}
          >
            <User className="h-5 w-5" />
            <span>Mi Perfil</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800 pt-6 space-y-3">
          <button
            onClick={() => setCurrentRole('estudiante')}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors bg-slate-800/50 p-2.5 rounded-lg border border-slate-800 cursor-pointer"
          >
            <span className="flex items-center space-x-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" />
              <span>Cambiar a Estudiante</span>
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

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            {/* Mobile Title */}
            <div className="md:hidden flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-xs">
                C
              </div>
              <h2 className="font-display font-extrabold text-sm text-slate-900 leading-none">CONTROL ESCOLAR</h2>
            </div>
            
            <h2 className="hidden md:block font-display font-bold text-slate-800 text-lg">
              {activeTab === 'metrics' && 'Estadísticas e Ingresos de Colegiaturas'}
              {activeTab === 'register' && 'Inscripción y Alta de Nuevos Alumnos'}
              {activeTab === 'payments' && 'Gestión y Conciliación de Pagos'}
              {activeTab === 'profile' && 'Configuración de Cuenta Director'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-900">{adminName}</span>
              <span className="text-[10px] text-slate-500 font-semibold">{adminRole}</span>
            </div>
            
            {/* Notifications Center */}
            <NotificationBell />
            
            {/* Quick role toggle for testing (Mobile visible) */}
            <button
              onClick={() => setCurrentRole('estudiante')}
              className="md:hidden p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 transition-colors cursor-pointer"
              title="Cambiar a Alumno"
            >
              <ArrowLeftRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* 3. Dashboard Screens */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto pb-24 md:pb-8">
           {/* TAB 1: METRICS */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-12 gap-6 items-stretch">
              
              {/* BENTO ITEM 1: Recaudación Mensual (Indigo Theme) */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-indigo-600 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between min-h-[200px]">
                <div>
                  <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider mb-2">Recaudación Mensual (Aprobados)</p>
                  <h3 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-white">
                    ${totalCollected.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase text-indigo-100">
                    <span>Cumplimiento de Pago</span>
                    <span>{collectionPercentage}% Alumnos</span>
                  </div>
                  <div className="w-full h-2.5 bg-indigo-800 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${collectionPercentage}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* BENTO ITEM 2: Control de Revisiones (Slate-900 Theme) */}
              <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-slate-900 rounded-3xl p-6 text-slate-300 shadow-lg flex flex-col justify-between min-h-[200px]">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      <p className="text-white text-[10px] font-bold uppercase tracking-wider">Control de Comprobantes</p>
                    </div>
                    {totalInReview > 0 && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
                        {totalInReview} PENDIENTES
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 my-2">
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Por Validar</span>
                      <span className="text-xl sm:text-2xl font-bold italic tracking-tight text-white">
                        ${totalInReview.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Adeudo Vencido</span>
                      <span className="text-xl sm:text-2xl font-bold italic tracking-tight text-rose-400">
                        ${totalOverdue.toLocaleString('es-MX', { minimumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 font-semibold flex items-center border-t border-slate-850 pt-2.5 mt-2">
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                  <span>Requiere verificación de transferencia del alumno</span>
                </div>
              </div>

              {/* BENTO ITEM 3: Estado del Alumnado (Emerald Theme) */}
              <div className="col-span-12 lg:col-span-4 bg-emerald-50 border border-emerald-100 rounded-3xl p-6 flex flex-col justify-between min-h-[200px]">
                <div>
                  <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-2">Estado General del Alumnado</p>
                  <div className="flex items-baseline gap-2.5 my-1">
                    <span className="text-3xl sm:text-4xl font-black italic text-emerald-950">{activeStudents}</span>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Activos de {totalStudents}</span>
                  </div>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-emerald-100/60">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-rose-600 uppercase">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>{suspendedStudents} Alumnos Suspendidos actualmente</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                    Los alumnos con adeudos cambian automáticamente a estado suspendido en su portal.
                  </p>
                </div>
              </div>

              {/* BENTO ITEM 4: Visual Chart Breakdown (Large White Card) */}
              <div className="col-span-12 lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h4 className="font-display font-extrabold text-slate-900 text-sm uppercase tracking-tight">Distribución Financiera de Colegiaturas</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Ciclo Escolar Vigente 2026</p>
                  </div>
                  
                  {/* Custom progress rows */}
                  <div className="space-y-4 my-4">
                    {/* Pagado Row */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-1">
                        <span className="text-slate-500">Recibido y Aprobado</span>
                        <span className="text-emerald-700">${totalCollected.toLocaleString('es-MX')} ({collectionPercentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${collectionPercentage}%` }} />
                      </div>
                    </div>

                    {/* Revision Row */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-1">
                        <span className="text-slate-500">En Validación (Revisión)</span>
                        <span className="text-blue-700">
                          ${totalInReview.toLocaleString('es-MX')} ({expectedTotal > 0 ? Math.round((totalInReview/expectedTotal)*100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${expectedTotal > 0 ? (totalInReview/expectedTotal)*100 : 0}%` }} />
                      </div>
                    </div>

                    {/* Pendiente Row */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-1">
                        <span className="text-slate-500">Por Vencer (Pendiente)</span>
                        <span className="text-amber-700">
                          ${totalPending.toLocaleString('es-MX')} ({expectedTotal > 0 ? Math.round((totalPending/expectedTotal)*100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${expectedTotal > 0 ? (totalPending/expectedTotal)*100 : 0}%` }} />
                      </div>
                    </div>

                    {/* Vencido Row */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase mb-1">
                        <span className="text-slate-500">Adeudo Vencido (Vencido)</span>
                        <span className="text-rose-700">
                          ${totalOverdue.toLocaleString('es-MX')} ({expectedTotal > 0 ? Math.round((totalOverdue/expectedTotal)*100) : 0}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${expectedTotal > 0 ? (totalOverdue/expectedTotal)*100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-4">
                  <span>Meta Total de Recaudación Esperada:</span>
                  <span className="text-slate-800 font-black">${expectedTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* BENTO ITEM 5: Validaciones Urgentes (Fidelity Activity Feed) */}
              <div className="col-span-12 lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-100 pb-3 mb-3 flex justify-between items-center">
                    <h4 className="font-display font-extrabold text-slate-900 text-sm uppercase tracking-tight">Sincronización Live Feed</h4>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Últimas Solicitudes y Alertas Escolares</p>

                  <div className="space-y-3 overflow-y-auto max-h-[190px] pr-1">
                    {revisionPayments.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400">
                        <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                        <p className="font-bold uppercase tracking-wider text-[10px]">¡Todo al corriente!</p>
                        <p className="text-[11px] text-slate-400 font-medium">No hay comprobantes pendientes por verificar.</p>
                      </div>
                    ) : (
                      revisionPayments.map(p => (
                        <div key={p.id} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-2xl flex items-center justify-between text-xs transition-colors">
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-slate-900 truncate">{p.studentName}</p>
                            <p className="text-slate-500 font-semibold text-[10px] mt-0.5">
                              {p.month} — <span className="font-bold text-indigo-700">${p.amount}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setVerifyingPayment(p);
                              setActiveTab('payments');
                            }}
                            className="px-3 py-1.5 bg-indigo-50 border border-indigo-150 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-[9px] uppercase tracking-wider flex-shrink-0 cursor-pointer"
                          >
                            Validar
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 text-[10px] leading-relaxed font-semibold text-slate-500 mt-4">
                  <span className="font-bold text-slate-800 uppercase block mb-1">💡 Conciliación Directa:</span>
                  El alumno puede adjuntar comprobantes PDF/Imágenes, los cuales se reflejan instantáneamente para su aprobación.
                </div>
              </div>

              {/* BENTO ITEM 6: Quick Action Banner (Amber Theme) */}
              <div className="col-span-12 bg-amber-400 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 h-32 w-32 bg-amber-300 rounded-full -mr-10 -mt-10 opacity-40" />
                
                <div className="max-w-xl text-center sm:text-left relative z-10">
                  <h3 className="font-display font-black text-amber-950 uppercase leading-none text-xl sm:text-2xl italic tracking-tight mb-2">
                    ENVIAR AVISOS DE COBRO
                  </h3>
                  <p className="text-[10px] sm:text-xs text-amber-900 font-bold uppercase tracking-wide leading-relaxed">
                    Notifica de manera masiva y automática a todos los estudiantes que tienen colegiaturas con estatus pendiente o retrasado.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('payments');
                    setPaymentFilterStatus('all');
                  }}
                  className="px-6 py-4 bg-amber-950 hover:bg-amber-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md shrink-0 cursor-pointer relative z-10"
                >
                  Gestionar Avisos de Pago ➜
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="border-b border-slate-150 pb-4 mb-6">
                <h3 className="font-display font-extrabold text-lg text-slate-900 tracking-tight uppercase">Inscripción Escolar</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Alta de Alumno y Programación de Primer Cargo</p>
              </div>

              {registerSuccess ? (
                <div className="p-8 text-center bg-indigo-50 border border-indigo-150 rounded-xl text-indigo-800">
                  <CheckCircle className="h-10 w-10 text-indigo-600 mx-auto mb-3 animate-bounce" />
                  <h4 className="font-bold text-base">¡Registro Completado Exitosamente!</h4>
                  <p className="text-xs mt-1 text-slate-600">El alumno ha sido registrado y se ha generado su primera ficha de cobro pendiente para el mes de {initialMonth}.</p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Nombre Completo del Alumno</label>
                      <input
                        type="text"
                        required
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="Ej. Sofía García Torres"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3.5 focus:bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Grado Escolar</label>
                      <select
                        value={newStudentGrade}
                        onChange={(e) => setNewStudentGrade(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3.5 focus:bg-white focus:outline-none focus:border-indigo-600 cursor-pointer"
                      >
                        <option value="1° de Primaria">1° de Primaria</option>
                        <option value="3° de Primaria">3° de Primaria</option>
                        <option value="6° de Primaria">6° de Primaria</option>
                        <option value="1° de Secundaria">1° de Secundaria</option>
                        <option value="3° de Secundaria">3° de Secundaria</option>
                        <option value="1° de Preparatoria">1° de Preparatoria</option>
                        <option value="3° de Preparatoria">3° de Preparatoria</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Correo Electrónico (Tutor / Alumno)</label>
                      <input
                        type="email"
                        required
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        placeholder="ejemplo@colegio.edu.mx"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3.5 focus:bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Número de Teléfono</label>
                      <input
                        type="tel"
                        required
                        value={newStudentPhone}
                        onChange={(e) => setNewStudentPhone(e.target.value)}
                        placeholder="Ej. 5512345678"
                        maxLength={10}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3.5 focus:bg-white focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Apertura Financiera (Primer Cargo)</h4>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Mes de Colegiatura inicial</label>
                        <select
                          value={initialMonth}
                          onChange={(e) => setInitialMonth(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold p-2.5 text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                        >
                          <option value="Julio 2026">Julio 2026</option>
                          <option value="Agosto 2026">Agosto 2026</option>
                          <option value="Septiembre 2026">Septiembre 2026</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">Monto Mensual ($ MXN)</label>
                        <input
                          type="number"
                          required
                          value={initialAmount}
                          onChange={(e) => setInitialAmount(e.target.value)}
                          placeholder="1500"
                          className="w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold p-2.5 text-slate-700 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-150 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Registrar e Iniciar Colegiaturas
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: PAYMENTS & USERS */}
          {activeTab === 'payments' && (
            <div className="space-y-8">
              
              {/* Filter controls */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Buscar alumno por nombre, grado o correo..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold pl-10 pr-4 py-3 focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                {/* Payment Status Dropdown Filter */}
                <div className="flex items-center space-x-3 text-xs font-semibold">
                  <span className="text-slate-500 flex-shrink-0">Filtrar estatus:</span>
                  <select
                    value={paymentFilterStatus}
                    onChange={(e) => setPaymentFilterStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="activo">Solo Alumnos Activos</option>
                    <option value="suspendido">Solo Alumnos Suspendidos</option>
                    <option value="revision">Comprobantes por validar ({revisionPayments.length})</option>
                  </select>
                </div>

              </div>

              {/* Students Intake and Status Board */}
              <div className="grid lg:grid-cols-5 gap-8 items-start">
                
                {/* Left Side: Students List (3/5 columns) */}
                <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                  <div className="p-5 border-b border-slate-150 flex justify-between items-center bg-slate-50">
                    <h4 className="font-display font-bold text-slate-900 text-sm">Control de Estatus Escolar</h4>
                    <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-200 text-slate-700">
                      {filteredStudents.length} Alumnos
                    </span>
                  </div>

                  <div className="divide-y divide-slate-150">
                    {filteredStudents.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        <Search className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p>No se encontraron alumnos que coincidan con la búsqueda.</p>
                      </div>
                    ) : (
                      filteredStudents
                        .filter(s => {
                          if (paymentFilterStatus === 'activo') return s.status === 'activo';
                          if (paymentFilterStatus === 'suspendido') return s.status === 'suspendido';
                          if (paymentFilterStatus === 'revision') {
                            return payments.some(p => p.studentId === s.id && p.status === 'revision');
                          }
                          return true;
                        })
                        .map(s => {
                          const hasOverdue = payments.some(p => p.studentId === s.id && p.status === 'vencido');
                          const hasInReview = payments.some(p => p.studentId === s.id && p.status === 'revision');
                          
                          return (
                            <div 
                              key={s.id} 
                              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-50 cursor-pointer ${
                                selectedStudentForPayments === s.id ? 'bg-indigo-50/20 border-l-4 border-indigo-600' : ''
                              }`}
                              onClick={() => setSelectedStudentForPayments(s.id)}
                            >
                              <div className="flex items-center space-x-3.5">
                                <img
                                  src={s.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                                  alt={s.name}
                                  className="h-10 w-10 rounded-full object-cover border border-slate-200"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <p className="font-bold text-xs text-slate-900 truncate">{s.name}</p>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                      s.status === 'activo' 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                    }`}>
                                      {s.status.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-semibold">{s.grade} • {s.email}</p>
                                  
                                  {/* Warning indicators */}
                                  <div className="flex items-center space-x-2.5 mt-1">
                                    {hasOverdue && (
                                      <span className="inline-flex items-center text-[9px] font-bold text-rose-600">
                                        <AlertTriangle className="h-3 w-3 mr-0.5 animate-bounce" /> Deuda vencida
                                      </span>
                                    )}
                                    {hasInReview && (
                                      <span className="inline-flex items-center text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1 rounded">
                                        <Clock className="h-3 w-3 mr-0.5" /> Pago enviado
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Suspender/Reactivar Buttons */}
                              <div className="flex items-center space-x-2 self-end sm:self-center">
                                {s.status === 'activo' ? (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      suspendStudent(s.id);
                                    }}
                                    className="px-3 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                                  >
                                    Suspender
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      reactivateStudent(s.id);
                                    }}
                                    className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                                  >
                                    Reactivar
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>

                {/* Right Side: Detailed Payment History for selected Student (2/5 columns) */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                  {selectedStudentForPayments ? (
                    (() => {
                      const selectedStudent = students.find(s => s.id === selectedStudentForPayments);
                      const studentPayments = payments.filter(p => p.studentId === selectedStudentForPayments);

                      return (
                        <div className="space-y-5">
                          <div className="border-b border-slate-150 pb-4 flex justify-between items-start">
                            <div>
                              <h4 className="font-display font-bold text-slate-950 text-sm leading-tight">Colegiaturas y Cobros</h4>
                              <p className="text-[11px] text-indigo-600 font-bold mt-0.5">{selectedStudent?.name}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">{selectedStudent?.grade}</span>
                          </div>

                          <div className="space-y-4">
                            {studentPayments.map(p => (
                              <div key={p.id} className="p-4 border border-slate-150 rounded-xl bg-slate-50/50 flex flex-col justify-between gap-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-xs font-extrabold text-slate-900">{p.month}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">Monto: ${p.amount.toLocaleString('es-MX')}</p>
                                    <p className="text-[10px] text-slate-400 font-semibold">Vence: {p.dueDate}</p>
                                  </div>

                                  <div className="text-right">
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold border uppercase ${
                                      p.status === 'pagado' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                      p.status === 'revision' ? 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse' :
                                      p.status === 'vencido' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                                      'bg-amber-100 text-amber-800 border-amber-200'
                                    }`}>
                                      {p.status === 'revision' ? 'POR VALIDAR' : p.status}
                                    </span>
                                  </div>
                                </div>

                                {p.notes && (
                                  <div className="bg-slate-100 rounded-lg p-2 text-[10px] italic text-slate-600 font-medium">
                                    <span className="font-bold uppercase not-italic text-[8px] text-slate-400 block mb-0.5">Notas / Comprobante:</span>
                                    {p.proofName ? `Archivo: ${p.proofName} | ` : ''} {p.notes}
                                  </div>
                                )}

                                {/* Payment Actions */}
                                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-150">
                                  {p.status === 'pendiente' && (
                                    <button
                                      onClick={() => sendTuitionNotice(p.id)}
                                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-150 rounded-lg font-bold text-[10px] tracking-wider uppercase cursor-pointer"
                                    >
                                      Enviar Aviso
                                    </button>
                                  )}
                                  {p.status === 'revision' && (
                                    <button
                                      onClick={() => setVerifyingPayment(p)}
                                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] tracking-wider uppercase flex items-center space-x-1 cursor-pointer"
                                    >
                                      <FileText className="h-3 w-3" />
                                      <span>Verificar</span>
                                    </button>
                                  )}
                                  {p.status === 'vencido' && (
                                    <div className="flex items-center space-x-1">
                                      <button
                                        onClick={() => sendTuitionNotice(p.id)}
                                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[10px] tracking-wider uppercase cursor-pointer"
                                      >
                                        Re-Notificar
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <p className="font-bold">Información de Pagos</p>
                      <p className="max-w-xs mx-auto mt-1">Selecciona un alumno de la lista izquierda para consultar, cobrar, enviar alertas o validar sus comprobantes.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: PROFILE */}
          {activeTab === 'profile' && (
            <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="border-b border-slate-150 pb-4 mb-6 text-center">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                  alt="Director"
                  className="h-24 w-24 rounded-full mx-auto object-cover border-4 border-slate-100 shadow-md mb-3"
                  referrerPolicy="no-referrer"
                />
                <h3 className="font-display font-extrabold text-lg text-slate-900 tracking-tight uppercase">{adminName}</h3>
                <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider mt-0.5">{adminRole}</p>
              </div>

              {profileSuccess && (
                <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-center text-xs font-bold">
                  ✓ Configuración del perfil de Director guardada con éxito.
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Nombre Completo del Directivo</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3 focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Cargo / Puesto</label>
                  <input
                    type="text"
                    required
                    value={adminRole}
                    onChange={(e) => setAdminRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3 focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Correo Institucional</label>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Teléfono Oficina</label>
                    <input
                      type="tel"
                      required
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3 focus:bg-white focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-150 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Último Acceso: Hoy, {new Date().toLocaleTimeString()}</span>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-xs cursor-pointer"
                  >
                    Guardar Perfil
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* 4. MODAL: Verification Receipt POPUP */}
      <AnimatePresence>
        {verifyingPayment && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-150 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">Validar Comprobante de Colegiatura</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Revisión manual de transferencia SPEI o depósito</p>
                </div>
                <button
                  onClick={() => {
                    setVerifyingPayment(null);
                    setShowRejectInput(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                
                {/* Info values */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Estudiante</span>
                    <span className="text-slate-800">{verifyingPayment.studentName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Periodo</span>
                    <span className="text-slate-800">{verifyingPayment.month}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Monto del Pago</span>
                    <span className="text-emerald-700 font-bold">${verifyingPayment.amount.toLocaleString('es-MX')} MXN</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Archivo Comprobante</span>
                    <span className="text-slate-800 font-mono truncate block">{verifyingPayment.proofName || 'comprobante_banco.pdf'}</span>
                  </div>
                </div>

                {/* Simulated Bank Receipt Display */}
                <div className="border border-slate-200 rounded-2xl p-5 bg-slate-900 text-slate-100 font-mono text-xs flex flex-col space-y-2 relative overflow-hidden">
                  <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-center border-b border-slate-800 pb-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider">BANCO CENTRAL — COMPROBANTE DE TRANSFERENCIA</p>
                  <p><span className="text-slate-400">BENEFICIARIO:</span> Colegio de Control Escolar</p>
                  <p><span className="text-slate-400">EMISOR:</span> {verifyingPayment.studentName}</p>
                  <p><span className="text-slate-400">CANTIDAD:</span> ${verifyingPayment.amount.toLocaleString('es-MX')} MXN</p>
                  <p><span className="text-slate-400">FECHA HORA:</span> {new Date().toLocaleDateString('es-MX')} {new Date().toLocaleTimeString('es-MX')}</p>
                  <p><span className="text-slate-400">REFERENCIA:</span> REF-{Math.floor(Math.random()*90000000 + 10000000)}</p>
                  {verifyingPayment.notes && (
                    <p className="mt-2 text-slate-300 italic border-t border-slate-800 pt-2 text-[11px] font-sans">
                      <span className="font-bold uppercase not-italic text-[9px] text-slate-500 block mb-0.5">Comentario del alumno:</span>
                      "{verifyingPayment.notes}"
                    </p>
                  )}
                </div>

                {/* Rejection comments input */}
                {showRejectInput && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-rose-600 uppercase">Motivo del Rechazo (Obligatorio)</label>
                    <textarea
                      required
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Ej. El comprobante pertenece a otro mes o la transferencia no coincide con el monto."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold p-3 focus:bg-white focus:outline-none focus:border-rose-500"
                      rows={2.5}
                    />
                  </div>
                )}

              </div>

              {/* Modal Actions */}
              <div className="p-6 border-t border-slate-150 bg-slate-50 flex items-center justify-between">
                {!showRejectInput ? (
                  <>
                    <button
                      onClick={() => setShowRejectInput(true)}
                      className="px-4 py-2.5 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Rechazar Pago
                    </button>
                    <button
                      onClick={() => handleApprovePayment(verifyingPayment.id)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs flex items-center space-x-1 cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      <span>Aprobar Pago</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowRejectInput(false)}
                      className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
                    >
                      Volver
                    </button>
                    <button
                      onClick={() => handleRejectPayment(verifyingPayment.id)}
                      disabled={!rejectReason}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white disabled:bg-slate-300 rounded-xl font-bold text-xs uppercase tracking-wider shadow-xs cursor-pointer"
                    >
                      Confirmar Rechazo
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Mobile Bottom Navigation (Hidden on desktop) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 h-16 flex justify-around items-center px-4 z-40 select-none">
        
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'metrics' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-[10px] font-bold">Métricas</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`flex flex-col items-center space-y-1 relative ${
            activeTab === 'payments' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <CreditCard className="h-5 w-5" />
          <span className="text-[10px] font-bold">Pagos</span>
          {revisionPayments.length > 0 && (
            <span className="absolute right-1 top-0 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'register' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Plus className="h-5 w-5" />
          <span className="text-[10px] font-bold">Inscribir</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold">Perfil</span>
        </button>

      </nav>

    </div>
  );
};
