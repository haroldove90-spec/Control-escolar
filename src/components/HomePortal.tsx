import React from 'react';
import { useSchool } from '../SchoolContext';
import { ShieldAlert, GraduationCap, Users, ArrowRight, RefreshCw, Smartphone, Laptop } from 'lucide-react';
import { motion } from 'motion/react';

export const HomePortal: React.FC = () => {
  const { students, currentStudentId, setCurrentStudentId, setCurrentRole, resetToDefaults } = useSchool();

  const handleSelectAdmin = () => {
    setCurrentRole('admin');
  };

  const handleSelectStudent = (studentId: string) => {
    setCurrentStudentId(studentId);
    setCurrentRole('estudiante');
  };

  const activeStudent = students.find(s => s.id === currentStudentId) || students[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-8 md:p-12 font-sans selection:bg-indigo-100">
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex justify-between items-center bg-white border border-slate-200/80 px-6 py-4 rounded-3xl shadow-xs mb-8">
        <div className="flex items-center space-x-3.5">
          <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-indigo-200 font-bold tracking-tight">
            CE
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg tracking-tight text-indigo-950 uppercase leading-none">Control Escolar</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Sincronización de Colegiaturas</p>
          </div>
        </div>
        
        <button
          onClick={resetToDefaults}
          className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reiniciar Datos</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto w-full my-auto py-6 sm:py-12">
        <div className="text-center mb-10 sm:mb-12">
          <span className="px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-bold text-indigo-700 tracking-widest uppercase inline-block mb-3.5">
            SISTEMA ACADÉMICO COLEGIAL
          </span>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none"
          >
            Acceso al Portal Educativo
          </motion.h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 max-w-md mx-auto font-bold uppercase tracking-wide leading-relaxed">
            Selecciona tu perfil de usuario para ingresar al panel directivo escolar o al área personal de alumnos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Admin Role Card */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-28 w-28 bg-indigo-50 rounded-bl-full -z-0 opacity-40 transition-transform group-hover:scale-110" />
            
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-xs">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight mb-1">Área Directiva</h3>
              <p className="text-[10px] text-indigo-600 font-extrabold uppercase tracking-wider mb-5">Rol: Administrador / Maestro</p>
              
              <ul className="space-y-3 text-slate-600 text-xs font-semibold mb-8">
                <li className="flex items-center space-x-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  <span>Métricas de recaudación escolar y bento charts</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  <span>Registro y catálogo inteligente de alumnos</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  <span>Validación de comprobantes y recibos SPEI</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  <span>Suspensión y reactivación automática</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleSelectAdmin}
              className="relative z-10 w-full py-4 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-150 transition-all duration-250 cursor-pointer text-xs uppercase tracking-wider"
            >
              <span>Ingresar como Administrador</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Student Role Card */}
          <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all flex flex-col justify-between group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-50 rounded-bl-full -z-0 opacity-40 transition-transform group-hover:scale-110" />
            
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-6 shadow-xs">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 tracking-tight mb-1">Portal Estudiantes</h3>
                <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider mb-5">Rol: Alumno / Padre de Familia</p>
                
                <ul className="space-y-3 text-slate-600 text-xs font-semibold mb-6">
                  <li className="flex items-center space-x-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span>Consulta de estatus (Al Corriente / Suspendido)</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span>Avisos de cobro y fechas límites vigentes</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span>Envío directo de comprobantes de pago</span>
                  </li>
                  <li className="flex items-center space-x-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    <span>Edición de perfil (Optimizada para Celular)</span>
                  </li>
                </ul>
              </div>

              {/* Selector de estudiante para pruebas */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-250/60 mb-6">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Simular Estudiante de Prueba:
                </label>
                <select
                  value={currentStudentId || ''}
                  onChange={(e) => setCurrentStudentId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl text-xs font-bold p-3 text-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.grade}) — {student.status.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 px-1 font-bold">
                  <span>ESTADO ACADÉMICO:</span>
                  <span className={`font-black px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider ${
                    activeStudent?.status === 'activo' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {activeStudent?.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectStudent(currentStudentId || students[0]?.id)}
              className="relative z-10 w-full py-4 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-150 transition-all duration-250 cursor-pointer text-xs uppercase tracking-wider"
            >
              <span>Ingresar como Estudiante</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-extrabold uppercase tracking-wider space-y-4 sm:space-y-0">
        <p>© 2026 Plataforma Control Escolar • Sincronización Segura de Datos</p>
        <div className="flex space-x-6 items-center">
          <span className="flex items-center space-x-1.5">
            <Laptop className="h-3.5 w-3.5 text-slate-400" />
            <span>Computadora</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <Smartphone className="h-3.5 w-3.5 text-slate-400" />
            <span>Celular / Tablet</span>
          </span>
        </div>
      </div>
    </div>
  );
};
