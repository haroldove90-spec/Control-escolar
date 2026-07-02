import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Payment, Notification, UserRole } from './types';
import { INITIAL_STUDENTS, INITIAL_PAYMENTS, INITIAL_NOTIFICATIONS } from './mockData';

interface SchoolContextType {
  students: Student[];
  payments: Payment[];
  notifications: Notification[];
  currentRole: UserRole;
  currentStudentId: string | null;
  setCurrentRole: (role: UserRole) => void;
  setCurrentStudentId: (id: string | null) => void;
  
  // Actions
  registerStudent: (studentData: Omit<Student, 'id' | 'status' | 'enrollmentDate'>, initialFeeMonth: string, amount: number) => void;
  suspendStudent: (studentId: string) => void;
  reactivateStudent: (studentId: string) => void;
  sendTuitionNotice: (paymentId: string) => void;
  approvePayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string, reason: string) => void;
  submitProof: (paymentId: string, proofName: string, notes: string) => void;
  updateStudentProfile: (studentId: string, profileData: Partial<Student>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role: UserRole, studentId?: string) => void;
  resetToDefaults: () => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage or use mockData
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('school_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('school_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('home');
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(() => {
    const saved = localStorage.getItem('school_current_student_id');
    return saved ? saved : 'std-1'; // Default simulated student
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('school_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem('school_current_student_id', currentStudentId);
    } else {
      localStorage.removeItem('school_current_student_id');
    }
  }, [currentStudentId]);

  // Create standard helper to add notification
  const addNotification = (
    title: string,
    message: string,
    role: 'admin' | 'estudiante',
    type: Notification['type'],
    studentId?: string
  ) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      role,
      studentId,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. Admin action: Register Student
  const registerStudent = (
    studentData: Omit<Student, 'id' | 'status' | 'enrollmentDate'>,
    initialFeeMonth: string,
    amount: number
  ) => {
    const studentId = `std-${Date.now()}`;
    const newStudent: Student = {
      ...studentData,
      id: studentId,
      status: 'activo',
      enrollmentDate: new Date().toISOString().split('T')[0]
    };

    // Create the initial payment record
    const paymentId = `pay-${Date.now()}`;
    const newPayment: Payment = {
      id: paymentId,
      studentId,
      studentName: studentData.name,
      month: initialFeeMonth,
      amount,
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 10).toISOString().split('T')[0], // Next month 10th
      status: 'pendiente'
    };

    setStudents(prev => [...prev, newStudent]);
    setPayments(prev => [...prev, newPayment]);

    // Send notification to Admin and the Student
    addNotification(
      'Nuevo Registro',
      `El alumno ${newStudent.name} ha sido registrado exitosamente en el grado ${newStudent.grade}.`,
      'admin',
      'reactivacion',
      studentId
    );

    addNotification(
      'Bienvenido al Portal',
      `Hola ${newStudent.name}, tu cuenta ha sido creada. Tu próximo pago de colegiatura corresponde a ${initialFeeMonth}.`,
      'estudiante',
      'reactivacion',
      studentId
    );
  };

  // 2. Admin action: Suspend Student
  const suspendStudent = (studentId: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status: 'suspendido' } : s))
    );

    const student = students.find(s => s.id === studentId);
    const studentName = student ? student.name : 'Estudiante';

    addNotification(
      'Suspensión Temporal',
      `El alumno ${studentName} ha sido suspendido temporalmente por falta de pago.`,
      'admin',
      'suspension',
      studentId
    );

    addNotification(
      'Cuenta Suspendida',
      'Has sido suspendido temporalmente por falta de pago de tu colegiatura. Realiza tu pago y sube el comprobante para regularizar tu estatus.',
      'estudiante',
      'suspension',
      studentId
    );
  };

  // 3. Admin action: Reactivate Student
  const reactivateStudent = (studentId: string) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status: 'activo' } : s))
    );

    const student = students.find(s => s.id === studentId);
    const studentName = student ? student.name : 'Estudiante';

    addNotification(
      'Reactivación de Alumno',
      `El alumno ${studentName} ha sido reactivado y se encuentra al corriente.`,
      'admin',
      'reactivacion',
      studentId
    );

    addNotification(
      'Cuenta Reactivada',
      '¡Felicidades! Tu cuenta ha sido reactivada. Ya tienes acceso completo a tus actividades escolares.',
      'estudiante',
      'reactivacion',
      studentId
    );
  };

  // 4. Admin action: Send tuition notice (Aviso de pago)
  const sendTuitionNotice = (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    // Trigger notification to student
    addNotification(
      'Aviso de Colegiatura',
      `Tu pago para el mes de ${payment.month} por $${payment.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} está próximo a vencer el ${payment.dueDate}.`,
      'estudiante',
      'pago_por_vencer',
      payment.studentId
    );

    // Let the admin know notice was sent
    addNotification(
      'Recordatorio Enviado',
      `Se envió un aviso de cobro a ${payment.studentName} para el periodo ${payment.month}.`,
      'admin',
      'pago_por_vencer',
      payment.studentId
    );
  };

  // 5. Admin action: Approve Payment
  const approvePayment = (paymentId: string) => {
    let studentIdToReactivate: string | null = null;

    setPayments(prev =>
      prev.map(p => {
        if (p.id === paymentId) {
          studentIdToReactivate = p.studentId;
          return {
            ...p,
            status: 'pagado',
            paymentDate: new Date().toISOString().split('T')[0]
          };
        }
        return p;
      })
    );

    // Fetch details for notifications
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    // Send notifications
    addNotification(
      'Comprobante Aprobado',
      `Se ha verificado el pago de ${payment.studentName} para ${payment.month} por un total de $${payment.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}.`,
      'admin',
      'pago_recibido',
      payment.studentId
    );

    addNotification(
      'Pago Confirmado',
      `¡Tu pago de ${payment.month} ha sido aprobado! Gracias por estar al corriente.`,
      'estudiante',
      'pago_recibido',
      payment.studentId
    );

    // Sync Check: If the student was suspended, let's see if they have any other "vencido" payments.
    // If they have no other vencido payments, reactivate them automatically!
    if (studentIdToReactivate) {
      const studentId = studentIdToReactivate as string;
      setTimeout(() => {
        setPayments(allPayments => {
          setStudents(allStudents => {
            const student = allStudents.find(s => s.id === studentId);
            if (student && student.status === 'suspendido') {
              // Check if there are any other 'vencido' payments for this student
              // excluding the one we just approved (which is now 'pagado' in memory, but we need to verify with the latest state)
              const hasOverdue = allPayments.some(p => p.studentId === studentId && p.id !== paymentId && p.status === 'vencido');
              if (!hasOverdue) {
                // Reactivate student!
                reactivateStudent(studentId);
              }
            }
            return allStudents;
          });
          return allPayments;
        });
      }, 50);
    }
  };

  // 6. Admin action: Reject Payment
  const rejectPayment = (paymentId: string, reason: string) => {
    setPayments(prev =>
      prev.map(p => (p.id === paymentId ? { ...p, status: 'vencido', notes: `Rechazado: ${reason}` } : p))
    );

    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    addNotification(
      'Pago Rechazado',
      `El comprobante de ${payment.studentName} para ${payment.month} fue rechazado. Razón: ${reason}`,
      'admin',
      'suspension',
      payment.studentId
    );

    addNotification(
      'Comprobante Rechazado',
      `Tu comprobante de pago para ${payment.month} fue rechazado. Detalle: ${reason}. Por favor, vuelve a subir un comprobante válido.`,
      'estudiante',
      'suspension',
      payment.studentId
    );

    // If payment is overdue, we can suspend the student as well (user rule: non-paid student suspended)
    setTimeout(() => {
      suspendStudent(payment.studentId);
    }, 50);
  };

  // 7. Student action: Submit Proof (Notificar Pago)
  const submitProof = (paymentId: string, proofName: string, notes: string) => {
    let studentName = '';
    let studentId = '';
    let targetMonth = '';

    setPayments(prev =>
      prev.map(p => {
        if (p.id === paymentId) {
          studentName = p.studentName;
          studentId = p.studentId;
          targetMonth = p.month;
          return {
            ...p,
            status: 'revision',
            proofName,
            proofData: `Uploaded proof of payment: ${proofName} at ${new Date().toLocaleTimeString()}`,
            notes: notes || undefined
          };
        }
        return p;
      })
    );

    if (!studentId) return;

    // Notification to Admin: Student paid!
    addNotification(
      'Nuevo Comprobante de Pago',
      `El estudiante ${studentName} ha enviado su comprobante de pago para el mes de ${targetMonth}. Por favor verifícalo.`,
      'admin',
      'revision_pago',
      studentId
    );

    // Notification to Student: Confirmation of upload
    addNotification(
      'Comprobante Recibido',
      `Hemos recibido tu comprobante para el mes de ${targetMonth}. Tu pago se encuentra en proceso de validación.`,
      'estudiante',
      'revision_pago',
      studentId
    );
  };

  // 8. Student action: Update Student Profile (designed for mobile)
  const updateStudentProfile = (studentId: string, profileData: Partial<Student>) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, ...profileData } : s))
    );

    // Synchronize payment records if student name changed
    if (profileData.name) {
      setPayments(prev =>
        prev.map(p => (p.studentId === studentId ? { ...p, studentName: profileData.name! } : p))
      );
    }

    addNotification(
      'Perfil Actualizado',
      `El estudiante ${profileData.name || 'de la cuenta'} actualizó sus datos de contacto desde su celular.`,
      'admin',
      'reactivacion',
      studentId
    );

    addNotification(
      'Perfil Guardado',
      'Has actualizado los datos de tu perfil escolar exitosamente.',
      'estudiante',
      'reactivacion',
      studentId
    );
  };

  // 9. Utility action: Mark single notification read
  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // 10. Utility action: Mark all notifications read
  const markAllNotificationsRead = (role: UserRole, studentId?: string) => {
    setNotifications(prev =>
      prev.map(n => {
        if (n.role === role) {
          if (role === 'estudiante' && n.studentId !== studentId) {
            return n;
          }
          return { ...n, read: true };
        }
        return n;
      })
    );
  };

  // 11. Reset to defaults
  const resetToDefaults = () => {
    setStudents(INITIAL_STUDENTS);
    setPayments(INITIAL_PAYMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentRole('admin');
    setCurrentStudentId('std-1');
    localStorage.removeItem('school_students');
    localStorage.removeItem('school_payments');
    localStorage.removeItem('school_notifications');
    localStorage.removeItem('school_current_student_id');
  };

  return (
    <SchoolContext.Provider
      value={{
        students,
        payments,
        notifications,
        currentRole,
        currentStudentId,
        setCurrentRole,
        setCurrentStudentId,
        registerStudent,
        suspendStudent,
        reactivateStudent,
        sendTuitionNotice,
        approvePayment,
        rejectPayment,
        submitProof,
        updateStudentProfile,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDefaults
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
